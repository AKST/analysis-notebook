import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { add, sub, mul, div, inv, neg, sqrt, pow, exp, log, unit, complex, euler } from '../../index.js';

const { c, m, v } = unit;

describe('add function (scalar only)', () => {
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
      expect(add(a, 3)).toEqual(c(4, 2));
      expect(add(5, a)).toEqual(c(6, 2));
    });

    it('supports partial application with complex numbers', () => {
      const addC = add(c(1, 2));
      expect(addC(c(3, 4))).toEqual(c(4, 6));
      expect(addC(5)).toEqual(c(6, 2));
    });
  });
});

describe('sub function (scalar only)', () => {
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
      expect(sub(a, 2)).toEqual(c(3, 3));
      expect(sub(8, a)).toEqual(c(3, -3));
    });

    it('supports partial application with complex numbers', () => {
      const subC = sub(c(5, 3));
      expect(subC(c(2, 1))).toEqual(c(3, 2));
      expect(subC(3)).toEqual(c(2, 3));
    });
  });
});

describe('neg function', () => {
  describe('number negation', () => {
    it('negates positive numbers', () => {
      expect(neg(5)).toEqual(-5);
      expect(neg(3.14)).toEqual(-3.14);
    });

    it('negates negative numbers', () => {
      expect(neg(-7)).toEqual(7);
      expect(neg(-2.5)).toEqual(2.5);
    });

    it('negates zero', () => {
      expect(neg(0)).toEqual(-0);
    });
  });

  describe('complex negation', () => {
    it('negates both real and imaginary parts', () => {
      expect(neg(c(3, 4))).toEqual(c(-3, -4));
      expect(neg(c(-2, 5))).toEqual(c(2, -5));
      expect(neg(c(0, -1))).toEqual(c(-0, 1));
    });

    it('handles pure real complex numbers', () => {
      expect(neg(c(5, 0))).toEqual(c(-5, -0));
    });

    it('handles pure imaginary complex numbers', () => {
      expect(neg(c(0, 3))).toEqual(c(-0, -3));
    });
  });

  describe('vector negation', () => {
    it('negates real vectors', () => {
      expect(neg(v()(1, 2, 3))).toEqual(v()(-1, -2, -3));
      expect(neg(v()(-5, 0, 7))).toEqual(v()(5, -0, -7));
    });

    it('negates complex vectors', () => {
      const vec = v()(c(1, 2), c(-3, 4));
      const result = neg(vec);
      expect(result).toEqual(v()(c(-1, -2), c(3, -4)));
    });

    it('handles empty vectors', () => {
      expect(neg(v()())).toEqual(v()());
    });
  });

  describe('matrix negation', () => {
    it('negates real matrices', () => {
      const mat = m(2, 2)([1, 2], [3, -4]);
      expect(neg(mat)).toEqual(m(2, 2)([-1, -2], [-3, 4]));
    });

    it('negates complex matrices', () => {
      const mat = m(1, 2)([c(1, 2), c(-3, 4)]);
      expect(neg(mat)).toEqual(m(1, 2)([c(-1, -2), c(3, -4)]));
    });

    it('handles single element matrices', () => {
      expect(neg(m(1, 1)([5]))).toEqual(m(1, 1)([-5]));
    });
  });
});

describe('mul function (scalar only)', () => {
  describe('number multiplication', () => {
    it('multiplies two numbers', () => {
      expect(mul(3, 4)).toEqual(12);
      expect(mul(-2, 5)).toEqual(-10);
      expect(mul(0, 7)).toEqual(0);
    });

    it('supports partial application with numbers', () => {
      const mul3 = mul(3);
      expect(mul3(4)).toEqual(12);
      expect(mul3(-2)).toEqual(-6);
    });
  });

  describe('complex multiplication', () => {
    it('multiplies two complex numbers', () => {
      expect(mul(c(1, 2), c(3, 4))).toEqual(c(-5, 10)); // (1+2i)(3+4i) = -5+10i
      expect(mul(c(2, 0), c(3, 4))).toEqual(c(6, 8));
    });

    it('multiplies complex and real numbers', () => {
      const a = c(2, 3);
      expect(mul(a, 2)).toEqual(c(4, 6));
      expect(mul(3, a)).toEqual(c(6, 9));
    });

    it('supports partial application with complex numbers', () => {
      const mulC = mul(c(2, 1));
      expect(mulC(c(1, 1))).toEqual(c(1, 3)); // (2+i)(1+i) = 1+3i
      expect(mulC(2)).toEqual(c(4, 2));
    });
  });
});

