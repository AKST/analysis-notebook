import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { el, neg, unit, pow as _pow } from '../../index.js';

const { add, sub, mul, div, pow, mod, inv } = el;
const { c, m, v } = unit;

describe('add function', () => {
  describe('number addition', () => {
    it('adds two numbers', () => {
      expect(add(3, 4)).toEqual(7);
      expect(add(-2, 5)).toEqual(3);
      expect(add(0, 0)).toEqual(0);
    });

    it('supports partial application with numbers', () => {
      const add5 = add(5);
      expect(add5(3)).toEqual(8);
      expect(add5(-2)).toEqual(3);
    });
  });

  describe('complex addition', () => {
    it('adds two complex numbers', () => {
      expect(add(c(1, 2), c(3, 4))).toEqual(c(4, 6));
    });

    it('adds complex and real numbers', () => {
      const a = c(1, 2);
      expect(add(a, 3)).toEqual(c(4, 5));
      expect(add(5, a)).toEqual(c(6, 7));
    });

    it('supports partial application with complex numbers', () => {
      const addC = add(c(1, 2));
      expect(addC(c(3, 4))).toEqual(c(4, 6));
      expect(addC(5)).toEqual(c(6, 7));
    });
  });

  describe('vector addition', () => {
    it('adds two vectors of same dimension', () => {
      const v1 = v()(1, 2, 3);
      const v2 = v()(4, 5, 6);
      expect(add(v1, v2)).toEqual(v()(5, 7, 9));
      expect(add(v1, v2).var).toEqual('r');
    });

    it('adds vectors with complex elements', () => {
      const v1 = v()(c(1, 2), c(3, 4));
      const v2 = v()(c(5, 6), c(7, 8));
      expect(add(v1, v2)).toEqual(v()(c(6, 8), c(10, 12)));
      expect(add(v1, v2).var).toEqual('c');
    });

    it('throws error for mismatched dimensions', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const v1 = v()(1, 2);
      const v2 = v()(1, 2, 3);
      expect(() => add(v1, v2)).toThrow();
      consoleErrorSpy.mockRestore();
    });

    it('supports partial application with vectors', () => {
      const addV1 = add(v()(1, 2));
      expect(addV1(v()(3, 4))).toEqual(v()(4, 6));
    });
  });

  describe('matrix addition', () => {
    it('adds two matrices of same dimensions', () => {
      const m1 = m()([1, 2], [3, 4]);
      const m2 = m()([5, 6], [7, 8]);
      const result = add(m1, m2);

      expect(result).toEqual(m()([6, 8], [10, 12]));
      expect(result.var).toEqual('r');
    });

    it('adds matrices with complex elements', () => {
      const m1 = m(1, 2)([c(1, 1), c(2, 2)]);
      const m2 = m()([c(3, 3), c(4, 4)]);
      const result = add(m1, m2);
      expect(result).toEqual(m()([c(4, 4), c(6, 6)]));
      expect(result.var).toEqual('c');
    });

    it('throws error for mismatched dimensions', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const m1 = m(1, 2)([1, 2]);
      const m2 = m(2, 2)([1, 2], [3, 4]);

      expect(() => add(m1, m2)).toThrow();
      consoleErrorSpy.mockRestore();
    });

    it('supports partial application with matrices', () => {
      const m1 = m(1, 2)([1, 2]);
      const addM1 = add(m1);
      const result = addM1(m(1, 2)([3, 4]));

      expect(result.mat).toEqual([[4, 6]]);
    });
  });

  describe('scalar + vector broadcasting', () => {
    it('adds number to vector', () => {
      const vec = v()(1, 2, 3);
      const result1 = add(5, vec);
      const result2 = add(vec, 5);

      expect(result1).toEqual(v()(6, 7, 8));
      expect(result2).toEqual(v()(6, 7, 8));
      expect(result1.var).toEqual('r');
      expect(result2.var).toEqual('r');
    });

    it('adds complex to vector (promotes to complex)', () => {
      const vec = v()(1, 2);
      const comp = c(3, 4);
      const result1 = add(comp, vec);
      const result2 = add(vec, comp);

      expect(result1).toEqual(v()(c(4, 4), c(5, 4)));
      expect(result2).toEqual(v()(c(4, 4), c(5, 4)));
      expect(result1.var).toEqual('c');
      expect(result2.var).toEqual('c');
    });

    it('supports partial application with scalar broadcasting', () => {
      const add5 = add(5);
      const addComplex = add(c(1, 2));

      expect(add5(v()(1, 2, 3))).toEqual(v()(6, 7, 8));
      expect(addComplex(v()(3, 4))).toEqual(v()(c(4, 2), c(5, 2)));
    });
  });

  describe('scalar + matrix broadcasting', () => {
    it('adds number to matrix', () => {
      const mat = m(2, 2)([1, 2], [3, 4]);
      const result1 = add(10, mat);
      const result2 = add(mat, 10);

      expect(result1).toEqual(m(2, 2)([11, 12], [13, 14]));
      expect(result2).toEqual(m(2, 2)([11, 12], [13, 14]));
      expect(result1.var).toEqual('r');
      expect(result2.var).toEqual('r');
    });

    it('adds complex to matrix (promotes to complex)', () => {
      const mat = m(1, 2)([1, 2]);
      const comp = c(5, 6);
      const result1 = add(comp, mat);
      const result2 = add(mat, comp);

      expect(result1).toEqual(m(1, 2)([c(6, 6), c(7, 6)]));
      expect(result2).toEqual(m(1, 2)([c(6, 6), c(7, 6)]));
      expect(result1.var).toEqual('c');
      expect(result2.var).toEqual('c');
    });

    it('supports partial application with scalar broadcasting', () => {
      const add100 = add(100);
      const addComplex = add(c(2, 3));

      expect(add100(m()([1, 2]))).toEqual(m(1, 2)([101, 102]));
      expect(addComplex(m()([4, 5]))).toEqual(m()([c(6, 3), c(7, 3)]));
    });
  });

  describe('matrix factory methods', () => {
    it('creates row matrix from vector', () => {
      const vec = v()(1, 2, 3);
      const rowMat = m.row(vec);

      expect(rowMat).toEqual(m()([1, 2, 3]));
      expect(rowMat.n).toEqual(1);  // 1 row
      expect(rowMat.m).toEqual(3);  // 3 columns
      expect(rowMat.var).toEqual('r');
    });

    it('creates column matrix from vector', () => {
      const vec = v()(1, 2, 3);
      const colMat = m.col(vec);
      expect(colMat).toEqual(m()([1], [2], [3]));
    });

    it('handles complex vectors', () => {
      const vec = v()(c(1, 2), c(3, 4));
      const rowMat = m.row(vec);
      const colMat = m.col(vec);

      expect(rowMat).toEqual(m()([...vec.vec as any]));
      expect(colMat).toEqual(m()([c(1, 2)], [c(3, 4)]));
    });

    it('enables explicit vector-matrix operations', () => {
      const vec2 = v(2)(10, 20);
      const mat1x2 = m(1, 2)([1, 2]);
      const mat2x1 = m(2, 1)([1], [3]);

      expect(add(m.row(vec2), mat1x2)).toEqual(m()([11, 22]));
      expect(add(m.col(vec2), mat2x1)).toEqual(m()([11], [23]));
    });

    it('tests other matrix factories', () => {
      expect(m.zeros(2, 3)).toEqual(m()([0, 0, 0], [0, 0, 0]));
      expect(m.ones(2, 2)).toEqual(m()([1, 1], [1, 1]));
      expect(m.identity(3)).toEqual(m()([1, 0, 0], [0, 1, 0], [0, 0, 1]));
      expect(m.diag(3, [1, 2, 3])).toEqual(m()([1, 0, 0], [0, 2, 0], [0, 0, 3]));
    });

    it('tests vector factories', () => {
      expect(v.zeros(3)).toEqual(v()(0, 0, 0));
      expect(v.ones(2)).toEqual(v()(1, 1));
      expect(v.basis(3, 0)).toEqual(v()(1, 0, 0));
      expect(v.basis(3, 1)).toEqual(v()(0, 1, 0));
      expect(v.basis(3, 2)).toEqual(v()(0, 0, 1));
    });

    it('tests complex factory', () => {
      const comp = c.createMagAngle(1, Math.PI / 2);
      expect(comp.real).toBeCloseTo(0, 10);
      expect(comp.imag).toBeCloseTo(1, 10);
    });
  });

  describe('error cases', () => {
    it('throws error for incompatible types', () => {
      const a = v()(1, 2);
      const b = v()(1, 2, 3);
      expect(() => add(a, b)).toThrow();
      expect(() => add(b, a)).toThrow();
    });
  });
});

