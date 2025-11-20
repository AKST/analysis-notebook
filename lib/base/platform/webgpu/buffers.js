/**
 * @import { GpuType, GpuTypeDeclare } from './type.ts';
 */
import { elemOf, sizeOf, shapeOf } from './util.js';
import { Unreachable } from '../../util/type.js';

/**
 * @typedef {{
 *   type: GpuType,
 *   name: string,
 * }} FieldDescriptor
 */

/**
 * @param {GPUDevice} device
 * @param {(Uint32Array | Float32Array)[]} arrays
 * @param {number} flag
 */
export function initStructArrayBuffer(device, arrays, flag) {
  const BYTES_PER_ELEMENT = 4;
  const length = arrays[0].length
  let size = BYTES_PER_ELEMENT;

  for (let i = 1; i < arrays.length; i++) {
    if (length !== arrays[i].length) throw new Error();
    size += BYTES_PER_ELEMENT
    if (arrays[i] instanceof Float32Array) continue;
    if (arrays[i] instanceof Uint32Array) continue;
  }

  const arrayBuffer = new ArrayBuffer(size * length);
  const df32 = new Float32Array(arrayBuffer);
  const du32 = new Uint32Array(arrayBuffer);

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < arrays.length; j++) {
      const array = arrays[j];
      const idx = i * (size / 4) + j;
      if (array instanceof Uint32Array) {
        du32[idx] = array[i];
      } else {
        df32[idx] = array[i];
      }
    }
  }

  const buffer = device.createBuffer({
    size: size * length,
    usage: GPUBufferUsage.STORAGE | flag,
  });
  device.queue.writeBuffer(buffer, 0, arrayBuffer);
  return buffer;
}

/**
 * Writes structured data to an ArrayBuffer with proper alignment
 * @param {{
 *   arrayBuffer: ArrayBuffer,
 *   layout: { name: string, type: GpuType }[],
 *   data: Record<string, any>,
 *   baseOffset: number,
 * }} params
 * @returns {number} - final offset after writing
 */
function writeStructuredData({ arrayBuffer, layout, data, baseOffset }) {
  const dataAsFloat = new Float32Array(arrayBuffer);
  const dataAsUint = new Uint32Array(arrayBuffer);
  const dataAsSint = new Int32Array(arrayBuffer);

  let offset = baseOffset;

  for (const field of layout) {
    const fieldSize = sizeOf(field.type);
    const alignment = Math.min(fieldSize, 16);
    offset = Math.ceil(offset / alignment) * alignment;
    const idx = offset / 4;

    const value = data[field.name];
    const shape = shapeOf(field.type);
    const elemType = elemOf(field.type);

    // Convert value to array
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

    // Write to appropriate typed array
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
 *   data: Record<string, any>[],
 *   layout: FieldDescriptor[],
 * }} config
 * @returns {Float32Array}
 */
export function createContiguousArray({ data, layout }) {
  // Calculate stride (bytes per instance)
  let stride = 0;
  for (const field of layout) {
    const fieldSize = sizeOf(field.type);
    const alignment = Math.min(fieldSize, 16);
    stride = Math.ceil(stride / alignment) * alignment;
    stride += fieldSize;
  }

  // Create buffer
  const arrayBuffer = new ArrayBuffer(data.length * stride);

  // Fill buffer for each instance
  for (let i = 0; i < data.length; i++) {
    writeStructuredData({
      arrayBuffer,
      layout,
      data: data[i],
      baseOffset: i * stride,
    });
  }

  return new Float32Array(arrayBuffer);
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
      const alignment = Math.min(sizeOf(uniform.type), 16);
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

    writeStructuredData({
      arrayBuffer,
      layout: this.uniforms,
      data: this.state,
      baseOffset: 0,
    });

    const internalBuffer = this.getBuffer(device);
    device.queue.writeBuffer(internalBuffer, 0, arrayBuffer);
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