describe('div function (scalar only)', () => {
  describe('number division', () => {
    it('divides two numbers', () => {
      expect(div(12, 4)).toEqual(3);
      expect(div(10, -2)).toEqual(-5);
      expect(div(7, 2)).toEqual(3.5);
    });

    it('supports partial application with numbers', () => {
      const div10 = div(10);
      expect(div10(2)).toEqual(5);
      expect(div10(5)).toEqual(2);
    });
  });

  describe('complex division', () => {
    it('divides two complex numbers', () => {
      const result = div(c(1, 1), c(1, -1));
      expect(result.real).toBeCloseTo(0);
      expect(result.imag).toBeCloseTo(1);
    });

    it('divides complex and real numbers', () => {
      const a = c(4, 2);
      expect(div(a, 2)).toEqual(c(2, 1));

      const result = div(6, c(2, 0));
      expect(result).toEqual(c(3, -0));
    });

    it('supports partial application with complex numbers', () => {
      const divC = div(c(4, 4));
      const result = divC(c(2, 0));
      expect(result).toEqual(c(2, 2));
    });
  });
});

describe('inv function', () => {
  describe('number inversion', () => {
    it('inverts positive numbers', () => {
      expect(inv(2)).toEqual(0.5);
      expect(inv(4)).toEqual(0.25);
      expect(inv(0.5)).toEqual(2);
    });

    it('inverts negative numbers', () => {
      expect(inv(-2)).toEqual(-0.5);
      expect(inv(-0.25)).toEqual(-4);
    });
  });

  describe('complex inversion', () => {
    it('inverts complex numbers using conjugate method', () => {
      // 1/(1+i) = (1-i)/((1+i)(1-i)) = (1-i)/2 = 0.5 - 0.5i
      const result = inv(c(1, 1));
      expect(result.real).toBeCloseTo(0.5);
      expect(result.imag).toBeCloseTo(-0.5);
    });

    it('inverts pure real complex numbers', () => {
      expect(inv(c(2, 0))).toEqual(c(0.5, -0));
      expect(inv(c(-4, 0))).toEqual(c(-0.25, -0));
    });

    it('inverts pure imaginary complex numbers', () => {
      // 1/(2i) = -i/(2i²) = -i/(-2) = i/2 = 0 + 0.5i
      const result = inv(c(0, 2));
      expect(result.real).toBeCloseTo(0);
      expect(result.imag).toBeCloseTo(-0.5);
    });

    it('verifies inverse property: z * inv(z) = 1', () => {
      const z = c(3, 4);
      const invZ = inv(z);
      const product = mul(z, invZ);
      expect(product.real).toBeCloseTo(1);
      expect(product.imag).toBeCloseTo(0);
    });
  });

  describe('matrix inversion', () => {
    it('inverts a 2x2 matrix', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const result = inv(matrix);

      // Expected inverse: [[-2, 1], [1.5, -0.5]]
      expect(result.mat[0][0]).toBeCloseTo(-2);
      expect(result.mat[0][1]).toBeCloseTo(1);
      expect(result.mat[1][0]).toBeCloseTo(1.5);
      expect(result.mat[1][1]).toBeCloseTo(-0.5);
    });

    it('inverts identity matrix', () => {
      const identity = m(2, 2)([1, 0], [0, 1]);
      const result = inv(identity);

      expect(result.mat[0][0]).toBeCloseTo(1);
      expect(result.mat[0][1]).toBeCloseTo(0);
      expect(result.mat[1][0]).toBeCloseTo(0);
      expect(result.mat[1][1]).toBeCloseTo(1);
    });

    it('verifies inverse property: A * inv(A) = I', () => {
      const matrix = m(2, 2)([2, 1], [1, 1]);
      const inverse = inv(matrix);
      const product = mul(matrix, inverse);

      // Should be close to identity matrix
      expect(product.mat[0][0]).toBeCloseTo(1);
      expect(product.mat[0][1]).toBeCloseTo(0);
      expect(product.mat[1][0]).toBeCloseTo(0);
      expect(product.mat[1][1]).toBeCloseTo(1);
    });

    it('throws error for singular matrix', () => {
      const singular = m(2, 2)([1, 2], [2, 4]);
      expect(() => inv(singular)).toThrow();
    });
  });
});

