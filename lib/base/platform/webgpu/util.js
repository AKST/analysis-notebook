/**
 * @import { GpuType } from './type.ts';
 */
import { Unreachable } from '../../util/type.js';

/**
 * @param {GpuType} t
 * @returns {number}
 */
export function sizeOf(t) {
  switch (t) {
    case 'i32':
    case 'u32':
    case 'f32':
      return 4;

    case 'vec2<i32>':
    case 'vec2<u32>':
    case 'vec2<f32>':
      return 4 * 2;

    case 'vec3<i32>':
    case 'vec3<u32>':
    case 'vec3<f32>':
      return 4 * 3;

    case 'vec4<i32>':
    case 'vec4<u32>':
    case 'vec4<f32>':
      return 4 * 4;

    case 'mat3x3<i32>':
    case 'mat3x3<u32>':
    case 'mat3x3<f32>':
      return 4 * 3 * 3;

    case 'mat4x4<i32>':
    case 'mat4x4<u32>':
    case 'mat4x4<f32>':
      return 4 * 4 * 4;

    default:
      throw new Unreachable(t);
  }
}
