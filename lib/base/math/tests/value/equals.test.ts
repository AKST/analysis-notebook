import { expect, describe, it } from 'vitest';
import { equals, unit } from '../../index.js';

const { c, m, v } = unit;

describe('equals function', () => {
  describe('number comparisons', () => {
    it('compares equal numbers', () => {
      expect(equals(5, 5)).toEqual(true);
      expect(equals(-2, -2)).toEqual(true);
      expect(equals(3.14, 3.14)).toEqual(true);
      expect(equals(0, 0)).toEqual(true);
    });

    it('compares different numbers', () => {
      expect(equals(5, 3)).toEqual(false);
      expect(equals(-2, 2)).toEqual(false);
      expect(equals(3.14, 2.71)).toEqual(false);
      expect(equals(1, 0)).toEqual(false);
    });

    it('handles zero edge cases', () => {
      expect(equals(0, 0)).toEqual(true);
      expect(equals(-0, -0)).toEqual(true);
      expect(equals(0, -0)).toEqual(true); // JavaScript === behavior
      expect(equals(-0, 0)).toEqual(true); // JavaScript === behavior
    });

    it('supports currying with numbers', () => {
      const equals5 = equals(5);
      expect(equals5(5)).toEqual(true);
      expect(equals5(3)).toEqual(false);
      expect(equals5(-5)).toEqual(false);

      const equals0 = equals(0);
      expect(equals0(0)).toEqual(true);
      expect(equals0(-0)).toEqual(true);
      expect(equals0(1)).toEqual(false);
    });
  });

  describe('complex number comparisons', () => {
    it('compares equal complex numbers', () => {
      expect(equals(c(3, 4), c(3, 4))).toEqual(true);
      expect(equals(c(-1, 2), c(-1, 2))).toEqual(true);
      expect(equals(c(0, 0), c(0, 0))).toEqual(true);
      expect(equals(c(1, 0), c(1, 0))).toEqual(true);
      expect(equals(c(0, 1), c(0, 1))).toEqual(true);
    });

    it('compares different complex numbers', () => {
      expect(equals(c(3, 4), c(3, 5))).toEqual(false);
      expect(equals(c(3, 4), c(4, 4))).toEqual(false);
      expect(equals(c(1, 2), c(-1, 2))).toEqual(false);
      expect(equals(c(1, 2), c(1, -2))).toEqual(false);
    });

    it('compares real numbers with complex numbers', () => {
      expect(equals(5, c(5, 0))).toEqual(true);
      expect(equals(c(5, 0), 5)).toEqual(true);
      expect(equals(-3, c(-3, 0))).toEqual(true);
      expect(equals(0, c(0, 0))).toEqual(true);

      expect(equals(5, c(5, 1))).toEqual(false);
      expect(equals(c(5, 1), 5)).toEqual(false);
      expect(equals(3, c(4, 0))).toEqual(false);
    });

    it('supports currying with complex numbers', () => {
      const equalsComplex = equals(c(2, 3));
      expect(equalsComplex(c(2, 3))).toEqual(true);
      expect(equalsComplex(c(2, 4))).toEqual(false);
      expect(equalsComplex(2)).toEqual(false);

      const equalsReal = equals(c(5, 0));
      expect(equalsReal(5)).toEqual(true);
      expect(equalsReal(c(5, 0))).toEqual(true);
      expect(equalsReal(c(5, 1))).toEqual(false);
    });
  });

  describe('vector comparisons', () => {
    it('compares equal vectors', () => {
      expect(equals(v()(1, 2, 3), v()(1, 2, 3))).toEqual(true);
      expect(equals(v()(-1, 0, 5), v()(-1, 0, 5))).toEqual(true);
      expect(equals(v()(), v()())).toEqual(true); // empty vectors
    });

    it('compares different vectors', () => {
      expect(equals(v()(1, 2, 3), v()(1, 2, 4))).toEqual(false);
      expect(equals(v()(1, 2), v()(2, 1))).toEqual(false);
      expect(equals(v()(-1, 0, 5), v()(-1, 0, -5))).toEqual(false);
    });

    it('compares vectors of different lengths', () => {
      expect(equals(v()(1, 2), v()(1, 2, 3))).toEqual(false);
      expect(equals(v()(1, 2, 3), v()(1, 2))).toEqual(false);
      expect(equals(v()(), v()(1))).toEqual(false);
      expect(equals(v()(1), v()())).toEqual(false);
    });

    it('compares complex element vectors', () => {
      expect(equals(v()(c(1, 2), c(3, 4)), v()(c(1, 2), c(3, 4)))).toEqual(true);
      expect(equals(v()(c(1, 2), c(3, 4)), v()(c(1, 2), c(3, 5)))).toEqual(false);
    });

    it('compares mixed real and complex vectors', () => {
      // @ts-ignore - will deal with later
      expect(equals(v()(1, c(2, 0)), v()(1, 2))).toEqual(true);
      // @ts-ignore - will deal with later
      expect(equals(v()(1, 2), v()(1, c(2, 0)))).toEqual(true);
      // @ts-ignore - will deal with later
      expect(equals(v()(1, c(2, 1)), v()(1, 2))).toEqual(false);
    });

    it('supports currying with vectors', () => {
      const equalsVec = equals(v()(1, 2, 3));
      expect(equalsVec(v()(1, 2, 3))).toEqual(true);
      expect(equalsVec(v()(1, 2, 4))).toEqual(false);
      expect(equalsVec(v()(1, 2))).toEqual(false);
    });
  });

  describe('matrix comparisons', () => {
    it('compares equal matrices', () => {
      expect(equals(m(2, 2)([1, 2], [3, 4]), m(2, 2)([1, 2], [3, 4]))).toEqual(true);
      expect(equals(m(1, 1)([0]), m(1, 1)([0]))).toEqual(true);
      expect(equals(m(1, 3)([1, 2, 3]), m(1, 3)([1, 2, 3]))).toEqual(true); // single row
    });

    it('compares different matrices', () => {
      expect(equals(m(2, 2)([1, 2], [3, 4]), m(2, 2)([1, 2], [3, 5]))).toEqual(false);
      expect(equals(m(2, 2)([1, 2], [3, 4]), m(2, 2)([2, 2], [3, 4]))).toEqual(false);
      expect(equals(m(2, 2)([1, 0], [0, 1]), m(2, 2)([0, 1], [1, 0]))).toEqual(false);
    });

    it('compares matrices of different dimensions', () => {
      expect(equals(m(1, 2)([1, 2]), m(2, 2)([1, 2], [3, 4]))).toEqual(false);
      expect(equals(m(2, 2)([1, 2], [3, 4]), m(1, 2)([1, 2]))).toEqual(false);
      expect(equals(m(2, 2)([1, 2], [3, 4]), m(2, 1)([1], [3]))).toEqual(false);
      expect(equals(m(2, 1)([1], [3]), m(2, 2)([1, 2], [3, 4]))).toEqual(false);
    });

    it('compares complex element matrices', () => {
      expect(equals(
        m(1, 2)([c(1, 2), c(3, 4)]),
        m(1, 2)([c(1, 2), c(3, 4)])
      )).toEqual(true);

      expect(equals(
        m(1, 2)([c(1, 2), c(3, 4)]),
        m(1, 2)([c(1, 2), c(3, 5)])
      )).toEqual(false);
    });

    it('compares mixed real and complex matrices', () => {
      // @ts-ignore - will deal with later
      expect(equals(m(1, 2)([1, c(2, 0)]), m(1, 2)([1, 2]))).toEqual(true);
      // @ts-ignore - will deal with later
      expect(equals(m(1, 2)([1, 2]), m(1, 2)([1, c(2, 0)]))).toEqual(true);
      // @ts-ignore - will deal with later
      expect(equals(m(1, 2)([1, c(2, 1)]), m(1, 2)([1, 2]))).toEqual(false);
    });

    it('supports currying with matrices', () => {
      const equalsMat = equals(m(2, 2)([1, 2], [3, 4]));
      expect(equalsMat(m(2, 2)([1, 2], [3, 4]))).toEqual(true);
      expect(equalsMat(m(2, 2)([1, 2], [3, 5]))).toEqual(false);
      expect(equalsMat(m(1, 2)([1, 2]))).toEqual(false);
    });
  });

  describe('cross-type comparisons', () => {
    it('compares different kinds (always false)', () => {
      expect(equals(v()(1, 2), m(1, 2)([1, 2]))).toEqual(false);
      expect(equals(m()([1, 2]), v()(1, 2))).toEqual(false);
      expect(equals(v()(1, 2), c(1, 2))).toEqual(false);
      expect(equals(c(1, 2), v()(1, 2))).toEqual(false);
      expect(equals(m()([1, 2]), c(1, 2))).toEqual(false);
      expect(equals(c(1, 2), m()([1, 2]))).toEqual(false);
    });

    it('handles number vs non-number comparisons', () => {
      expect(equals(5, v()(5))).toEqual(false);
      expect(equals(v()(5), 5)).toEqual(false);
      expect(equals(5, m()([5]))).toEqual(false);
      expect(equals(m()([5]), 5)).toEqual(false);
    });
  });

  describe('currying behavior', () => {
    it('returns a function when called with one argument', () => {
      const equals5 = equals(5);
      expect(typeof equals5).toEqual('function');

      const equalsComplex = equals(c(1, 2));
      expect(typeof equalsComplex).toEqual('function');

      const equalsVector = equals(v()(1, 2));
      expect(typeof equalsVector).toEqual('function');

      const equalsMatrix = equals(m()([1, 2]));
      expect(typeof equalsMatrix).toEqual('function');
    });

    it('works with cross-type currying', () => {
      const equals5 = equals(5);
      expect(equals5(c(5, 0))).toEqual(true);
      expect(equals5(c(5, 1))).toEqual(false);
      expect(equals5(v()(5))).toEqual(false);

      const equalsComplex = equals(c(3, 0));
      expect(equalsComplex(3)).toEqual(true);
      expect(equalsComplex(4)).toEqual(false);
      expect(equalsComplex(c(3, 1))).toEqual(false);
    });
  });

  describe('edge cases', () => {
    it('handles empty collections', () => {
      expect(equals(v()(), v()())).toEqual(true);
      expect(equals(v()(), v()(1))).toEqual(false);
    });

    it('handles single element collections', () => {
      expect(equals(v()(42), v()(42))).toEqual(true);
      expect(equals(v()(42), v()(43))).toEqual(false);
      expect(equals(m()([42]), m()([42]))).toEqual(true);
      expect(equals(m()([42]), m()([43]))).toEqual(false);
    });

    it('handles nested complex numbers in collections', () => {
      const vec1 = v()(c(1, 2), c(3, 4), c(5, 0));
      // @ts-ignore - will deal with later
      const vec2 = v()(c(1, 2), c(3, 4), 5);
      const vec3 = v()(c(1, 2), c(3, 4), c(5, 1));

      expect(equals(vec1, vec2)).toEqual(true); // c(5, 0) === 5
      expect(equals(vec1, vec3)).toEqual(false);
      expect(equals(vec2, vec3)).toEqual(false);
    });
  });
});
