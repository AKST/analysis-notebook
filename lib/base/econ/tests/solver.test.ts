import { assert, expect, describe, it } from 'vitest';
import { vector } from '../../math/value.js';
import type { CurveParams, ModelState } from '../type.ts';
import { equilibriumWithWedge, solve } from '../solver.js';


describe('equilibriumWithWedge', () => {
  const demand = { kind: 'demand', i: 100, m: -2 } as const;
  const supply = { kind: 'supply', i: 10, m: 1 } as const;

  const taxOf = (n: number) => ({
    tax: {
      demand: { unit: n },
      supply: { unit: 0 },
    },
    subsidy: {
      demand: { unit: 0 },
      supply: { unit: 0 },
    },
    tariff: {
      import: { unit: 0 },
    },
  } as const);

  const subsidyOf = (n: number) => ({
    tax: {
      demand: { unit: 0 },
      supply: { unit: 0 },
    },
    subsidy: {
      demand: { unit: n },
      supply: { unit: 0 },
    },
    tariff: {
      import: { unit: 0 },
    },
  } as const);

  it('calculates equilibrium without wedge', () => {
    expect(equilibriumWithWedge({
      world: { price: 0 },
      market: { demand, supply },
      policy: {
        permit: { importing: false, exporting: false },
        anchor: { price: {} },
        transfer: taxOf(0),
      },
    })).toEqual(
      expect.objectContaining({ sp: 40, dp: 40 }),
    );
  });

  it('calculates equilibrium with positive wedge (tax)', () => {
    expect(equilibriumWithWedge({
      world: { price: 0 },
      market: { demand, supply },
      policy: {
        permit: { importing: false, exporting: false },
        anchor: { price: {} },
        transfer: taxOf(15),
      },
    })).toEqual(
      expect.objectContaining({ sp: 35, dp: 50 }),
    );
  });

  it('calculates equilibrium with negative wedge (subsidy)', () => {
    expect(equilibriumWithWedge({
      world: { price: 0 },
      market: { demand, supply },
      policy: {
        permit: { importing: false, exporting: false },
        anchor: { price: {} },
        transfer: subsidyOf(9),
      },
    })).toEqual(
      expect.objectContaining({ sp: 43, dp: 34 }),
    );
  });

  it('returns no-market when slopes are equal (parallel curves)', () => {
    expect(equilibriumWithWedge({
      world: { price: 0 },
      market: { demand, supply: { kind: 'supply', i: 20, m: -2 } },
      policy: {
        permit: { importing: false, exporting: false },
        anchor: { price: {} },
        transfer: taxOf(5),
      },
    })).toEqual(undefined);
  });

  it('handles elastic demand curve', () => {
    const n25 = expect.closeTo(25);
    expect(equilibriumWithWedge({
      world: { price: 0 },
      market: {
        demand: { kind: 'demand', i: 40, m: -0.5 },
        supply: { kind: 'supply', i: 0, m: 1 },
      },
      policy: {
        permit: { importing: false, exporting: false },
        anchor: { price: {} },
        transfer: taxOf(7),
      },
    })).toEqual(
      expect.objectContaining({
        sp: expect.closeTo(22, 2),
        dp: expect.closeTo(29, 2),
      }),
    );
  });

  it('handles elasitic supply curve', () => {
    expect(equilibriumWithWedge({
      world: { price: 0 },
      market: {
        demand: { kind: 'demand', i: 40, m: -1 },
        supply: { kind: 'supply', i: 0, m: 0.5 },
      },
      policy: {
        permit: { importing: false, exporting: false },
        anchor: { price: {} },
        transfer: taxOf(7),
      },
    })).toEqual(
      expect.objectContaining({
        sp: expect.closeTo(11, 1),
        dp: expect.closeTo(18, 1),
      }),
    );
  });
});