describe('euler constant', () => {
  it('equals Math.E', () => {
    expect(euler).toEqual(Math.E);
    expect(euler).toBeCloseTo(2.718281828459045);
  });
});

describe('sqrt function', () => {
  describe('real square root', () => {
    it('calculates square root of positive numbers', () => {
      expect(sqrt(4)).toEqual(2);
      expect(sqrt(9)).toEqual(3);
      expect(sqrt(16)).toEqual(4);
      expect(sqrt(2)).toBeCloseTo(1.4142135623730951);
    });

    it('handles zero', () => {
      expect(sqrt(0)).toEqual(0);
    });

    it('handles decimal numbers', () => {
      expect(sqrt(0.25)).toEqual(0.5);
      expect(sqrt(1.44)).toBeCloseTo(1.2);
    });

    it('returns NaN for negative numbers', () => {
      expect(sqrt(-4)).toBeNaN();
      expect(sqrt(-1)).toBeNaN();
    });
  });

  describe('complex square root', () => {
    it('calculates square root of positive real complex numbers', () => {
      const result = sqrt(c(4, 0));
      expect(result.real).toBeCloseTo(2);
      expect(result.imag).toBeCloseTo(0);
    });

    it('calculates square root of pure imaginary numbers', () => {
      // √(4i) = √4 * √i = 2 * e^(iπ/4) = 2 * (√2/2 + i√2/2) = √2 + i√2
      const result = sqrt(c(0, 4));
      expect(result.real).toBeCloseTo(Math.sqrt(2), 10);
      expect(result.imag).toBeCloseTo(Math.sqrt(2), 10);
    });

    it('calculates square root of complex numbers in first quadrant', () => {
      // √(3+4i): magnitude = 5, phase = atan2(4,3) ≈ 0.927
      // √(3+4i) = √5 * e^(i*0.927/2) ≈ 2 + i
      const result = sqrt(c(3, 4));
      expect(result.real).toBeCloseTo(2, 10);
      expect(result.imag).toBeCloseTo(1, 10);
    });

    it('calculates square root of complex numbers in second quadrant', () => {
      const result = sqrt(c(-3, 4));
      expect(result.real).toBeCloseTo(1, 10);
      expect(result.imag).toBeCloseTo(2, 10);
    });

    it('calculates square root of complex numbers in third quadrant', () => {
      const result = sqrt(c(-3, -4));
      expect(result.real).toBeCloseTo(1, 10);
      expect(result.imag).toBeCloseTo(-2, 10);
    });

    it('calculates square root of complex numbers in fourth quadrant', () => {
      const result = sqrt(c(3, -4));
      expect(result.real).toBeCloseTo(2, 10);
      expect(result.imag).toBeCloseTo(-1, 10);
    });

    it('verifies square root property: (√z)² = z', () => {
      const z = c(3, 4);
      const sqrtZ = sqrt(z);
      const squared = mul(sqrtZ, sqrtZ);
      expect(squared.real).toBeCloseTo(z.real, 10);
      expect(squared.imag).toBeCloseTo(z.imag, 10);
    });
  });
});