describe('sub function', () => {
  describe('number subtraction', () => {
    it('subtracts two numbers', () => {
      expect(sub(7, 3)).toEqual(4);
      expect(sub(5, -2)).toEqual(7);
      expect(sub(0, 5)).toEqual(-5);
    });

    it('supports partial application with numbers', () => {
      const sub5 = sub(5);
      expect(sub5(3)).toEqual(2);
      expect(sub5(-2)).toEqual(7);
    });
  });

  describe('complex subtraction', () => {
    it('subtracts two complex numbers', () => {
      expect(sub(c(5, 6), c(2, 3))).toEqual(c(3, 3));
      expect(sub(c(1, 2), c(4, 1))).toEqual(c(-3, 1));
    });

    it('subtracts complex and real numbers', () => {
      const a = c(5, 3);
      expect(sub(a, 1)).toEqual(c(4, 2));
      expect(sub(8, a)).toEqual(c(3, 5));
    });

    it('supports partial application with complex numbers', () => {
      const subC = sub(c(5, 3));
      expect(subC(c(2, 1))).toEqual(c(3, 2));
      expect(subC(3)).toEqual(c(2, 0));
    });
  });

  describe('vector subtraction', () => {
    it('subtracts two vectors of same dimension', () => {
      const v1 = v(3)(5, 7, 9);
      const v2 = v(3)(2, 3, 4);
      expect(sub(v1, v2)).toEqual(v(3)(3, 4, 5));
    });

    it('subtracts vectors with complex elements', () => {
      const v1 = v(2)(c(5, 6), c(7, 8));
      const v2 = v(2)(c(1, 2), c(3, 4));
      expect(sub(v1, v2)).toEqual(v(2)(c(4, 4), c(4, 4)));
    });

    it('throws error for mismatched dimensions', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const v1 = v(2)(1, 2);
      const v2 = v(3)(1, 2, 3);
      expect(() => sub(v1, v2)).toThrow();
      consoleErrorSpy.mockRestore();
    });

    it('supports partial application with vectors', () => {
      const subV1 = sub(v(2)(5, 6));
      expect(subV1(v(2)(2, 3))).toEqual(v(2)(3, 3));
    });
  });

  describe('matrix subtraction', () => {
    it('subtracts two matrices of same dimensions', () => {
      const m1 = m()([7, 8], [9, 10]);
      const m2 = m()([2, 3], [4, 5]);
      const result = sub(m1, m2);

      expect(result).toEqual(m()([5, 5], [5, 5]));
    });

    it('subtracts matrices with complex elements', () => {
      const m1 = m()([c(5, 5), c(7, 7)]);
      const m2 = m()([c(2, 2), c(3, 3)]);
      const result = sub(m1, m2);
      expect(result).toEqual(m()([c(3, 3), c(4, 4)]));
    });

    it('throws error for mismatched dimensions', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const m1 = m()([1, 2]);
      const m2 = m()([1, 2], [3, 4]);

      expect(() => sub(m1, m2)).toThrow();
      consoleErrorSpy.mockRestore();
    });

    it('supports partial application with matrices', () => {
      const m1 = m()([5, 6]);
      const subM1 = sub(m1);
      const result = subM1(m()([2, 3]));

      expect(result.mat).toEqual([[3, 3]]);
    });
  });

  describe('scalar - vector broadcasting', () => {
    it('subtracts vector from number', () => {
      const vec = v(3)(1, 2, 3);
      const result1 = sub(10, vec);
      const result2 = sub(vec, 5);

      expect(result1).toEqual(v(3)(9, 8, 7));
      expect(result2).toEqual(v(3)(-4, -3, -2));
    });

    it('subtracts vector from complex (promotes to complex)', () => {
      const vec = v(2)(1, 2);
      const comp = c(5, 3);
      const result1 = sub(comp, vec);
      const result2 = sub(vec, comp);

      expect(result1).toEqual(v(2)(c(4, 3), c(3, 3)));
      expect(result2).toEqual(v(2)(c(-4, -3), c(-3, -3)));
    });

    it('supports partial application with scalar broadcasting', () => {
      const sub10 = sub(10);
      const subComplex = sub(c(5, 2));

      expect(sub10(v(3)(1, 2, 3))).toEqual(v(3)(9, 8, 7));
      expect(subComplex(v(2)(2, 3))).toEqual(v(2)(c(3, 2), c(2, 2)));
    });
  });

  describe('scalar - matrix broadcasting', () => {
    it('subtracts matrix from number', () => {
      const mat = m()([1, 2], [3, 4]);
      const result1 = sub(15, mat);
      const result2 = sub(mat, 5);

      expect(result1).toEqual(m()([14, 13], [12, 11]));
      expect(result2).toEqual(m()([-4, -3], [-2, -1]));
    });

    it('subtracts matrix from complex (promotes to complex)', () => {
      const mat = m()([1, 2]);
      const comp = c(7, 4);
      const result1 = sub(comp, mat);
      const result2 = sub(mat, comp);

      expect(result1).toEqual(m()([c(6, 4), c(5, 4)]));
      expect(result2).toEqual(m()([c(-6, -4), c(-5, -4)]));
    });

    it('supports partial application with scalar broadcasting', () => {
      const sub100 = sub(100);
      const subComplex = sub(c(8, 3));

      expect(sub100(m()([10, 20]))).toEqual(m()([90, 80]));
      expect(subComplex(m()([4, 5]))).toEqual(m()([c(4, 3), c(3, 3)]));
    });
  });

  describe('error cases', () => {
    it('throws error for incompatible types', () => {
      const a = v(2)(1, 2);
      const b = v(3)(1, 2, 3);

      expect(() => sub(a, b)).toThrow();
      expect(() => sub(b, a)).toThrow();
    });
  });
});

