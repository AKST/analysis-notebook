export type GpuTypeDeclare<Type> = {
  name: string,
  type: Type,
  init?: GpuTypeInCpu<Type>,
};

export type GpuType =
  | 'f32' | 'i32' | 'u32'
  | `vec${'2' | '3' | '4'}<${'f32' | 'i32' | 'u32'}>`
  | `mat3x3<${'f32' | 'i32' | 'u32'}>`
  | `mat4x4<${'f32' | 'i32' | 'u32'}>`;

export type GpuTypeInCpu<Type> =
  Type extends 'f32' ? number :
  Type extends 'u32' ? number :
  Type extends 'i32' ? number :
  Type extends `vec2<${'f32' | 'i32' | 'u32'}>` ? [number, number] :
  Type extends `vec3<${'f32' | 'i32' | 'u32'}>` ? [number, number, number] :
  Type extends `vec4<${'f32' | 'i32' | 'u32'}>` ? [number, number, number, number] :
  Type extends `mat4x4<${'f32' | 'i32' | 'u32'}>` ? DOMMatrix :
  never;

export type GpuTextureMeta = {
  text: string,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  size: [number, number],
};