describe('pow function', () => {
  describe('real powers', () => {
    it('calculates integer powers', () => {
      expect(pow(2, 3)).toEqual(8);
      expect(pow(5, 2)).toEqual(25);
      expect(pow(3, 4)).toEqual(81);
      expect(pow(10, 0)).toEqual(1);
      expect(pow(7, 1)).toEqual(7);
    });

    it('calculates negative integer powers', () => {
      expect(pow(2, -3)).toEqual(0.125);
      expect(pow(4, -2)).toEqual(0.0625);
      expect(pow(10, -1)).toEqual(0.1);
    });

    it('calculates fractional powers', () => {
      expect(pow(4, 0.5)).toEqual(2);
      expect(pow(8, 1/3)).toBeCloseTo(2, 10);
      expect(pow(16, 0.25)).toEqual(2);
      expect(pow(27, 1/3)).toBeCloseTo(3, 10);
    });

    it('handles edge cases', () => {
      expect(pow(0, 5)).toEqual(0);
      expect(pow(1, 100)).toEqual(1);
      expect(pow(-2, 3)).toEqual(-8);
      expect(pow(-3, 2)).toEqual(9);
    });
  });

  describe('complex powers', () => {
    it('calculates powers of real complex numbers', () => {
      const result = pow(c(2, 0), 3);
      expect(result.real).toBeCloseTo(8);
      expect(result.imag).toBeCloseTo(0);
    });

    it('calculates powers of pure imaginary numbers', () => {
      // i^2 = -1
      const result = pow(c(0, 1), 2);
      expect(result.real).toBeCloseTo(-1, 10);
      expect(result.imag).toBeCloseTo(0, 10);
    });

    it('calculates integer powers of complex numbers', () => {
      // (1+i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = 2i
      const result = pow(c(1, 1), 2);
      expect(result.real).toBeCloseTo(0, 10);
      expect(result.imag).toBeCloseTo(2, 10);
    });

    it('calculates fractional powers of complex numbers', () => {
      // (1+i)^0.5 should be square root of (1+i)
      const base = c(1, 1);
      const result = pow(base, 0.5);
      const squared = mul(result, result);
      expect(squared.real).toBeCloseTo(base.real, 10);
      expect(squared.imag).toBeCloseTo(base.imag, 10);
    });

    it('calculates negative powers of complex numbers', () => {
      const base = c(2, 2);
      const result = pow(base, -1);
      const product = mul(base, result);
      expect(product.real).toBeCloseTo(1, 10);
      expect(product.imag).toBeCloseTo(0, 10);
    });

    it('verifies power property: z^(a+b) = z^a * z^b', () => {
      const z = c(2, 1);
      const a = 2;
      const b = 3;
      const left = pow(z, a + b);
      const right = mul(pow(z, a), pow(z, b));
      expect(left.real).toBeCloseTo(right.real, 10);
      expect(left.imag).toBeCloseTo(right.imag, 10);
    });
  });

  describe('matrix powers', () => {
    it('calculates matrix^0 returns identity', () => {
      const matrix = m(2, 2)([2, 1], [1, 2]);
      const result = pow(matrix, 0);
      expect(result).toEqual(m.identity(2));
    });

    it('calculates matrix^1 returns original matrix', () => {
      const matrix = m(2, 2)([2, 1], [1, 2]);
      const result = pow(matrix, 1);
      expect(result).toEqual(matrix);
    });

    it('calculates positive integer powers', () => {
      const matrix = m(2, 2)([2, 0], [0, 3]);
      const result = pow(matrix, 2);
      expect(result.mat).toEqual([[4, 0], [0, 9]]);

      const result3 = pow(matrix, 3);
      expect(result3.mat).toEqual([[8, 0], [0, 27]]);
    });

    it('calculates negative integer powers', () => {
      const matrix = m(2, 2)([2, 0], [0, 4]);
      const result = pow(matrix, -1);
      expect(result.mat[0][0]).toBeCloseTo(0.5);
      expect(result.mat[0][1]).toBeCloseTo(0);
      expect(result.mat[1][0]).toBeCloseTo(0);
      expect(result.mat[1][1]).toBeCloseTo(0.25);
    });

    it('calculates powers of 2x2 matrices efficiently', () => {
      const matrix = m(2, 2)([1, 1], [0, 1]);
      const result = pow(matrix, 5);
      // This should be [[1, 5], [0, 1]] for this specific matrix
      expect(result.mat[0][0]).toEqual(1);
      expect(result.mat[0][1]).toEqual(5);
      expect(result.mat[1][0]).toEqual(0);
      expect(result.mat[1][1]).toEqual(1);
    });

    it('verifies power property: A^(m+n) = A^m * A^n', () => {
      const matrix = m(2, 2)([2, 1], [1, 2]);
      const m1 = 2;
      const n1 = 3;
      const left = pow(matrix, m1 + n1);
      const right = m.mul(pow(matrix, m1), pow(matrix, n1));

      for (let i = 0; i < left.n; i++) {
        for (let j = 0; j < left.m; j++) {
          // @ts-ignore - not worth it
          expect(left.mat[i][j]).toBeCloseTo(right.mat[i][j], 10);
        }
      }
    });

    describe('errors', () => {
      let consoleErrorSpy: any;

      beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
      });

      it('throws error for non-square matrices', () => {
        const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);
        expect(() => pow(matrix, 2)).toThrow('Matrix needs to be square');
      });
    });
  });
});