describe('solve', () => {
  const supplyDefault = { kind: 'supply', i: 0, m: 1 } as const;
  const demandDefault = { kind: 'demand', i: 40, m: -1 } as const;
  const createModel = ({
    supply = supplyDefault,
    demand = demandDefault,
    worldPrice,
    importing,
    exporting,
    unitTaxDemand = 0,
    unitTaxSupply = 0,
    unitSubDemand = 0,
    unitSubSupply = 0,
    unitTariffImport = 0,
    priceFloor,
    priceCeiling,
  }: {
    supply?: Extract<CurveParams, { kind: 'supply' }>,
    demand?: Extract<CurveParams, { kind: 'demand' }>,
    worldPrice?: number,
    importing?: boolean,
    exporting?: boolean,
    unitTaxDemand?: number,
    unitTaxSupply?: number,
    unitSubDemand?: number,
    unitSubSupply?: number,
    unitTariffImport?: number,
    priceFloor?: number,
    priceCeiling?: number,
  } = {}): ModelState => ({
    world: { price: worldPrice ?? 0 },
    market: { supply, demand },
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
          import: { unit: unitTariffImport },
        },
      },
    },
  });

  const mResult = ({
    reserve,
    quantity: q,
    effective,
  }: {
    reserve: { d: number, s: number },
    quantity: { d: number, s: number } | number,
    effective?: { d: number, s: number } | number,
  }) => {
    const demandQ = typeof q === 'object' && q.d != null ? q.d : q;
    const supplyQ = typeof q === 'object' && q.s != null ? q.s : q;
    const demand = { quantity: demandQ, reservePrice: reserve.d };
    const supply = { quantity: supplyQ, reservePrice: reserve.s };
    if (effective == null) return {
      demand: expect.objectContaining(demand),
      supply: expect.objectContaining(supply),
    } as const;

    const p = effective;
    const demandEp = typeof p === 'object' && p.d != null ? p.d : p;
    const supplyEp = typeof p === 'object' && p.s != null ? p.s : p;

    return {
      demand: { ...demand, effectivePrice: demandEp },
      supply: { ...supply, effectivePrice: supplyEp },
    } as const;
  };

  it('equilbrium', () => {
    expect(solve(createModel())).toEqual(mResult({
      reserve: { d: 20, s :20 },
      quantity: 20,
      effective: 20,
    }));
  });

  it('world prive above local equilbrium', () => {
    expect(solve(createModel({
      worldPrice: 22,
    }))).toEqual(mResult({
      reserve: { d: 22, s: 22 },
      quantity: { d: 18, s: 22 },
      effective: 22,
    }));
  });

  it('world prive below local equilbrium', () => {
    expect(solve(createModel({
      worldPrice: 18,
    }))).toEqual(mResult({
      reserve: { d: 18, s: 18 },
      quantity: { d: 22, s: 18 },
      effective: 18
    }));
  });

  describe('equilbrium with supply intercept', () => {
    it('local', () => {
      const supply = { kind: 'supply', i: 20, m: 1 } as const;
      expect(solve(createModel({ supply }))).toEqual(
        mResult({
          reserve: { d: 30, s: 30 },
          quantity: 10,
          effective: 30
        })
      );
    });

    it('world price above local price', () => {
      expect(solve(createModel({
        supply: { kind: 'supply', i: 20, m: 1 },
        worldPrice: 32,
      }))).toEqual(
        mResult({
          reserve: { d: 32, s: 32 },
          quantity: { d: 8, s: 12 },
          effective: 32
        })
      );
    });

    it('world price below local price', () => {
      expect(solve(createModel({
        supply: { kind: 'supply', i: 20, m: 1 },
        worldPrice: 28,
      }))).toEqual(mResult({
        reserve: { d: 28, s: 28 },
        quantity: { d: 12, s: 8 },
        effective: 28
      }));
    });
  });

  describe('equilbrium varying elasiticity', () => {
    it('inelasitic supply', () => {
      const supply = { kind: 'supply', i: 0, m: 3 } as const;
      expect(solve(createModel({ supply }))).toEqual(
        mResult({
          reserve: { d: 30, s: 30 },
          quantity: 10,
          effective: 30
        }),
      );
    });

    it('inelasitic demand', () => {
      const demand = { kind: 'demand', i: 40, m: -3 } as const;
      expect(solve(createModel({ demand }))).toEqual(
        mResult({
          reserve: { d: 10, s: 10 },
          quantity: 10,
          effective: 10
        }),
      );
    });

    it('elasitic supply', () => {
      const supply = { kind: 'supply', i: 0, m: 0.6 } as const;
      const n25 = expect.closeTo(25);
      const n15 = expect.closeTo(15);
      expect(solve(createModel({ supply }))).toEqual(
        mResult({
          reserve: { d: n15, s: n15 },
          quantity: n25,
          effective: n15
        }),
      );
    });

    it('elasitic demand', () => {
      const demand = { kind: 'demand', i: 40, m: -0.6 } as const;
      const n25 = expect.closeTo(25);
      expect(solve(createModel({ demand }))).toEqual(
        mResult({
          reserve: { d: n25, s: n25 },
          quantity: n25,
          effective: n25
        })
      );
    });
  });

  describe('basic transfers', () => {
    it('10 tax as unitTaxSupply', () => {
      expect(solve(createModel({
        unitTaxSupply: 10,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('10 tax as unitTaxDemand', () => {
      expect(solve(createModel({
        unitTaxDemand: 10,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('10 subsidy as unitSubSupply', () => {
      expect(solve(createModel({
        unitSubSupply: 10,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it('10 subsidy as unitSubDemand', () => {
      expect(solve(createModel({
        unitSubDemand: 10,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it.each([
      { kind: 'unitTaxSupply', size: 10 } as const,
      { kind: 'unitTaxDemand', size: 10 } as const,
    ])('$size tax on $kind, when theres an supply intercept', ({ kind, size }) => {
      expect(solve(createModel({
        supply: { kind: 'supply', i: 5, m: 1 },
        demand: { kind: 'demand', i: 45, m: -1 },
        [kind]: size,
      }))).toEqual(mResult({
        reserve: { d: 30, s: 20 },
        quantity: 15,
        effective: { d: 30, s: 20 },
      }));
    });

    it.each([
      { kind: 'unitSubSupply', size: 10 } as const,
      { kind: 'unitSubDemand', size: 10 } as const,
    ])('$size subsidy on $kind, when theres an supply intercept', ({ kind, size }) => {
      expect(solve(createModel({
        supply: { kind: 'supply', i: 5, m: 1 },
        demand: { kind: 'demand', i: 45, m: -1 },
        [kind]: size,
      }))).toEqual(mResult({
        reserve: { d: 20, s: 30 },
        quantity: 25,
        effective: { d: 20, s: 30 },
      }));
    });
  });

  describe('price floors (no taxes)', () => {
    it('non-binding floor', () => {
      expect(solve(createModel({
        priceFloor: 15
      }))).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: 20,
        effective: 20
      }));
    });

    it('binding floor', () => {
      // not equilibrium is 20
      expect(solve(createModel({
        priceFloor: 25
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: 25
      }));
    });

    it('binding floor with supply intercept', () => {
      expect(solve(createModel({
        supply: { kind: 'supply', i: 5, m: 1 },
        demand: { kind: 'demand', i: 45, m: -1 },
        priceFloor: 30  // Above new equilibrium of 25
      }))).toEqual(mResult({
        reserve: { d: 30, s: 20 },
        quantity: 15,
        effective: 30,
      }));
    });
  });

  describe('price ceilings (no taxes)', () => {
    it('non-binding ceiling', () => {
      expect(solve(createModel({
        priceCeiling: 25  // Above equilibrium of 20
      }))).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: 20,
        effective: 20,
      }));
    });

    it('binding ceiling', () => {
      expect(solve(createModel({
        priceCeiling: 15  // Below equilibrium of 20
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: 15,
      }));
    });

    it('binding ceiling with supply intercept', () => {
      expect(solve(createModel({
        supply: { kind: 'supply', i: 5, m: 1 },
        demand: { kind: 'demand', i: 45, m: -1 },
        priceCeiling: 15,
      }))).toEqual(mResult({
        reserve: { d: 35, s: 15 },
        quantity: 10,
        effective: 15,
      }));
    });
  });

  describe('price control edge cases', () => {
    it('floor at equilibrium price', () => {
      const result = solve(createModel({ priceFloor: 20 }))
      expect(result).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: 20,
        effective: 20,
      }));
    });

    it('ceiling at equilibrium price', () => {
      const result = solve(createModel({ priceCeiling: 20 }));
      expect(result).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: 20,
        effective: 20,
      }));
    });
  });

  describe('price floors with transfers', () => {
    it('non-binding floor with consumer tax', () => {
      expect(solve(createModel({
        priceFloor: 15,
        unitTaxDemand: 10,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('non-binding floor, producer tax', () => {
      expect(solve(createModel({
        priceFloor: 15,
        unitTaxSupply: 10,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('consumer tax above binding floor', () => {
      expect(solve(createModel({
        priceFloor: 30,
        unitTaxDemand: 5
      }))).toEqual(mResult({
        reserve: { d: 35, s: 5 },
        quantity: 5,
        effective: { d: 35, s: 30 },
      }));
    });

    it('producer tax under binding floor', () => {
      expect(solve(createModel({
        priceFloor: 30,
        unitTaxSupply: 10
      }))).toEqual(mResult({
        reserve: { d: 30, s: 10 },
        quantity: 10,
        effective: { d: 30, s: 20 },
      }));
    });

    it('floor exactly at tax equilibrium supply price', () => {
      expect(solve(createModel({
        priceFloor: 15,
        unitTaxDemand: 10
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('unbound floor until tax', () => {
      expect(solve(createModel({
        priceFloor: 19,
        unitTaxDemand: 3
      }))).toEqual(mResult({
        reserve: { d: 22, s: 18 },
        quantity: 18,
        effective: { d: 22, s: 19 },
      }));
    });

    it('non-binding floor with consumer subsidy', () => {
      expect(solve(createModel({
        priceFloor: 10,
        unitSubDemand: 10,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it('non-binding floor, producer subsidy', () => {
      expect(solve(createModel({
        priceFloor: 10,
        unitSubSupply: 10,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it('consumer subsidy above binding floor', () => {
      expect(solve(createModel({
        priceFloor: 25,
        unitSubDemand: 5,
      }))).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: 20,
        effective: { d: 20, s: 25 },
      }));
    });

    it('producer subsidy under binding floor', () => {
      expect(solve(createModel({
        priceFloor: 25,
        unitSubSupply: 5,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 30 },
      }));
    });

    it('floor exactly at subsidy equilibrium demand price', () => {
      expect(solve(createModel({
        priceFloor: 15,
        unitSubDemand: 10
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it('unbound floor until subsidy', () => {
      expect(solve(createModel({
        priceFloor: 18,
        unitSubSupply: 6
      }))).toEqual(mResult({
        reserve: { d: 18, s: 22 },
        quantity: 22,
        effective: { d: 18, s: 24 },
      }));
    });
  });

  describe('price ceilings with transfers', () => {
    it('non-binding ceiling with consumer tax', () => {
      expect(solve(createModel({
        priceCeiling: 30,
        unitTaxDemand: 10,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('non-binding ceiling, producer tax', () => {
      expect(solve(createModel({
        priceCeiling: 30,
        unitTaxSupply: 10,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('consumer tax above binding ceiling', () => {
      expect(solve(createModel({
        priceCeiling: 10,
        unitTaxDemand: 5,
      }))).toEqual(mResult({
        reserve: { d: 30, s: 10 },
        quantity: 10,
        effective: { d: 15, s: 10 },
      }));
    });

    it('producer tax under binding ceiling', () => {
      expect(solve(createModel({
        priceCeiling: 10,
        unitTaxSupply: 5,
      }))).toEqual(mResult({
        reserve: { d: 35, s: 5 },
        quantity: 5,
        effective: { d: 10, s: 5 },
      }));
    });

    it('ceiling exactly at tax equilibrium demand price', () => {
      expect(solve(createModel({
        priceCeiling: 25,
        unitTaxDemand: 10
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: 15,
        effective: { d: 25, s: 15 },
      }));
    });

    it('unbound ceiling until tax', () => {
      expect(solve(createModel({
        priceCeiling: 21,
        unitTaxSupply: 3
      }))).toEqual(mResult({
        reserve: { d: 22, s: 18 },
        quantity: 18,
        effective: { d: 21, s: 18 },
      }));
    });

    it('non-binding ceiling with consumer subsidy', () => {
      expect(solve(createModel({
        priceCeiling: 30,
        unitSubDemand: 10,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it('non-binding ceiling, producer subsidy', () => {
      expect(solve(createModel({
        priceCeiling: 30,
        unitSubSupply: 10,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it('consumer subsidy above binding ceiling', () => {
      expect(solve(createModel({
        priceCeiling: 12,
        unitSubDemand: 5,
      }))).toEqual(mResult({
        reserve: { d: 28, s: 12 },
        quantity: 12,
        effective: { d: 7, s: 12 },
      }));
    });

    it('producer subsidy under binding ceiling', () => {
      expect(solve(createModel({
        priceCeiling: 12,
        unitSubSupply: 5,
      }))).toEqual(mResult({
        reserve: { d: 23, s: 17 },
        quantity: 17,
        effective: { d: 12, s: 17 },
      }));
    });

    it('ceiling exactly at subsidy equilibrium supply price', () => {
      expect(solve(createModel({
        priceCeiling: 25,
        unitSubDemand: 10
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 15, s: 25 },
      }));
    });

    it('demand subsidy +5 beyond ceiling', () => {
      expect(solve(createModel({
        priceCeiling: 25,
        unitSubDemand: 15
      }))).toEqual(mResult({
        reserve: { d: 15, s: 25 },
        quantity: 25,
        effective: { d: 10, s: 25 },
      }));
    });

    it('unbound ceiling until subsidy', () => {
      expect(solve(createModel({
        priceCeiling: 18,
        unitSubSupply: 6
      }))).toEqual(mResult({
        reserve: { d: 17, s: 23 },
        quantity: 23,
        effective: { d: 17, s: 23 },
      }));
    });
  });

  describe('import tariffs', () => {
    /**
     * When world price is above equilibrium prices, theres
     * no point in applying an import tariff as you are exporting.
     */
    it('import tariff with world price above domestic', () => {
      expect(solve(createModel({
        worldPrice: 25,
        importing: true,
        exporting: true,
        unitTariffImport: 3,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 25 },
        quantity: { d: 15, s: 25 },
        effective: { d: 25, s: 25 },
      }));
    });

    /**
     * However when the import price is below the demostic price
     * of course it now applies.
     */
    it('import tariff with world price below domestic', () => {
      expect(solve(createModel({
        worldPrice: 15,
        unitTariffImport: 3,
      }))).toEqual(mResult({
        reserve: { d: 18, s: 18 },
        quantity: { d: 22, s: 18 },
        effective: 18,
      }));
    });

    it('non-binding import tariff', () => {
      expect(solve(createModel({
        worldPrice: 22,
        unitTariffImport: 1,
      }))).toEqual(mResult({
        reserve: { d: 22, s: 22 },
        quantity: { d: 18, s: 22 },
        effective: 22,
      }));
    });

    it('tariff so big trade is eliminated', () => {
      expect(solve(createModel({
        worldPrice: 15,
        unitTariffImport: 10,
      }))).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: 20,
        effective: 20,
      }));
    });
  });

  describe('world price with price controls', () => {
    /**
     * I actually don't know what this should be
     *
     * I don't think we can actually capture the state in
     * which producers will find themselves in
     */
    it.skip('Price(floor > world > domestic), -importing', () => {
      expect(solve(createModel({
        worldPrice: 25,
        priceFloor: 30,
        importing: false,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 30, s: 25 },
        quantity: { d: 10, s: 25 },
        effective: { d: 30, s: 25 },
      }));
    });

    it('Price(floor > world > domestic), +importing ', () => {
      expect(solve(createModel({
        worldPrice: 25,
        priceFloor: 30,
        importing: true,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 25 },
        quantity: { d: 15, s: 25 },
        effective: { d: 25, s: 25 },
      }));

      expect(solve(createModel({
        worldPrice: 15,
        priceFloor: 30,
        importing: true,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 15 },
        quantity: { d: 25, s: 15 },
        effective: { d: 15, s: 15 },
      }));
    });

    it.each([
      { state: '-importing', importing: false },
      { state: '+importing', importing: true },
    ])('Price(world < floor < domestic) $state', ({ importing }) => {
      expect(solve(createModel({
        worldPrice: 30,
        priceFloor: 25,
        importing,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 30, s: 30 },
        quantity: { d: 10, s: 30 },
        effective: { d: 30, s: 30 },
      }));
    });

    it.each([
      { state: '-importing -exporting', importing: false, exporting: false },
      { state: '+importing -exporting', importing: true, exporting: false },
    ])('Price(world < floor < domestic), $state', ({ importing, exporting }) => {
      expect(solve(createModel({
        worldPrice: 30,
        priceFloor: 25,
        exporting,
        importing,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 15 },
        quantity: { d: 15, s: 15 },
        effective: { d: 25, s: 25 },
      }));
    });

    it.each([
      { state: '-importing -exporting', importing: false, exporting: true },
      { state: '+importing -exporting', importing: true, exporting: true },
    ])('Price(world < floor < domestic), $state', ({ importing, exporting }) => {
      expect(solve(createModel({
        worldPrice: 30,
        priceFloor: 25,
        exporting,
        importing,
      }))).toEqual(mResult({
        reserve: { d: 30, s: 30 },
        quantity: { d: 10, s: 30 },
        effective: { d: 30, s: 30 },
      }));
    });

    it('Price(world > ceiling > domestic) -exporting', () => {
      expect(solve(createModel({
        worldPrice: 25,
        priceCeiling: 22,
        importing: true,
        exporting: false,
      }))).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: { d: 20, s: 20 },
        effective: { d: 20, s: 20 },
      }));
    });

    it('Price(world > ceiling > domestic) +exporting', () => {
      expect(solve(createModel({
        worldPrice: 25,
        priceCeiling: 22,
        importing: true,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 25 },
        quantity: { d: 15, s: 25 },
        effective: { d: 25, s: 25 },
      }));
    });

    it('Price(world > domestic > ceiling) -exporting', () => {
      expect(solve(createModel({
        worldPrice: 25,
        priceCeiling: 18,
        importing: true,
        exporting: false,
      }))).toEqual(mResult({
        reserve: { d: 22, s: 18 },
        quantity: 18,
        effective: 18,
      }));
    });

    it('Price(world > domestic > ceiling) +exporting', () => {
      expect(solve(createModel({
        worldPrice: 25,
        priceCeiling: 18,
        importing: true,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 25 },
        quantity: { d: 15, s: 25 },
        effective: 25,
      }));
    });

    it('Price(domestic > world > floor) -importing', () => {
      expect(solve(createModel({
        worldPrice: 15,
        priceFloor: 18,
        importing: false,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 20, s: 20 },
        quantity: { d: 20, s: 20 },
        effective: { d: 20, s: 20 },
      }));
    });

    it('Price(domestic > world > floor) +importing', () => {
      expect(solve(createModel({
        worldPrice: 15,
        priceFloor: 18,
        importing: true,
        exporting: true,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 15 },
        quantity: { d: 25, s: 15 },
        effective: { d: 15, s: 15 },
      }));
    });

    /**
     * Possibly unsolvable, without extenting the solvers output range.
     */
    it.skip('Price(domestic > world > ceiling) -exporting', () => {
      expect(solve(createModel({
        worldPrice: 15,
        priceCeiling: 12,
        exporting: false,
        importing: true,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 0 },
        quantity: { d: 25, s: 0 },
        effective: { d: 25, s: 0 },
      }));
    });

    /**
     * No units should be sold locally given the price ceiling,
     * given an option to sell on the world market.
     */
    it('Price(domestic > world > ceiling) +exporting', () => {
      expect(solve(createModel({
        worldPrice: 15,
        priceCeiling: 12,
        exporting: true,
        importing: true,
      }))).toEqual(mResult({
        reserve: { d: 15, s: 15 },
        quantity: { d: 25, s: 15 },
        effective: { d: 15, s: 15 },
      }));
    });
  });

  describe('world price with transfers', () => {
    it('consumer tax', () => {
      expect(solve(createModel({
        worldPrice: 25,
        unitTaxDemand: 5,
      }))).toEqual(mResult({
        reserve: { d: 30, s: 25 },
        quantity: { d: 10, s: 25 },
      }));
    });

    describe("producer Subsidy", () => {
      it('WP=25, Subsidy=3', () => {
        expect(solve(createModel({
          worldPrice: 25,
          unitSubSupply: 3,
        }))).toEqual(mResult({
          reserve: { d: 25, s: 28 },
          quantity: { d: 15, s: 28 },
          effective: { d: 25, s: 28 },
        }));
      });

      /**
       * Producers won't pass on the subsidy if its
       * an open market.
       */
      it.skip('WP=*P, S=3', () => {
        expect(solve(createModel({
          worldPrice: 20,
          unitSubSupply: 4,
        }))).toEqual(mResult({
          reserve: { d: 20, s: 24 },
          quantity: { d: 20, s: 24 },
          effective: { d: 20, s: 24 },
        }));
      });
    });

    it.skip('consumer tax, producer subsidy', () => {
      expect(solve(createModel({
        worldPrice: 20,
        unitTaxDemand: 2,
        unitSubSupply: 4,
      }))).toEqual(mResult({
        reserve: { d: 22, s: 24 },
        quantity: { d: 18, s: 24 },
      }));
    });
  });

  describe.skip('world price with tariffs and floors', () => {
    it.skip('import tariff with binding floor', () => {
      expect(solve(createModel({
        worldPrice: 18,
        unitTariffImport: 1,
        priceFloor: 25,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 18 },
        quantity: { d: 15, s: 18 },
      }));
    });

    it('import tariff with non-binding floor', () => {
      expect(solve(createModel({
        worldPrice: 25,
        unitTariffImport: 3,
        priceFloor: 15,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 25 },
        quantity: { d: 15, s: 25 },
      }));
    });

    it('tariff eliminates trade with floor', () => {
      expect(solve(createModel({
        worldPrice: 15,
        unitTariffImport: 8,
        priceFloor: 22,
      }))).toEqual(mResult({
        reserve: { d: 22, s: 18 },
        quantity: 18,
      }));
    });
  });

  describe.skip('world price with tariffs and transfers', () => {
    it('import tariff with consumer tax', () => {
      expect(solve(createModel({
        worldPrice: 20,
        unitTariffImport: 3,
        unitTaxDemand: 2,
      }))).toEqual(mResult({
        reserve: { d: 25, s: 20 },
        quantity: { d: 15, s: 20 },
      }));
    });

    it('import tariff with producer subsidy', () => {
      expect(solve(createModel({
        worldPrice: 22,
        unitTariffImport: 2,
        unitSubSupply: 3,
      }))).toEqual(mResult({
        reserve: { d: 24, s: 25 },
        quantity: { d: 16, s: 22 },
      }));
    });

    it('complex policy mix', () => {
      expect(solve(createModel({
        worldPrice: 18,
        unitTariffImport: 3,
        unitTaxDemand: 1,
        unitSubSupply: 2,
      }))).toEqual(mResult({
        reserve: { d: 22, s: 20 },
        quantity: { d: 18, s: 18 },
      }));
    });
  });
});
