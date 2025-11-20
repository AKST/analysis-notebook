import { GpuTextureMeta } from '@base/platform/webgpu/type.ts';
import { UniformAdapter } from '@base/platform/webgpu/buffers.js';

export type Uniforms = {
  meshRender: UniformAdapter,
  meshGen: UniformAdapter,
  text: UniformAdapter,
};

export type Buffers = {
  meshVertices: GPUBuffer,
  textVertices: GPUBuffer,
  textLabourInstance: GPUBuffer,
  textCapitalInstance: GPUBuffer,
};

export type Textures = {
  labour: GPUTexture,
  capital: GPUTexture,
};