describe('exp function', () => {
  describe('real exponential', () => {
    it('calculates exponential of positive numbers', () => {
      expect(exp(0)).toEqual(1);
      expect(exp(1)).toBeCloseTo(Math.E, 10);
      expect(exp(2)).toBeCloseTo(Math.E * Math.E, 10);
      expect(exp(-1)).toBeCloseTo(1/Math.E, 10);
    });

    it('handles special values', () => {
      expect(exp(0)).toEqual(1);
      expect(exp(-Infinity)).toEqual(0);
      expect(exp(Infinity)).toEqual(Infinity);
    });

    it('calculates natural logarithm base correctly', () => {
      expect(exp(Math.log(5))).toBeCloseTo(5, 10);
      expect(exp(Math.log(10))).toBeCloseTo(10, 10);
    });
  });

  describe('complex exponential', () => {
    it('calculates exponential of real complex numbers', () => {
      const result = exp(c(1, 0));
      expect(result.real).toBeCloseTo(Math.E);
      expect(result.imag).toBeCloseTo(0);
    });

    it('calculates exponential of pure imaginary numbers', () => {
      // e^(iπ) = cos(π) + i*sin(π) = -1 + 0i
      const result = exp(c(0, Math.PI));
      expect(result.real).toBeCloseTo(-1, 10);
      expect(result.imag).toBeCloseTo(0, 10);
    });

    it('calculates exponential using Euler formula', () => {
      // e^(iπ/2) = cos(π/2) + i*sin(π/2) = 0 + i
      const result = exp(c(0, Math.PI/2));
      expect(result.real).toBeCloseTo(0, 10);
      expect(result.imag).toBeCloseTo(1, 10);
    });

    it('calculates exponential of complex numbers', () => {
      // e^(1+i) = e^1 * (cos(1) + i*sin(1))
      const result = exp(c(1, 1));
      const expected_real = Math.E * Math.cos(1);
      const expected_imag = Math.E * Math.sin(1);
      expect(result.real).toBeCloseTo(expected_real, 10);
      expect(result.imag).toBeCloseTo(expected_imag, 10);
    });

    it('verifies Euler identity: e^(iπ) + 1 = 0', () => {
      const result = exp(c(0, Math.PI));
      const identity = add(result, 1);
      expect(identity.real).toBeCloseTo(0, 10);
      expect(identity.imag).toBeCloseTo(0, 10);
    });

    it('verifies exponential property: e^(a+b) = e^a * e^b', () => {
      const a = c(1, 2);
      const b = c(2, 1);
      const sum = add(a, b);
      const left = exp(sum);
      const right = mul(exp(a), exp(b));
      expect(left.real).toBeCloseTo(right.real, 10);
      expect(left.imag).toBeCloseTo(right.imag, 10);
    });

    it('handles negative complex numbers', () => {
      const result = exp(c(-1, -Math.PI/2));
      const expected_real = (1/Math.E) * Math.cos(-Math.PI/2);
      const expected_imag = (1/Math.E) * Math.sin(-Math.PI/2);
      expect(result.real).toBeCloseTo(expected_real, 10);
      expect(result.imag).toBeCloseTo(expected_imag, 10);
    });
  });
});