describe('mul function (elementwise multiplication)', () => {
  describe('scalar operations', () => {
    it('multiplies two numbers', () => {
      expect(mul(3, 4)).toEqual(12);
      expect(mul(-2, 5)).toEqual(-10);
    });

    it('multiplies complex numbers (elementwise - component by component)', () => {
      expect(mul(c(2, 3), c(4, 5))).toEqual(c(8, 15)); // 2*4, 3*5
    });

    it('multiplies real with complex (broadcasts)', () => {
      expect(mul(3, c(2, 4))).toEqual(c(6, 12));
      expect(mul(c(2, 4), 3)).toEqual(c(6, 12));
    });
  });

  describe('vector operations', () => {
    it('multiplies scalar with vector (broadcasts)', () => {
      const vec = v(3)(2, 3, 4);
      expect(mul(3, vec)).toEqual(v(3)(6, 9, 12));
      expect(mul(vec, 3)).toEqual(v(3)(6, 9, 12));
    });

    it('multiplies two vectors elementwise', () => {
      const a = v(3)(2, 3, 4);
      const b = v(3)(5, 6, 7);
      expect(mul(a, b)).toEqual(v(3)(10, 18, 28));
    });
  });
});

describe('div function (elementwise division)', () => {
  describe('scalar operations', () => {
    it('divides two numbers', () => {
      expect(div(12, 4)).toEqual(3);
      expect(div(15, 3)).toEqual(5);
    });

    it('divides complex numbers (elementwise - component by component)', () => {
      expect(div(c(8, 15), c(4, 5))).toEqual(c(2, 3)); // 8/4, 15/5
    });

    it('divides real with complex (broadcasts)', () => {
      expect(div(c(6, 12), 3)).toEqual(c(2, 4));
      expect(div(12, c(4, 3))).toEqual(c(3, 4));
    });
  });

  describe('vector operations', () => {
    it('divides vector by scalar', () => {
      const vec = v(3)(6, 9, 12);
      expect(div(vec, 3)).toEqual(v(3)(2, 3, 4));
    });

    it('divides scalar by vector elements', () => {
      const vec = v(3)(2, 4, 8);
      expect(div(16, vec)).toEqual(v(3)(8, 4, 2));
    });

    it('divides two vectors elementwise', () => {
      const a = v(3)(12, 15, 20);
      const b = v(3)(3, 5, 4);
      expect(div(a, b)).toEqual(v(3)(4, 3, 5));
    });
  });
});

