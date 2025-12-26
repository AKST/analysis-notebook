/**
 * @import { Vec2 } from './type.ts';
 */
import { vector } from '../math/value.js';

/** @param {number} a @param {number} b */
export const v2 = (a, b) => vector(2)(a, b);

/**
 * @param {Vec2} bottomLeft
 * @param {number} w
 * @param {number} h
 * @returns {Vec2[]}
 */
export function square(bottomLeft, w, h) {
  const { vec: [x, y] } = bottomLeft;
  return [
    v2(x, y+h),
    v2(x+w, y+h),
    v2(x+w, y),
    bottomLeft,
  ];
}