describe('exp function with arbitrary bases', () => {
  describe('real base exponentials', () => {
    it('calculates real base with real exponent', () => {
      expect(exp(2, 3)).toEqual(9);        // 3^2 = 9
      expect(exp(3, 2)).toEqual(8);        // 2^3 = 8
      expect(exp(0.5, 4)).toEqual(2);     // 4^0.5 = 2^2 = 16
      expect(exp(-1, 2)).toEqual(0.5);     // 2^(-1) = 0.5
    });

    it('handles special values with real base', () => {
      expect(exp(0, 5)).toEqual(1);        // 5^0 = 1
      expect(exp(1, 7)).toEqual(7);        // 7^1 = 7
      expect(exp(2, 1)).toEqual(1);        // 1^2 = 1
    });

    it('calculates real base with complex exponent', () => {
      // 2^(1+i) = 2^1 * 2^i = 2 * e^(i*ln(2)) = 2 * (cos(ln(2)) + i*sin(ln(2)))
      const result = exp(c(1, 1), 2);
      const expected_real = 2 * Math.cos(Math.log(2));
      const expected_imag = 2 * Math.sin(Math.log(2));
      expect(result.real).toBeCloseTo(expected_real, 10);
      expect(result.imag).toBeCloseTo(expected_imag, 10);
    });

    it('verifies base e matches natural exponential', () => {
      expect(exp(2, Math.E)).toBeCloseTo(exp(2), 10);
      expect(exp(-1, Math.E)).toBeCloseTo(exp(-1), 10);

      const complexExp = exp(c(1, Math.PI), Math.E);
      const naturalExp = exp(c(1, Math.PI));
      expect(complexExp.real).toBeCloseTo(naturalExp.real, 10);
      expect(complexExp.imag).toBeCloseTo(naturalExp.imag, 10);
    });
  });

  describe('complex base exponentials', () => {
    it('calculates complex base with real exponent', () => {
      // (1+i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = 2i
      const result = exp(2, c(1, 1));
      expect(result.real).toBeCloseTo(0, 10);
      expect(result.imag).toBeCloseTo(2, 10);
    });

    it('calculates complex base with complex exponent', () => {
      // (1+i)^(1+i) = e^((1+i) * ln(1+i))
      const base = c(1, 1);
      const exponent = c(1, 1);
      const result = exp(exponent, base);

      // Verify by computing manually: e^((1+i) * (ln(√2) + i*π/4))
      const logBase = log(base);
      const product = mul(exponent, logBase);
      const expected = exp(product);

      expect(result.real).toBeCloseTo(expected.real, 10);
      expect(result.imag).toBeCloseTo(expected.imag, 10);
    });

    it('calculates complex base with zero exponent', () => {
      // Any complex base^0 should equal 1
      const result1 = exp(0, c(2, 3));
      const result2 = exp(0, c(-1, 4));

      expect(result1.real).toBeCloseTo(1, 10);
      expect(result1.imag).toBeCloseTo(0, 10);
      expect(result2.real).toBeCloseTo(1, 10);
      expect(result2.imag).toBeCloseTo(0, 10);
    });

    it('verifies complex exponential properties', () => {
      const base = c(2, 1);
      const a = c(1, 0.5);
      const b = c(0.5, 1);

      // base^(a+b) should equal base^a * base^b
      const left = exp(add(a, b), base);
      const right = mul(exp(a, base), exp(b, base));

      expect(left.real).toBeCloseTo(right.real, 8);
      expect(left.imag).toBeCloseTo(right.imag, 8);
    });
  });

  describe('matrix base exponentials', () => {
    it('calculates matrix base with real exponent', () => {
      const matrix = m(2, 2)([2, 0], [0, 3]);
      const result = exp(2, matrix);  // matrix^2

      // For diagonal matrix, (diag)^2 = diag of squares
      expect(result.mat[0][0]).toEqual(4);  // 2^2
      expect(result.mat[0][1]).toEqual(0);
      expect(result.mat[1][0]).toEqual(0);
      expect(result.mat[1][1]).toEqual(9);  // 3^2
    });

    it('verifies matrix^0 equals identity', () => {
      const matrix = m(2, 2)([2, 1], [1, 2]);
      const result = exp(0, matrix);

      expect(result).toEqual(m.identity(2));
    });

    it('verifies matrix^1 equals original matrix', () => {
      const matrix = m(2, 2)([2, 1], [1, 2]);
      const result = exp(1, matrix);

      expect(result).toEqual(matrix);
    });

    it('throws error for matrix base with matrix exponent', () => {
      const base = m(2, 2)([1, 2], [3, 4]);
      const exponent = m(2, 2)([2, 1], [1, 2]);

      expect(() => exp(exponent, base)).toThrow();
    });
  });

  describe('mathematical properties', () => {
    it('verifies exponential laws for real bases', () => {
      const base = 2;
      const a = 3;
      const b = 2;

      // base^(a+b) = base^a * base^b
      const left = exp(a + b, base);
      const right = exp(a, base) * exp(b, base);

      expect(left).toBeCloseTo(right, 10);
    });

    it('verifies power of power rule', () => {
      // (base^a)^b = base^(a*b)
      const base = 3;
      const a = 2;
      const b = 3;

      const left = exp(b, exp(a, base));  // (3^2)^3
      const right = exp(a * b, base);     // 3^(2*3)

      expect(left).toBeCloseTo(right, 10);
    });

    it('verifies inverse relationship with logarithm', () => {
      const base = 2;
      const x = 5;

      // base^(log_base(x)) = x (when log supports arbitrary bases)
      // For now, test with natural log: e^(ln(x)) = x
      expect(exp(log(x), Math.E)).toBeCloseTo(x, 10);
    });

    it('handles edge cases', () => {
      // Any base^0 = 1
      expect(exp(0, 5)).toEqual(1);
      expect(exp(0, -2)).toEqual(1);

      // base^1 = base
      expect(exp(1, 7)).toEqual(7);
      expect(exp(1, -3)).toEqual(-3);

      // 1^anything = 1
      expect(exp(5, 1)).toEqual(1);
      expect(exp(-2, 1)).toEqual(1);
    });
  });
});

