import { assert, expect, describe, it } from 'vitest';
import { Unreachable } from '../../../util/type.js';
import { v2 } from '../../geom_2d/index.js';
import type { Curve, Model } from '../type.ts';
import { status as _status } from '../solver.js';
import * as curves from '../curve.js';


describe('status', () => {
  const supplyDefault = { kind: 'continious', dir: 1, i: 0, m: 1 } as const;
  const demandDefault = { kind: 'continious', dir: -1, i: 40, m: -1 } as const;
  const createModel = ({
    supply = supplyDefault,
    demand = demandDefault,
    supplyExtern,
    demandExtern,
    worldPrice,
    importing,
    exporting,
    unitTaxDemand = 0,
    unitTaxSupply = 0,
    unitSubDemand = 0,
    unitSubSupply = 0,
    unitTariffImport = 0,
    unitTariffExport = 0,
    unitQuotaLicensed = 0,
    priceFloor,
    priceCeiling,
  }: {
    supply?: Curve.T,
    demand?: Curve.T,
    supplyExtern?: number,
    demandExtern?: number,
    worldPrice?: number,
    importing?: boolean,
    exporting?: boolean,
    unitTaxDemand?: number,
    unitTaxSupply?: number,
    unitSubDemand?: number,
    unitSubSupply?: number,
    unitTariffImport?: number,
    unitTariffExport?: number,
    unitQuotaLicensed?: number,
    priceFloor?: number,
    priceCeiling?: number,
  } = {}): Model.Config.T => ({
    world: { price: worldPrice ?? 0 },
    market: {
      supply,
      demand,
    },
    extern: { supply: supplyExtern ?? 0, demand: demandExtern ?? 0 },
    policy: {
      anchor: {
        price: {
          floor: priceFloor,
          ceiling: priceCeiling,
        },
      },
      permit: {
        importing: importing == null ? worldPrice != null : importing,
        exporting: exporting == null ? worldPrice != null : exporting,
      },
      quota: {
        licensed: { unit: unitQuotaLicensed },
      },
      transfer: {
        tax: {
          supply: { unit: unitTaxSupply },
          demand: { unit: unitTaxDemand },
        },
        subsidy: {
          supply: { unit: unitSubSupply },
          demand: { unit: unitSubDemand },
        },
        tariff: {
          export: { unit: unitTariffExport },
          import: { unit: unitTariffImport },
        },
      },
    },
  });

  const status = (...args: Parameters<typeof createModel>) => {
    const result = _status(createModel(...args));
    if (result.ok) return result.model;
    throw new Error(result.reason);
  }

  type ShortHand =
    | ['eq', number]
    | ['mono', number, number, number]
    | ['dual', [number, number, number], [number, number, number]]

  const allocShortHand = (sh: ShortHand): Model.Desc.Alloc => {
    switch (sh[0]) {
      case 'eq': {
        const a = sh[1];
        return { kind: 'mono-alloc', value: { quantity: a, effectivePrice: a, reservationPrice: a } };
      }

      case 'mono': {
        const [_, quantity, effectivePrice, reservationPrice] = sh;
        return { kind: 'mono-alloc', value: { quantity, effectivePrice, reservationPrice } };
      }

      case 'dual': {
        return {
          kind: 'dual-alloc',
          local: { quantity: sh[1][0], effectivePrice: sh[1][1], reservationPrice: sh[1][2] },
          world: { quantity: sh[2][0], effectivePrice: sh[2][1], reservationPrice: sh[2][2] },
        };
      }

      default:
        throw new Unreachable(sh);
    }
  };

  const mResult = (cfg: { supply: ShortHand, demand: ShortHand }) => {
    return expect.objectContaining({
      demand: expect.objectContaining({ alloc: allocShortHand(cfg.demand) }),
      supply: expect.objectContaining({ alloc: allocShortHand(cfg.supply) }),
    } as const);
  };

  describe('equilbrium', () => {
    it('continious curves', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
      })).toEqual(mResult({
        supply: ['eq', 20],
        demand: ['eq', 20],
      }));
    });

    it('discrete curves', () => {
      expect(status({
        supply: curves.discrete(1, [6, 5, 4, 3, 2, 1, 0]),
        demand: curves.discrete(-1, [6, 5, 4, 3, 2, 1, 0]),
      })).toEqual(mResult({
        supply: ['eq', 3],
        demand: ['eq', 3],
      }));
    });
  });

  describe('floors', () => {
    it('nonbinding floor', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        priceFloor: 10,
      })).toEqual(mResult({
        supply: ['mono', 20, 20, 20],
        demand: ['mono', 20, 20, 20],
      }));
    });

    it('binding floor', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        priceFloor: 30,
      })).toEqual(mResult({
        supply: ['mono', 10, 30, 10],
        demand: ['mono', 10, 30, 30],
      }));
    });

    it('binding floor, supply tax', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        unitTaxSupply: 10,
        priceFloor: 30,
      })).toEqual(mResult({
        supply: ['mono', 10, 30, 20],
        demand: ['mono', 10, 30, 30],
      }));
    });

    it('binding floor, demand tax', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        unitTaxDemand: 5,
        priceFloor: 30,
      })).toEqual(mResult({
        supply: ['mono', 5, 30, 5],
        demand: ['mono', 5, 30, 30],
      }));
    });
  });

  describe('ceiling', () => {
    it('nonbinding ceiling', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        priceCeiling: 30,
      })).toEqual(mResult({
        supply: ['mono', 20, 20, 20],
        demand: ['mono', 20, 20, 20],
      }));
    });

    it('binding ceiling', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        priceCeiling: 10,
      })).toEqual(mResult({
        supply: ['mono', 10, 10, 10],
        demand: ['mono', 10, 10, 30],
      }));
    });

    it('binding ceiling, demand tax', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        priceCeiling: 10,
        unitTaxDemand: 10,
      })).toEqual(mResult({
        supply: ['mono', 10, 10, 10],
        demand: ['mono', 10, 10, 20],
      }));
    });

    it('binding ceiling, supply tax', () => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        priceCeiling: 10,
        unitTaxSupply: 5,
      })).toEqual(mResult({
        supply: ['mono', 5, 10, 10],
        demand: ['mono', 5, 10, 35],
      }));
    });
  });

  describe('exporting', () => {
    it.each([undefined, 10])('exporting, priceFloor = %d', (priceFloor) => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        worldPrice: 30,
        priceFloor,
      })).toEqual(mResult({
        supply: ['mono', 30, 30, 30],
        demand: ['mono', 10, 30, 30],
      }));
    });

    it('exporting, binding floor, no imports', () => {
       expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        worldPrice: 20,
        priceFloor: 30,
        importing: false,
        exporting: true,
      })).toEqual(mResult({
        supply: ['dual', [10, 30, 30],  [20, 20, 20]],
        demand: ['mono', 10, 30, 30],
      }));
    });
  });

  describe('importing', () => {
    it.each([undefined, 30])('importing, priceCeiling = %d', (priceCeiling) => {
      expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        worldPrice: 10,
        priceCeiling,
      })).toEqual(mResult({
        supply: ['mono', 10, 10, 10],
        demand: ['mono', 30, 10, 10],
      }));
    });

    it('importing, binding ceiling, no exports', () => {
       expect(status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        worldPrice: 20,
        priceCeiling: 10,
        importing: true,
        exporting: false,
      })).toEqual(mResult({
        supply: ['mono', 10, 10, 10],
        demand: ['dual', [10, 10, 10],  [20, 20, 20]],
      }));
    });
  });

  describe.skip('quota', () => {
    it('simple quota of 1 unit', () => {
      const model = status({
        supply: { kind: 'continious', dir: 1, m: 1, i: 0 },
        demand: { kind: 'continious', dir: -1, m: -1, i: 40 },
        worldPrice: 10,
        exporting: false,
        importing: false,
        unitQuotaLicensed: 1,
      });

      expect(model.demand.alloc).toEqual(allocShortHand(['mono', 21, 19, 19]));
      expect(model.supply.alloc).toEqual(allocShortHand(['mono', 19, 19, 19]));
    });
  });
});


