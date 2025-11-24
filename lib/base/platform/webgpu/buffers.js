/**
 * @import { DataFrame, FieldDescriptor, GpuType, GpuTypeDeclare } from './type.ts';
 */
import { elemOf, sizeOf, shapeOf, alignmentOf } from './util.js';
import { Unreachable } from '../../util/type.js';

/**
 * Reads a cell from a table of data with an
 * ambigious layout and structure.
 *
 * @param {DataFrame} df
 * @param {number} row
 * @param {string} col
 * @returns {any}
 */
function readCell(df, row, col) {
  switch (df.kind) {
    case 'rows': return df.rows[row][col];
    case 'cols': return df.cols[col][row];
    default: throw new Unreachable(df);
  }
}

/**
 * Writes structured data to an ArrayBuffer with proper alignment
 * @param {{
 *   arrayBuffer: ArrayBuffer,
 *   layout: { name: string, type: GpuType }[],
 *   data: DataFrame,
 *   writeTo: number,
 *   readFrom: number,
 * }} params
 * @returns {number} - final offset after writing
 */
function writeStructuredData({
  arrayBuffer,
  layout,
  data,
  writeTo,
  readFrom,
}) {
  const dataAsFloat = new Float32Array(arrayBuffer);
  const dataAsUint = new Uint32Array(arrayBuffer);
  const dataAsSint = new Int32Array(arrayBuffer);

  let offset = writeTo;

  for (const field of layout) {
    const fieldSize = sizeOf(field.type);
    const alignment = alignmentOf(field.type);
    offset = Math.ceil(offset / alignment) * alignment;
    const idx = offset / 4;

    const value = readCell(data, readFrom, field.name);
    const shape = shapeOf(field.type);
    const elemType = elemOf(field.type);

    let valueArray;
    switch (shape) {
      case 'scalar':
        valueArray = [value];
        break;
      case 'vector':
        valueArray = value;
        break;
      case 'DOMMatrix':
        valueArray = value.toFloat32Array();
        break;
      default:
        throw new Unreachable(shape);
    }

    switch (elemType) {
      case 'f32':
        dataAsFloat.set(valueArray, idx);
        break;
      case 'u32':
        dataAsUint.set(valueArray, idx);
        break;
      case 'i32':
        dataAsSint.set(valueArray, idx);
        break;
      default:
        throw new Unreachable(elemType);
    }

    offset += fieldSize;
  }

  return offset;
}

/**
 * Creates a contiguous array buffer from structured data with proper alignment
 * @param {{
 *   rows: number,
 *   data: DataFrame,
 *   layout: FieldDescriptor[],
 * }} config
 * @returns {ArrayBuffer}
 */
export function createContiguousArray({ rows, data, layout }) {
  let stride = 0, maxAlignment = 1;

  for (const field of layout) {
    const fieldSize = sizeOf(field.type);
    const alignment = alignmentOf(field.type);
    maxAlignment = Math.max(maxAlignment, alignment);
    stride = (Math.ceil(stride / alignment) * alignment) + fieldSize;
  }

  stride = Math.ceil(stride / maxAlignment) * maxAlignment;
  const arrayBuffer = new ArrayBuffer(rows * stride);

  for (let i = 0; i < rows; i++) {
    writeStructuredData({
      arrayBuffer,
      layout,
      data,
      writeTo: i * stride,
      readFrom: i,
    });
  }

  return arrayBuffer;
}


/**
 * @param {{
 *   rows: Record<string, any>[],
 *   layout: FieldDescriptor[],
 * }} config
 * @returns {ArrayBuffer}
 */
export function createContiguousArrayFromRows({ rows, layout }) {
  return createContiguousArray({
    rows: rows.length,
    data: { kind: 'rows', rows },
    layout,
  });
}

export class UniformAdapter {
  /** @type {GPUBuffer | undefined} */
  #_internalBuffer = undefined;

  /**
   * @param {{ name: string, type: GpuType }[]} uniforms
   * @param {Record<string, any>} state
   */
  constructor(uniforms, state) {
    this.uniforms = uniforms;
    this.state = state;
  }

  /**
   * @param {GpuTypeDeclare<any>[]} uniformDef
   */
  static create(uniformDef) {
    const state = {};
    const uniforms = [];
    for (const { name, init, type } of uniformDef) {
      // @ts-ignore - problem for later
      state[name] = init;
      uniforms.push({ name, type });
    }
    return new UniformAdapter(uniforms, state);
  }

  /**
   * @returns {number}
   */
  get bufferSize() {
    let offset = 0;
    for (const uniform of this.uniforms) {
      const alignment = alignmentOf(uniform.type);
      offset = Math.ceil(offset / alignment) * alignment;
      offset += sizeOf(uniform.type);
    }
    return Math.ceil(offset / 16) * 16;
  }

  /**
   * @param {string} key
   * @param {unknown} value
   */
  update(key, value) {
    this.state[key] = value;
  }

  /**
   * @param {GPUDevice} device
   */
  updateBuffer(device) {
    const arrayBuffer = new ArrayBuffer(this.bufferSize);
    this.writeToArrayBuffer(arrayBuffer);
    const internalBuffer = this.getBuffer(device);
    device.queue.writeBuffer(internalBuffer, 0, arrayBuffer);
  }

  /**
   * @param {ArrayBuffer} arrayBuffer
   */
  writeToArrayBuffer(arrayBuffer) {
    writeStructuredData({
      arrayBuffer,
      layout: this.uniforms,
      data: { kind: 'rows', rows: [this.state] },
      writeTo: 0,
      readFrom: 0,
    });
  }

  /**
   * @param {GPUDevice} device
   * @return {GPUBuffer}
   */
  getBuffer(device) {
    if (this.#_internalBuffer == null) {
      this.#_internalBuffer = device.createBuffer({
        size: this.bufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
    }
    return this.#_internalBuffer;
  }
}
