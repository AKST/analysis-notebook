/**
 * @import { DataFrame, FieldDescriptor, GpuType, GpuTypeDeclare } from './type.ts';
 */
import { elemOf, sizeOf, shapeOf, alignmentOf } from './util.js';
import { Unreachable } from '../../util/type.js';

export class MemoryLayout {
  /** @type {number} */ #stride;
  /** @type {{ name: string, type: GpuType }[]} */ #fields;

  /**
   * @param {{ name: string, type: GpuType }[]} fields
   * @param {number} stride
   */
  constructor(fields, stride) {
    this.#fields = fields;
    this.#stride = stride;
  }

  /** @returns {readonly { name: string, type: GpuType }[]} */
  get fields() { return this.#fields; }

  get stride() { return this.#stride; }

  /** @param {...any} args */
  createRecord(...args) {
    if (args.length != this.#fields.length) throw new Error();
    return Object.fromEntries(
      this.#fields.map((o, i) => ([o.name, args[i]]))
    );
  }

  /**
   * @param {(
   *   | { kind: 'struct' }
   *   | { kind: 'array', rows: number }
   * )} variant
   * @returns {ArrayBuffer}
   */
  createArrayBuffer(variant) {
    switch (variant.kind) {
      case 'struct':
        return new ArrayBuffer(this.#stride);
      case 'array':
        return new ArrayBuffer(this.#stride * variant.rows);
      default:
        throw new Unreachable(variant);
    }
  }

  /** @param {{ name: string, type: GpuType }[]} fields */
  static create(fields) {
    return new MemoryLayout(fields, MemoryLayout.computeStride(fields));
  }

  /** @param {{ name: string, type: GpuType }[]} fields */
  static computeStride(fields) {
    let stride = 0, maxAlignment = 1;

    for (const field of fields) {
      const fieldSize = sizeOf(field.type);
      const alignment = alignmentOf(field.type);
      maxAlignment = Math.max(maxAlignment, alignment);
      stride = (Math.ceil(stride / alignment) * alignment) + fieldSize;
    }

    return Math.ceil(stride / maxAlignment) * maxAlignment;
  }
}

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
 * Write to a cell from a table of data with an
 * ambigious layout and structure.
 *
 * @param {DataFrame} df
 * @param {number} row
 * @param {string} col
 * @param {any} value
 */
function writeCell(df, row, col, value) {
  switch (df.kind) {
    case 'rows':
      df.rows[row][col] = value;
      break;
    case 'cols':
      df.cols[col][row] = value;
      break;
    default:
      throw new Unreachable(df);
  }
}

/**
 * Writes structured data to an ArrayBuffer with proper alignment
 * @param {{
 *   arrayBuffer: ArrayBuffer,
 *   layout: MemoryLayout,
 *   data: DataFrame,
 *   writeTo: number,
 *   readFrom: number,
 * }} params
 * @returns {number} - final offset after writing
 */
export function writeStructuredData({
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

  for (const field of layout.fields) {
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
 * Reads structured data from an ArrayBuffer with proper alignment
 * @param {{
 *   arrayBuffer: ArrayBuffer,
 *   layout: MemoryLayout,
 *   data: DataFrame,
 *   readFrom: number,
 *   writeTo: number,
 * }} params
 * @returns {number} - final offset after reading
 */
export function readStructuredData({
  arrayBuffer,
  layout,
  data,
  readFrom,
  writeTo,
}) {
  const dataAsFloat = new Float32Array(arrayBuffer);
  const dataAsUint = new Uint32Array(arrayBuffer);
  const dataAsSint = new Int32Array(arrayBuffer);

  let offset = readFrom;

  for (const field of layout.fields) {
    const fieldSize = sizeOf(field.type);
    const alignment = alignmentOf(field.type);
    offset = Math.ceil(offset / alignment) * alignment;
    const idx = offset / 4;

    const shape = shapeOf(field.type);
    const elemType = elemOf(field.type);

    let value;
    switch (shape) {
      case 'scalar': {
        switch (elemType) {
          case 'f32':
            value = dataAsFloat[idx];
            break;
          case 'u32':
            value = dataAsUint[idx];
            break;
          case 'i32':
            value = dataAsSint[idx];
            break;
          default:
            throw new Unreachable(elemType);
        }
        break;
      }
      case 'vector': {
        const length = fieldSize / sizeOf(elemType);
        switch (elemType) {
          case 'f32':
            value = Array.from(dataAsFloat.slice(idx, idx + length));
            break;
          case 'u32':
            value = Array.from(dataAsUint.slice(idx, idx + length));
            break;
          case 'i32':
            value = Array.from(dataAsSint.slice(idx, idx + length));
            break;
          default:
            throw new Unreachable(elemType);
        }
        break;
      }
      case 'DOMMatrix': {
        const length = fieldSize / sizeOf(elemType);
        const matrixData = dataAsFloat.slice(idx, idx + length);
        value = new DOMMatrix(Array.from(matrixData));
        break;
      }
      default:
        throw new Unreachable(shape);
    }

    writeCell(data, writeTo, field.name, value);
    offset += fieldSize;
  }

  return offset;
}

/**
 * Creates a contiguous array buffer from structured data with proper alignment
 * @param {{
 *   rows: number,
 *   data: DataFrame,
 *   layout: MemoryLayout,
 * }} config
 * @returns {ArrayBuffer}
 */
export function createContiguousArray({ rows, data, layout }) {
  const arrayBuffer = new ArrayBuffer(rows * layout.stride);

  for (let i = 0; i < rows; i++) {
    writeStructuredData({
      arrayBuffer,
      layout,
      data,
      writeTo: i * layout.stride,
      readFrom: i,
    });
  }

  return arrayBuffer;
}


/**
 * @param {{
 *   rows: Record<string, any>[],
 *   layout: MemoryLayout,
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
  /** @type {GPUBuffer | undefined} */ #_internalBuffer = undefined;

  /**
   * @param {MemoryLayout} layout
   * @param {Record<string, any>} state
   */
  constructor(layout, state) {
    this.layout = layout;
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
    return new UniformAdapter(MemoryLayout.create(uniforms), state);
  }

  /**
   * @param {MemoryLayout} layout
   * @param {Record<string, any>} [state]
   */
  static fromLayout(layout, state = {}) {
    return new UniformAdapter(layout, state);
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
    const arrayBuffer = new ArrayBuffer(this.layout.stride);
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
      layout: this.layout,
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
        size: this.layout.stride,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
    }
    return this.#_internalBuffer;
  }
}
