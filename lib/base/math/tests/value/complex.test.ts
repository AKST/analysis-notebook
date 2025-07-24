import { expect, describe, it } from 'vitest';
import { unit, el } from '../../index.js';

const { c } = unit;

describe('complex namespace functions', () => {
  describe('complex.magnitude', () => {
    it('calculates magnitude of complex numbers', () => {
      expect(c.magnitude(c(3, 4))).toEqual(5); // 3-4-5 triangle
      expect(c.magnitude(c(0, 1))).toEqual(1); // pure imaginary
      expect(c.magnitude(c(1, 0))).toEqual(1); // pure real
      expect(c.magnitude(c(0, 0))).toEqual(0); // zero
    });

    it('handles negative components', () => {
      expect(c.magnitude(c(-3, -4))).toEqual(5);
      expect(c.magnitude(c(3, -4))).toEqual(5);
      expect(c.magnitude(c(-3, 4))).toEqual(5);
    });

    it('handles decimal values', () => {
      expect(c.magnitude(c(1, 1))).toBeCloseTo(Math.sqrt(2), 10);
    });
  });

  describe('complex.phase', () => {
    it('calculates phase of complex numbers', () => {
      expect(c.phase(c(1, 0))).toEqual(0); // positive real axis
      expect(c.phase(c(0, 1))).toBeCloseTo(Math.PI / 2, 10); // positive imaginary axis
      expect(c.phase(c(-1, 0))).toBeCloseTo(Math.PI, 10); // negative real axis
      expect(c.phase(c(0, -1))).toBeCloseTo(-Math.PI / 2, 10); // negative imaginary axis
    });

    it('handles quadrants correctly', () => {
      expect(c.phase(c(1, 1))).toBeCloseTo(Math.PI / 4, 10); // first quadrant
      expect(c.phase(c(-1, 1))).toBeCloseTo(3 * Math.PI / 4, 10); // second quadrant
      expect(c.phase(c(-1, -1))).toBeCloseTo(-3 * Math.PI / 4, 10); // third quadrant
      expect(c.phase(c(1, -1))).toBeCloseTo(-Math.PI / 4, 10); // fourth quadrant
    });

    it('handles zero complex number', () => {
      expect(c.phase(c(0, 0))).toEqual(0); // atan2(0, 0) = 0
    });
  });

  describe('complex.conj', () => {
    it('calculates complex conjugate', () => {
      expect(c.conj(c(3, 4))).toEqual(c(3, -4));
      expect(c.conj(c(-2, 5))).toEqual(c(-2, -5));
      expect(c.conj(c(1, 0))).toEqual(c(1, -0));
      expect(c.conj(c(0, 3))).toEqual(c(0, -3));
    });

    it('double conjugate returns original', () => {
      const z = c(2, 3);
      expect(c.conj(c.conj(z))).toEqual(z);
    });

    it('handles zero', () => {
      expect(c.conj(c(0, 0))).toEqual(c(0, -0));
    });
  });

  describe('complex.real', () => {
    it('extracts real part', () => {
      expect(c.real(c(3, 4))).toEqual(3);
      expect(c.real(c(-2, 5))).toEqual(-2);
      expect(c.real(c(0, 1))).toEqual(0);
      expect(c.real(c(7, 0))).toEqual(7);
    });

    it('handles decimal values', () => {
      expect(c.real(c(3.14, 2.71))).toEqual(3.14);
    });
  });

  describe('complex.imag', () => {
    it('extracts imaginary part', () => {
      expect(c.imag(c(3, 4))).toEqual(4);
      expect(c.imag(c(-2, 5))).toEqual(5);
      expect(c.imag(c(1, 0))).toEqual(0);
      expect(c.imag(c(0, -3))).toEqual(-3);
    });

    it('handles decimal values', () => {
      expect(c.imag(c(3.14, 2.71))).toEqual(2.71);
    });
  });

  describe('integration and mathematical properties', () => {
    it('magnitude and conjugate relationship', () => {
      const z = c(3, 4);
      const conj_z = c.conj(z);

      // |z|² = z * conj(z) should be real and equal to magnitude²
      // Note: we don't have multiplication yet, so just test magnitude property
      expect(c.magnitude(z)).toEqual(c.magnitude(conj_z));
      expect(c.magnitude(z) ** 2).toEqual(25); // 3² + 4²
    });

    it('createMagAngle and magnitude/phase consistency', () => {
      const magnitude = 5;
      const phase = Math.PI / 3;
      const z = c.createMagAngle(magnitude, phase);

      expect(c.magnitude(z)).toBeCloseTo(magnitude, 10);
      expect(c.phase(z)).toBeCloseTo(phase, 10);
    });

    it('real and imag parts reconstruct original', () => {
      const original = c(3, 4);
      const reconstructed = c(c.real(original), c.imag(original));
      expect(reconstructed).toEqual(original);
    });

    it('magnitude is always non-negative', () => {
      const testCases = [
        c(3, 4), c(-3, 4), c(3, -4), c(-3, -4),
        c(0, 0), c(1, 0), c(0, 1), c(-1, 0), c(0, -1)
      ];

      testCases.forEach(z => {
        expect(c.magnitude(z)).toBeGreaterThanOrEqual(0);
      });
    });

    it('phase range is correct', () => {
      const testCases = [
        c(1, 1), c(-1, 1), c(-1, -1), c(1, -1),
        c(2, 0), c(-2, 0), c(0, 2), c(0, -2)
      ];

      testCases.forEach(z => {
        const phase = c.phase(z);
        expect(phase).toBeGreaterThanOrEqual(-Math.PI);
        expect(phase).toBeLessThanOrEqual(Math.PI);
      });
    });
  });
});
