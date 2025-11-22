/**
 * @import { GpuType, GpuTypeDeclare } from './type.ts';
 */
import { elemOf, sizeOf, shapeOf, alignmentOf } from './util.js';
import { Unreachable } from '../../util/type.js';

/**
 * @typedef {{
 *   type: GpuType,
 *   name: string,
 * }} FieldDescriptor
 */

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
    const alignment = alignmentOf(field.type);
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
  let maxAlignment = 1;

  for (const field of layout) {
    const fieldSize = sizeOf(field.type);
    const alignment = alignmentOf(field.type);
    maxAlignment = Math.max(maxAlignment, alignment);
    stride = Math.ceil(stride / alignment) * alignment;
    stride += fieldSize;
  }

  // Round stride up to struct alignment
  stride = Math.ceil(stride / maxAlignment) * maxAlignment;

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
