import { assert, expect, describe, it } from 'vitest';
import * as curve from '../curve.js';

describe('curve', () => {
  describe('equilibrium', () => {
    it('discrete curves', () => {
      const a = curve.discrete(1, [0, 1, 2, 3, 4, 5, 6]);
      const b = curve.discrete(-1, [0, 1, 2, 3, 4, 5, 6]);
      expect(curve.equilibrium(a, b)).toEqual({ ok: true, q: 3, p: 3 });
    });
  });
});

