/**
 * @import { GpuType, GpuTypeDeclare } from './type.ts';
 */
import { sizeOf } from './util.js';

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
    const dataAsFloat = new Float32Array(arrayBuffer);
    const dataAsUint = new Uint32Array(arrayBuffer);

    let offset = 0;
    for (const uniform of this.uniforms) {
      const fieldSize = sizeOf(uniform.type);
      const alignment = Math.min(fieldSize, 16);
      offset = Math.ceil(offset / alignment) * alignment;
      const value = this.state[uniform.name];
      const idx = offset / 4;

      if (fieldSize === 4) {
        if (uniform.type === 'u32') {
          dataAsUint[idx] = value;
        } else {
          dataAsFloat[idx] = value;
        }
      } else {
        throw new Error('not implemented');
      }
      offset += fieldSize;
    }

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
