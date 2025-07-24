import { expect, describe, it } from 'vitest';

import type { VectorOf } from '../../math/type.js';
import { vector as v } from '../../math/value.js';
import { convexHull, clip } from '../index.js';

describe('ConvexHull', () => {
  it('test', () => {
    const result = convexHull([v(2)(16, 8), v(2)(4, 4)], v(2)(0, 0));
    const expected = [v(2)(0, 0), v(2)(20, 0), v(2)(16, 4), v(2)(0, 12)];

    expect(result.length).toEqual(expected.length);
    for (let i = 0; i < expected.length; i++) {
      expect(result[i]).toEqual(expected[i]);
    }
  });
});

describe('clip', () => {
  describe('horizontal floor', () => {
    it('parallelogram', () => {
      const input: VectorOf<'r', 2>[] = [
        v(2)(0, 3), v(2)(5, 3),
        v(2)(0, -2), v(2)(-5, -2),
      ];

      expect(clip({ y: { floor: 0 } }, input)).toEqual([
        v(2)(0, 3), v(2)(5, 3),
        v(2)(2, 0), v(2)(-3, 0),
      ]);
    });

    it('other order parallelogram', () => {
      const input: VectorOf<'r', 2>[] = [
        v(2)(0, 3), v(2)(-5, -2),
        v(2)(0, -2), v(2)(5, 3),
      ];

      expect(clip({ y: { floor: 0 } }, input)).toEqual([
        v(2)(0, 3),
        v(2)(-3, 0),
        v(2)(2, 0),
        v(2)(5, 3),
      ]);
    });
  });
});