describe('pow function (elementwise power)', () => {
  describe('real number power', () => {
    it('raises numbers to powers', () => {
      expect(pow(2, 3)).toEqual(8);
      expect(pow(4, 2)).toEqual(16);
      expect(pow(5, 0)).toEqual(1);
      expect(pow(2, -1)).toEqual(0.5);
    });

    it('handles fractional exponents', () => {
      expect(pow(4, 0.5)).toEqual(2);
      expect(pow(8, 1/3)).toBeCloseTo(2, 10);
      expect(pow(9, 0.5)).toEqual(3);
    });

    it('handles negative bases', () => {
      expect(pow(-2, 2)).toEqual(4);
      expect(pow(-3, 3)).toEqual(-27);
      expect(pow(-1, 2)).toEqual(1);
    });

    it('handles edge cases', () => {
      expect(pow(0, 2)).toEqual(0);
      expect(pow(1, 100)).toEqual(1);
      expect(pow(10, 0)).toEqual(1);
    });
  });

  describe('complex number power (elementwise)', () => {
    it('raises complex numbers to powers elementwise', () => {
      expect(pow(c(2, 3), 2)).toEqual(c(4, 9)); // 2^2, 3^2
      expect(pow(c(1, 4), 3)).toEqual(c(1, 64)); // 1^3, 4^3
      expect(pow(c(3, 2), 0)).toEqual(c(1, 1)); // 3^0, 2^0
    });

    it('handles fractional exponents on complex numbers', () => {
      expect(pow(c(4, 9), 0.5)).toEqual(c(2, 3)); // 4^0.5, 9^0.5
      expect(pow(c(8, 27), 1/3)).toEqual(c(2, 3)); // 8^(1/3), 27^(1/3)
    });

    it('handles negative components', () => {
      expect(pow(c(-2, 3), 2)).toEqual(c(4, 9)); // (-2)^2, 3^2
      expect(pow(c(2, -3), 2)).toEqual(c(4, 9)); // 2^2, (-3)^2
    });

    it('handles zero components', () => {
      expect(pow(c(0, 2), 3)).toEqual(c(0, 8)); // 0^3, 2^3
      expect(pow(c(3, 0), 2)).toEqual(c(9, 0)); // 3^2, 0^2
    });
  });

  describe('vector power operations', () => {
    it('raises vector elements to scalar power', () => {
      const vec = v(3)(2, 3, 4);
      expect(pow(vec, 2)).toEqual(v(3)(4, 9, 16));
      expect(pow(vec, 3)).toEqual(v(3)(8, 27, 64));
    });

    it('handles fractional exponents on vectors', () => {
      const vec = v(3)(4, 9, 16);
      const result = pow(vec, 0.5);
      expect(result).toEqual(v(3)(2, 3, 4));
    });

    it('handles complex vector elements', () => {
      const vec = v(2)(c(2, 3), c(1, 4));
      // Uses _pow for complex elements, so (2+3i)^2 = -5+12i, (1+4i)^2 = -15+8i
      const expected = v(2)(_pow(c(2, 3), 2), _pow(c(1, 4), 2));
      expect(pow(vec, 2)).toEqual(expected);
    });

    it('handles negative exponents on vectors', () => {
      const vec = v(3)(2, 4, 8);
      expect(pow(vec, -1)).toEqual(v(3)(0.5, 0.25, 0.125));
    });

    it('handles zero exponents on vectors', () => {
      const vec = v(3)(2, 3, 4);
      expect(pow(vec, 0)).toEqual(v(3)(1, 1, 1));
    });
  });

  describe('matrix power operations', () => {
    it('raises matrix elements to scalar power', () => {
      const mat = m()([2, 3], [4, 5]);
      expect(pow(mat, 2)).toEqual(m()([4, 9], [16, 25]));
    });

    it('handles fractional exponents on matrices', () => {
      const mat = m()([4, 9], [16, 25]);
      const result = pow(mat, 0.5);
      expect(result).toEqual(m()([2, 3], [4, 5]));
    });

    it('handles complex matrix elements', () => {
      const mat = m()([c(2, 3), c(1, 4)]);
      // Uses _pow for complex elements, so (2+3i)^2 = -5+12i, (1+4i)^2 = -15+8i
      const expected = m()([_pow(c(2, 3), 2), _pow(c(1, 4), 2)]);
      expect(pow(mat, 2)).toEqual(expected);
    });

    it('handles single-element matrices', () => {
      const mat = m()([3]);
      expect(pow(mat, 4)).toEqual(m()([81]));
    });

    it('handles zero exponents on matrices', () => {
      const mat = m()([2, 3], [4, 5]);
      expect(pow(mat, 0)).toEqual(m()([1, 1], [1, 1]));
    });
  });

  describe('edge cases and special values', () => {
    it('handles 0^0 case', () => {
      expect(pow(0, 0)).toEqual(1); // JavaScript behavior
      expect(pow(c(0, 0), 0)).toEqual(c(1, 1));
    });

    it('handles infinity cases', () => {
      expect(pow(2, Infinity)).toEqual(Infinity);
      expect(pow(0.5, Infinity)).toEqual(0);
    });

    it('handles NaN propagation', () => {
      expect(pow(NaN, 2)).toBeNaN();
      expect(pow(2, NaN)).toBeNaN();
    });

    it('preserves variable types in vectors', () => {
      const realVec = v(3)(2, 3, 4);
      const complexVec = v(2)(c(2, 3), c(1, 4));

      expect(pow(realVec, 2).var).toEqual('r');
      expect(pow(complexVec, 2).var).toEqual('c');
    });

    it('preserves variable types in matrices', () => {
      const realMat = m()([2, 3]);
      const complexMat = m()([c(2, 3)]);

      expect(pow(realMat, 2).var).toEqual('r');
      expect(pow(complexMat, 2).var).toEqual('c');
    });
  });

  describe('mathematical properties', () => {
    it('verifies pow(a, 1) = a', () => {
      expect(pow(5, 1)).toEqual(5);
      expect(pow(c(2, 3), 1)).toEqual(c(2, 3));
      expect(pow(v(2)(2, 3), 1)).toEqual(v(2)(2, 3));
    });

    it('verifies pow(a, 0) = 1', () => {
      expect(pow(5, 0)).toEqual(1);
      expect(pow(c(2, 3), 0)).toEqual(c(1, 1));
      expect(pow(v(2)(2, 3), 0)).toEqual(v(2)(1, 1));
    });

    it('verifies sqrt properties', () => {
      expect(pow(4, 0.5)).toEqual(2);
      expect(pow(c(4, 9), 0.5)).toEqual(c(2, 3));
    });
  });

  describe('error cases', () => {
    it('throws error for invalid base types', () => {
      // @ts-ignore - will deal with later
      expect(() => pow({}, 2)).toThrow();
      // @ts-ignore - will deal with later
      expect(() => pow(null, 2)).toThrow();
      // @ts-ignore - will deal with later
      expect(() => pow(undefined, 2)).toThrow();
    });

    it('handles negative bases with fractional exponents', () => {
      // JavaScript behavior: (-2)^0.5 = NaN
      expect(pow(-2, 0.5)).toBeNaN();
      expect(pow(c(-2, 3), 0.5)).toEqual(c(NaN, Math.sqrt(3)));
    });
  });
});

