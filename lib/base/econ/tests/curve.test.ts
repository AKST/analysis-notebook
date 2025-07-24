import { expect, describe, it } from 'vitest';
import { vector } from '../../math/value.js';
import {
  equilibriumQuantity,
  equilibrium,
  calcP,
  calcQ,
} from '../curve.js';

describe('market', () => {
  describe('equilibriumQuantity', () => {
    it('10 - Q = 4Q -> Q = 2', () => {
      const a = { i: 10, m: -1 } as const;
      const b = { i: 0, m: 4 } as const;
      expect(equilibriumQuantity(a, b)).toEqual(2);
    });

    it('8 - Q = 4Q - 2 -> Q = 2', () => {
      const a = { i: 8, m: -1 } as const;
      const b = { i: -2, m: 4 } as const;
      expect(equilibriumQuantity(a, b)).toEqual(2);
    });
  });

  describe('equilibrium', () => {
    it('10 - Q = 4Q -> Q = 2', () => {
      const a = { i: 10, m: -1 } as const;
      const b = { i: 0, m: 4 } as const;
      expect(equilibrium(a, b)).toEqual(vector(2)(2, 8));
    });

    it('8 - Q = 4Q - 2 -> Q = 2', () => {
      const a = { i: 8, m: -1 } as const;
      const b = { i: -2, m: 4 } as const;
      expect(equilibrium(a, b)).toEqual(vector(2)(2, 6));
    });
  });
  describe('calcP', () => {
    it('When Q = 2 and P = 30 - 3Q Therefore P = 24', () => {
      const a = { i: 30, m: -3 } as const;
      expect(calcP(2, a)).toEqual(24);
    });
  });

  describe('calcQ', () => {
    it('When P = 10 and P = 20 - 2Q Therefore Q = 5', () => {
      const a = { i: 20, m: -2 } as const;
      expect(calcQ(10, a)).toEqual(5);
    });
  });
});