describe('log function', () => {
  describe('real logarithm', () => {
    it('calculates natural logarithm of positive numbers', () => {
      expect(log(1)).toEqual(0);
      expect(log(Math.E)).toBeCloseTo(1, 10);
      expect(log(Math.E * Math.E)).toBeCloseTo(2, 10);
      expect(log(Math.E * Math.E * Math.E)).toBeCloseTo(3, 10);
    });

    it('calculates logarithm of common values', () => {
      expect(log(1)).toEqual(0);
      expect(log(Math.E)).toBeCloseTo(1, 10);
      expect(log(10)).toBeCloseTo(Math.log(10), 10);
      expect(log(2)).toBeCloseTo(Math.log(2), 10);
    });

    it('handles special values', () => {
      expect(log(1)).toEqual(0);
      expect(log(0)).toEqual(-Infinity);
      expect(log(Infinity)).toEqual(Infinity);
      expect(log(-1)).toBeNaN();
    });

    it('verifies log/exp inverse relationship', () => {
      expect(log(exp(1))).toBeCloseTo(1, 10);
      expect(log(exp(2))).toBeCloseTo(2, 10);
      expect(exp(log(5))).toBeCloseTo(5, 10);
      expect(exp(log(10))).toBeCloseTo(10, 10);
    });
  });

  describe('complex logarithm', () => {
    it('calculates logarithm of real complex numbers', () => {
      const result = log(c(Math.E, 0));
      expect(result.real).toBeCloseTo(1, 10);
      expect(result.imag).toBeCloseTo(0, 10);
    });

    it('calculates logarithm of pure imaginary numbers', () => {
      // log(i) = log|i| + i*arg(i) = log(1) + i*(π/2) = 0 + i*π/2
      const result = log(c(0, 1));
      expect(result.real).toBeCloseTo(0, 10);
      expect(result.imag).toBeCloseTo(Math.PI/2, 10);
    });

    it('calculates logarithm of negative real numbers', () => {
      // log(-1) = log|-1| + i*arg(-1) = log(1) + i*π = 0 + i*π
      const result = log(c(-1, 0));
      expect(result.real).toBeCloseTo(0, 10);
      expect(result.imag).toBeCloseTo(Math.PI, 10);
    });

    it('calculates logarithm of complex numbers', () => {
      // log(1+i) = log|1+i| + i*arg(1+i) = log(√2) + i*(π/4)
      const result = log(c(1, 1));
      expect(result.real).toBeCloseTo(Math.log(Math.sqrt(2)), 10);
      expect(result.imag).toBeCloseTo(Math.PI/4, 10);
    });

    it('verifies log/exp inverse relationship for complex numbers', () => {
      const z = c(2, 3);
      const logZ = log(z);
      const expLogZ = exp(logZ);
      expect(expLogZ.real).toBeCloseTo(z.real, 10);
      expect(expLogZ.imag).toBeCloseTo(z.imag, 10);
    });

    it('verifies exp/log inverse relationship for complex numbers', () => {
      const z = c(1, 2);
      const expZ = exp(z);
      const logExpZ = log(expZ);
      expect(logExpZ.real).toBeCloseTo(z.real, 10);
      expect(logExpZ.imag).toBeCloseTo(z.imag, 10);
    });

    it('calculates logarithm of complex numbers in different quadrants', () => {
      // Second quadrant: -1+i
      const result2 = log(c(-1, 1));
      expect(result2.real).toBeCloseTo(Math.log(Math.sqrt(2)), 10);
      expect(result2.imag).toBeCloseTo(3*Math.PI/4, 10);

      // Third quadrant: -1-i
      const result3 = log(c(-1, -1));
      expect(result3.real).toBeCloseTo(Math.log(Math.sqrt(2)), 10);
      expect(result3.imag).toBeCloseTo(-3*Math.PI/4, 10);

      // Fourth quadrant: 1-i
      const result4 = log(c(1, -1));
      expect(result4.real).toBeCloseTo(Math.log(Math.sqrt(2)), 10);
      expect(result4.imag).toBeCloseTo(-Math.PI/4, 10);
    });

    it('verifies logarithm properties', () => {
      const z1 = c(2, 1);
      const z2 = c(1, 2);

      // log(z1 * z2) = log(z1) + log(z2)
      const product = mul(z1, z2);
      const logProduct = log(product);
      const sumOfLogs = add(log(z1), log(z2));
      expect(logProduct.real).toBeCloseTo(sumOfLogs.real, 10);
      expect(logProduct.imag).toBeCloseTo(sumOfLogs.imag, 10);
    });
  });
});