describe('mod function (elementwise modulo)', () => {
  describe('scalar operations', () => {
    it('calculates modulo of two numbers', () => {
      expect(mod(10, 3)).toEqual(1);
      expect(mod(15, 4)).toEqual(3);
      expect(mod(7, 2)).toEqual(1);
      expect(mod(8, 4)).toEqual(0);
    });

    it('handles negative numbers', () => {
      expect(mod(-7, 3)).toEqual(-1); // JavaScript behavior
      expect(mod(7, -3)).toEqual(1);
      expect(mod(-7, -3)).toEqual(-1);
    });

    it('calculates modulo of complex numbers (elementwise)', () => {
      expect(mod(c(10, 15), c(3, 4))).toEqual(c(1, 3)); // 10%3, 15%4
      expect(mod(c(7, 9), c(2, 5))).toEqual(c(1, 4)); // 7%2, 9%5
    });

    it('calculates modulo of real with complex (broadcasts)', () => {
      expect(mod(c(10, 12), 3)).toEqual(c(1, 0)); // 10%3, 12%3
      expect(mod(15, c(4, 7))).toEqual(c(3, 1)); // 15%4, 15%7
    });

    it('supports partial application', () => {
      const mod3 = mod(3);
      expect(mod3(10)).toEqual(1);
      expect(mod3(7)).toEqual(1);

      const modC = mod(c(3, 4));
      expect(modC(c(10, 15))).toEqual(c(1, 3));
    });
  });

  describe('vector operations', () => {
    it('calculates modulo of vector by scalar', () => {
      const vec = v(3)(10, 15, 7);
      expect(mod(vec, 3)).toEqual(v(3)(1, 0, 1));
    });

    it('calculates modulo of scalar by vector elements', () => {
      const vec = v(3)(3, 4, 5);
      expect(mod(17, vec)).toEqual(v(3)(2, 1, 2)); // 17%3, 17%4, 17%5
    });

    it('calculates modulo of two vectors elementwise', () => {
      const a = v(3)(10, 15, 8);
      const b = v(3)(3, 4, 3);
      expect(mod(a, b)).toEqual(v(3)(1, 3, 2)); // 10%3, 15%4, 8%3
    });

    it('handles complex vector elements', () => {
      const a = v(2)(c(10, 15), c(7, 9));
      const b = v(2)(c(3, 4), c(2, 5));
      expect(mod(a, b)).toEqual(v(2)(c(1, 3), c(1, 4)));
    });

    it('throws error for mismatched dimensions', () => {
      const v1 = v(2)(10, 15);
      const v2 = v(3)(3, 4, 5);
      expect(() => mod(v1, v2)).toThrow();
    });
  });

  describe('matrix operations', () => {
    it('calculates modulo of matrix by scalar', () => {
      const mat = m()([10, 15], [7, 8]);
      expect(mod(mat, 3)).toEqual(m()([1, 0], [1, 2]));
    });

    it('calculates modulo of scalar by matrix elements', () => {
      const mat = m()([3, 4], [5, 6]);
      expect(mod(17, mat)).toEqual(m()([2, 1], [2, 5])); // 17%3, 17%4, 17%5, 17%6
    });

    it('calculates modulo of two matrices elementwise', () => {
      const a = m()([10, 15], [8, 9]);
      const b = m()([3, 4], [3, 2]);
      expect(mod(a, b)).toEqual(m()([1, 3], [2, 1])); // 10%3, 15%4, 8%3, 9%2
    });
  });

  describe('edge cases', () => {
    it('handles zero modulo', () => {
      expect(mod(0, 5)).toEqual(0);
      expect(mod(c(0, 0), 3)).toEqual(c(0, 0));
    });

    it('handles modulo by 1', () => {
      expect(mod(5, 1)).toEqual(0);
      expect(mod(c(7, 3), 1)).toEqual(c(0, 0));
    });

    it('preserves variable types', () => {
      const realVec = v(2)(10, 15);
      const complexVec = v(2)(c(10, 15), c(7, 9));

      expect(mod(realVec, 3).var).toEqual('r');
      expect(mod(complexVec, 3).var).toEqual('c');
    });
  });
});

