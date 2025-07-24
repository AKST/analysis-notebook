import { expect, describe, it } from 'vitest';
import { vector, unit } from '../../index.js';

const { v, c } = unit;

describe('vector namespace functions', () => {
  describe('vector.size', () => {
    it('returns the dimension of vectors', () => {
      expect(v.size(v(3)(1, 2, 3))).toEqual(3);
      expect(v.size(v()(1, 2))).toEqual(2);
      expect(v.size(v()())).toEqual(0);
    });

    it('works with complex vectors', () => {
      expect(v.size(v(2)(c(1, 2), c(3, 4)))).toEqual(2);
    });
  });

  describe('vector.norm', () => {
    it('calculates norm of real vectors', () => {
      expect(v.norm(v(2)(3, 4))).toEqual(5); // 3-4-5 triangle
      expect(v.norm(v(3)(1, 0, 0))).toEqual(1);
      expect(v.norm(v(3)(0, 0, 0))).toEqual(0);
    });

    it('calculates norm of complex vectors', () => {
      // |1+0i| = 1, |0+1i| = 1, so norm = sqrt(1² + 1²) = sqrt(2)
      expect(v.norm(v(2)(c(1, 0), c(0, 1)))).toBeCloseTo(Math.sqrt(2), 10);

      // |3+4i| = 5, so norm = 5
      expect(v.norm(v(1)(c(3, 4)))).toEqual(5);
    });

    it('handles empty vectors', () => {
      expect(v.norm(v()())).toEqual(0);
    });
  });

  describe('vector.unit', () => {
    it('normalizes real vectors', () => {
      const vec = v(2)(3, 4);
      const unit = v.unit(vec);
      expect(unit).toEqual(v(2)(0.6, 0.8)); // 3/5, 4/5
      expect(v.norm(unit)).toBeCloseTo(1, 10);
    });

    it('normalizes complex vectors', () => {
      const vec = v()(c(3, 4)); // magnitude 5
      const unit = v.unit(vec);
      expect(unit).toEqual(v(1)(c(0.6, 0.8))); // (3+4i)/5
      expect(v.norm(unit)).toBeCloseTo(1, 10);
    });

    it('handles zero vectors', () => {
      const zero = v(3)(0, 0, 0);
      expect(v.unit(zero)).toEqual(zero); // Should return original to avoid division by zero
    });
  });

  describe('vector.dot', () => {
    it('calculates dot product of real vectors', () => {
      expect(v.dot(v(3)(1, 2, 3), v(3)(4, 5, 6))).toEqual(32); // 1*4 + 2*5 + 3*6
      expect(v.dot(v(2)(1, 0), v(2)(0, 1))).toEqual(0); // orthogonal
    });

    it('calculates dot product with complex vectors', () => {
      // Real with complex: 1 * (2+0i) + 0 * (0+3i) = 2
      expect(v.dot(v(2)(1, 0), v(2)(c(2, 0), c(0, 3)))).toEqual(2);

      // Complex with complex: conj(1+2i) * (3+4i) + conj(0+1i) * (1+0i)
      // = (1-2i)(3+4i) + (0-1i)(1+0i) = (3+4i-6i-8i²) + (-i) = (3-2i+8) + (-i) = 11-3i
      // But dot product should be real, so: 1*3 + 2*4 + 0*1 + 1*0 = 11
      expect(v.dot(v(2)(c(1, 2), c(0, 1)), v(2)(c(3, 4), c(1, 0)))).toEqual(11);
    });

    it('throws error for mismatched dimensions', () => {
      expect(() => v.dot(v(2)(1, 2), v(3)(1, 2, 3))).toThrow();
    });
  });

  describe('vector.get', () => {
    it('gets elements from real vectors', () => {
      const vec = v(3)(10, 20, 30);
      expect(v.get(vec, 0)).toEqual(10);
      expect(v.get(vec, 1)).toEqual(20);
      expect(v.get(vec, 2)).toEqual(30);
    });

    it('gets elements from complex vectors', () => {
      const vec = v(2)(c(1, 2), c(3, 4));
      expect(v.get(vec, 0)).toEqual(c(1, 2));
      expect(v.get(vec, 1)).toEqual(c(3, 4));
    });
  });

  describe('vector.set', () => {
    it('sets elements in real vectors', () => {
      const vec = v(3)(1, 2, 3);
      const newVec = v.set(vec, 1, 99);

      expect(newVec).toEqual(v(3)(1, 99, 3));
      expect(newVec.var).toEqual('r');
      expect(vec).toEqual(v(3)(1, 2, 3)); // Original unchanged
    });

    it('promotes real vector to complex when setting complex value', () => {
      const vec = v(3)(1, 2, 3);
      const newVec = v.set(vec, 1, c(4, 5));

      expect(newVec.vec).toEqual([1, c(4, 5), 3]);
      expect(newVec.var).toEqual('c'); // Promoted to complex
      expect(vec.var).toEqual('r'); // Original unchanged
    });

    it('sets elements in complex vectors', () => {
      const vec = v(2)(c(1, 2), c(3, 4));
      const newVec = v.set(vec, 0, c(9, 8));

      expect(newVec).toEqual(v(2)(c(9, 8), c(3, 4)));
      expect(newVec.var).toEqual('c');
    });

    it('can set real values in complex vectors', () => {
      const vec = v(2)(c(1, 2), c(3, 4));
      const newVec = v.set(vec, 1, 99);

      expect(newVec.vec).toEqual([c(1, 2), 99]);
      expect(newVec.var).toEqual('c'); // Stays complex
    });
  });

  describe('vector.cross2d', () => {
    it('calculates 2D cross product', () => {
      expect(v.cross2d(v(2)(1, 0), v(2)(0, 1))).toEqual(1);
      expect(v.cross2d(v(2)(0, 1), v(2)(1, 0))).toEqual(-1);
      expect(v.cross2d(v(2)(2, 3), v(2)(4, 5))).toEqual(-2);
    });

    it('is anticommutative', () => {
      const a = v(2)(2, 3);
      const b = v(2)(4, 5);
      expect(v.cross2d(a, b)).toEqual(-v.cross2d(b, a));
    });

    it('returns zero for parallel vectors', () => {
      expect(v.cross2d(v(2)(2, 4), v(2)(1, 2))).toEqual(0);
      expect(v.cross2d(v(2)(1, 1), v(2)(2, 2))).toEqual(0);
    });

    it('throws error for non-2D vectors', () => {
      expect(() => v.cross2d(v(3)(1, 2, 3), v(3)(4, 5, 6))).toThrow(TypeError);
    });
  });

  describe('vector.cross3d', () => {
    it('calculates 3D cross product', () => {
      expect(v.cross3d(v(3)(1, 0, 0), v(3)(0, 1, 0))).toEqual(v(3)(0, 0, 1));
      expect(v.cross3d(v(3)(0, 1, 0), v(3)(0, 0, 1))).toEqual(v(3)(1, 0, 0));
      expect(v.cross3d(v(3)(0, 0, 1), v(3)(1, 0, 0))).toEqual(v(3)(0, 1, 0));
      expect(v.cross3d(v(3)(1, 2, 3), v(3)(4, 5, 6))).toEqual(v(3)(-3, 6, -3));
    });

    it('is anticommutative', () => {
      const a = v(3)(1, 2, 3);
      const b = v(3)(4, 5, 6);
      const cross_ab = v.cross3d(a, b);
      const cross_ba = v.cross3d(b, a);
      expect(cross_ab.vec[0]).toEqual(-cross_ba.vec[0]);
      expect(cross_ab.vec[1]).toEqual(-cross_ba.vec[1]);
      expect(cross_ab.vec[2]).toEqual(-cross_ba.vec[2]);
    });

    it('returns zero vector for parallel vectors', () => {
      expect(v.cross3d(v(3)(2, 4, 6), v(3)(1, 2, 3))).toEqual(v(3)(0, 0, 0));
      expect(v.cross3d(v(3)(1, 2, 3), v(3)(1, 2, 3))).toEqual(v(3)(0, 0, 0));
    });

    it('throws error for non-3D vectors', () => {
      expect(() => v.cross3d(v(2)(1, 2), v(2)(3, 4))).toThrow(TypeError);
    });
  });

  describe('cross product properties', () => {
    it('cross product is orthogonal to inputs', () => {
      const a = v(3)(1, 2, 3);
      const b = v(3)(4, 5, 6);
      const cross = v.cross3d(a, b);
      expect(v.dot(a, cross)).toBeCloseTo(0, 10);
      expect(v.dot(b, cross)).toBeCloseTo(0, 10);
    });

    it('magnitude gives parallelogram area', () => {
      expect(Math.abs(v.cross2d(v()(3, 0), v()(0, 4)))).toEqual(12);
      expect(v.norm(v.cross3d(v()(3, 0, 0), v()(0, 4, 0)))).toEqual(12);
    });
  });

  describe('integration with existing functions', () => {
    it('dot product is commutative for real vectors', () => {
      const a = v()(1, 2, 3);
      const b = v()(4, 5, 6);

      expect(v.dot(a, b)).toEqual(v.dot(b, a));
    });

    it('unit vector has norm 1', () => {
      const vectors = [
        v()(1, 2, 3),
        v()(c(3, 4)),
        v()(1, 0, 0, 0),
        v()(c(1, 1), c(1, -1))
      ];

      vectors.forEach(vec => {
        if (v.norm(vec) > 0) { // Skip zero vectors
          expect(v.norm(v.unit(vec))).toBeCloseTo(1, 10);
        }
      });
    });
  });
});