describe('log function with arbitrary bases', () => {
  describe('real base logarithms', () => {
    it('calculates base 2 logarithms', () => {
      expect(log(8, 2)).toBeCloseTo(3, 10);   // log_2(8) = 3
      expect(log(16, 2)).toBeCloseTo(4, 10);  // log_2(16) = 4
      expect(log(1, 2)).toBeCloseTo(0, 10);   // log_2(1) = 0
    });

    it('calculates base 10 logarithms', () => {
      expect(log(100, 10)).toBeCloseTo(2, 10);   // log_10(100) = 2
      expect(log(1000, 10)).toBeCloseTo(3, 10);  // log_10(1000) = 3
      expect(log(1, 10)).toBeCloseTo(0, 10);     // log_10(1) = 0
    });

    it('verifies change of base formula', () => {
      const x = 50;
      const base = 3;
      // log_base(x) = ln(x) / ln(base)
      const expected = Math.log(x) / Math.log(base);
      expect(log(x, base)).toBeCloseTo(expected, 10);
    });

    it('calculates real base with complex argument', () => {
      // log_2(1+i) = ln(1+i) / ln(2)
      const z = c(1, 1);
      const result = log(z, 2);
      const naturalLog = log(z);
      const logBase = Math.log(2);
      expect(result.real).toBeCloseTo(naturalLog.real / logBase, 10);
      expect(result.imag).toBeCloseTo(naturalLog.imag / logBase, 10);
    });
  });

  describe('complex base logarithms', () => {
    it('calculates complex base with real argument', () => {
      // log_(1+i)(2) = ln(2) / ln(1+i)
      const base = c(1, 1);
      const result = log(2, base);
      const naturalLog = Math.log(2);
      const logBase = log(base);
      const expected = div(naturalLog, logBase);
      expect(result.real).toBeCloseTo(expected.real, 10);
      expect(result.imag).toBeCloseTo(expected.imag, 10);
    });

    it('calculates complex base with complex argument', () => {
      // log_(2+i)(1+i) = ln(1+i) / ln(2+i)
      const base = c(2, 1);
      const arg = c(1, 1);
      const result = log(arg, base);
      const naturalLogArg = log(arg);
      const naturalLogBase = log(base);
      const expected = div(naturalLogArg, naturalLogBase);
      expect(result.real).toBeCloseTo(expected.real, 10);
      expect(result.imag).toBeCloseTo(expected.imag, 10);
    });
  });

  describe('mathematical properties', () => {
    it('verifies base^(log_base(x)) = x', () => {
      const x = 7;
      const base = 3;
      const logResult = log(x, base);
      const expResult = exp(logResult, base);
      expect(expResult).toBeCloseTo(x, 10);
    });

    it('verifies log_base(base^x) = x', () => {
      const x = 2.5;
      const base = 4;
      const expResult = exp(x, base);
      const logResult = log(expResult, base);
      expect(logResult).toBeCloseTo(x, 10);
    });

    it('verifies log_base(x*y) = log_base(x) + log_base(y)', () => {
      const x = 5;
      const y = 3;
      const base = 2;
      const left = log(x * y, base);
      const right = log(x, base) + log(y, base);
      expect(left).toBeCloseTo(right, 10);
    });

    it('handles special values', () => {
      expect(log(1, 5)).toBeCloseTo(0, 10);      // log_base(1) = 0 for any base
      expect(log(2, 2)).toBeCloseTo(1, 10);      // log_base(base) = 1
      expect(log(4, 2)).toBeCloseTo(2, 10);      // log_2(2^2) = 2
    });
  });

  describe('error cases', () => {
    it('throws error for matrix base', () => {
      const base = m(2, 2)([1, 0], [0, 1]);
      expect(() => log(5, base)).toThrow('Matrix base logarithm not supported');
    });
  });
});