describe('inv function (elementwise inverse)', () => {
  describe('scalar operations', () => {
    it('calculates inverse of numbers', () => {
      expect(inv(2)).toEqual(0.5);
      expect(inv(4)).toEqual(0.25);
      expect(inv(0.5)).toEqual(2);
      expect(inv(-2)).toEqual(-0.5);
    });

    it('calculates inverse of complex numbers (elementwise)', () => {
      expect(inv(c(2, 4))).toEqual(c(0.5, 0.25)); // 1/2, 1/4
      expect(inv(c(0.5, 0.25))).toEqual(c(2, 4)); // 1/0.5, 1/0.25
    });

    it('handles negative components', () => {
      expect(inv(c(-2, 4))).toEqual(c(-0.5, 0.25)); // 1/(-2), 1/4
      expect(inv(c(2, -4))).toEqual(c(0.5, -0.25)); // 1/2, 1/(-4)
    });

    it('handles zero (results in Infinity)', () => {
      expect(inv(0)).toEqual(Infinity);
      expect(inv(c(0, 2))).toEqual(c(Infinity, 0.5));
    });
  });

  describe('vector operations', () => {
    it('calculates inverse of vector elements', () => {
      const vec = v(3)(2, 4, 0.5);
      expect(inv(vec)).toEqual(v(3)(0.5, 0.25, 2));
    });

    it('handles complex vector elements', () => {
      const vec = v(2)(c(2, 4), c(0.5, 0.25));
      // Mathematical complex inverse: 1/(a+bi) = (a-bi)/(a²+b²)
      // c(2, 4): (2-4i)/(4+16) = (2-4i)/20 = 0.1-0.2i
      // c(0.5, 0.25): (0.5-0.25i)/(0.25+0.0625) = (0.5-0.25i)/0.3125 = 1.6-0.8i
      expect(inv(vec)).toEqual(v(2)(c(0.1, -0.2), c(1.6, -0.8)));
    });

    it('handles negative elements', () => {
      const vec = v(3)(-2, 4, -0.5);
      expect(inv(vec)).toEqual(v(3)(-0.5, 0.25, -2));
    });

    it('handles zero elements (results in Infinity)', () => {
      const vec = v(3)(2, 0, 4);
      expect(inv(vec)).toEqual(v(3)(0.5, Infinity, 0.25));
    });

    it('preserves variable types', () => {
      const realVec = v(2)(2, 4);
      const complexVec = v(2)(c(2, 4), c(1, 2));

      expect(inv(realVec).var).toEqual('r');
      expect(inv(complexVec).var).toEqual('c');
    });
  });

  describe('matrix operations', () => {
    it('calculates inverse of matrix elements', () => {
      const mat = m()([2, 4], [0.5, 8]);
      expect(inv(mat)).toEqual(m()([0.5, 0.25], [2, 0.125]));
    });

    it('handles complex matrix elements', () => {
      const mat = m()([c(2, 4), c(0.5, 0.25)]);
      // Mathematical complex inverse: 1/(a+bi) = (a-bi)/(a²+b²)
      // c(2, 4): (2-4i)/(4+16) = (2-4i)/20 = 0.1-0.2i
      // c(0.5, 0.25): (0.5-0.25i)/(0.25+0.0625) = (0.5-0.25i)/0.3125 = 1.6-0.8i
      expect(inv(mat)).toEqual(m()([c(0.1, -0.2), c(1.6, -0.8)]));
    });

    it('handles zero elements (results in Infinity)', () => {
      const mat = m()([2, 0], [4, 1]);
      expect(inv(mat)).toEqual(m()([0.5, Infinity], [0.25, 1]));
    });

    it('preserves variable types', () => {
      const realMat = m()([2, 4]);
      const complexMat = m()([c(2, 4)]);

      expect(inv(realMat).var).toEqual('r');
      expect(inv(complexMat).var).toEqual('c');
    });
  });

  describe('mathematical properties', () => {
    it('verifies inv(inv(a)) = a for non-zero values', () => {
      expect(inv(inv(2))).toBeCloseTo(2, 10);

      // For complex numbers, due to floating point precision, use toBeCloseTo
      const origComplex = c(2, 4);
      const doubleInv = inv(inv(origComplex));
      expect(doubleInv.real).toBeCloseTo(2, 10);
      expect(doubleInv.imag).toBeCloseTo(4, 10);

      const vec = v(2)(2, 4);
      const invInvVec = inv(inv(vec));
      expect(invInvVec.vec[0]).toBeCloseTo(2, 10);
      expect(invInvVec.vec[1]).toBeCloseTo(4, 10);
    });

    it('verifies inv(1) = 1', () => {
      expect(inv(1)).toEqual(1);
    });

    it('verifies inv(-1) = -1', () => {
      expect(inv(-1)).toEqual(-1);
    });
  });

  describe('edge cases', () => {
    it('handles very small numbers', () => {
      const small = 0.000001;
      expect(inv(small)).toBeCloseTo(1000000, 5);
    });

    it('handles very large numbers', () => {
      const large = 1000000;
      expect(inv(large)).toBeCloseTo(0.000001, 10);
    });

    it('handles NaN', () => {
      expect(inv(NaN)).toBeNaN();
      expect(inv(c(NaN, 2))).toEqual(c(NaN, 0.5));
    });

    it('handles negative zero', () => {
      expect(inv(-0)).toEqual(-Infinity);
    });
  });

  describe('error cases', () => {
    it('throws error for invalid arguments', () => {
      // @ts-ignore - will deal with later
      expect(() => inv()).toThrow('inv requires at least one argument');
    });

    it('throws error for invalid types', () => {
      expect(() => inv({})).toThrow();
      expect(() => inv(null)).toThrow();
      expect(() => inv(undefined)).toThrow();
    });
  });
});

