import { VectorOf } from '../math/type.ts';

export type Partipant = 'supply' | 'demand';

export type DiscreteRateOfChange =
  | { kind: 'const', const: number }
  | { kind: 'curve', curve: { m: number, i: number } }
  | { kind: 'scalar', scalar: number }
  | { kind: 'marginal', rate: readonly number[] }
  | { kind: 'cumulative', total: readonly number[] };

export namespace Curve {
  export type Direction = -1 | 1;

  export type Discrete =
    { kind: 'discrete', rate: readonly number[], dir: Direction };

  export type Continious =
    { kind: 'continious', m: number, i: number, dir: Direction }

  export type Shifted =
    { kind: 'shifted', unit: number, base: Discrete | Continious }

  export type Base = Discrete | Continious;
  export type T = Discrete | Continious | Shifted;
}

export type PricePolicy = { unit: number };
export type MarketVariant<V> = { demand: V, supply: V };

export type ModelState = {
  world: {
    price: number,
  },
  market: MarketVariant<Curve.T>,
  extern: MarketVariant<number | undefined>,
  policy: {
    transfer: {
      tax: MarketVariant<PricePolicy>,
      subsidy: MarketVariant<PricePolicy>,
      tariff: {
        import: PricePolicy,
        export: PricePolicy,
      }
    },
    permit: {
      importing: boolean,
      exporting: boolean,
    },
    anchor: {
      price: {
        floor?: number,
        ceiling?: number,
      },
    },
  }
};

export namespace ModelGeom {
  export type Line = readonly VectorOf<'r', 2> [];
  export type Curve = { line: Line, surplus: Space };
  export type Space = { geom: VectorOf<'r', 2>[], size: number };
}

export namespace ModelOut {
  export type AllocAtom =
    | { quantity: number, reservationPrice: number, effectivePrice: number };

  export type Alloc =
    | { kind: 'mono-alloc', value: AllocAtom }
    | { kind: 'dual-alloc', local: AllocAtom, world: AllocAtom };

  export type MarginalValue = {
    curve: Curve.T;
    line: ModelGeom.Line;
    surplus: ModelGeom.Space;
  };

  export type CurveDescription = {
    alloc: Alloc;
    /**
     * Public / Social {Demand,Supply} curve.
     */
    social: MarginalValue;
    /**
     * Private / Market {Demand,Supply} curve.
     */
    market: MarginalValue;
    /**
     * If true that means private and public curves are the same.
     */
    equal: boolean;
  };

  export type WorldStatus = {
    price: number;
    export: { price: number, binding: boolean };
    import: { price: number, binding: boolean };
  };

  export type T = {
    supply: CurveDescription;
    demand: CurveDescription;
    world: WorldStatus;
  };
}

