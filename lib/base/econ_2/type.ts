import { VectorOf } from '../math/type.ts';

export type Partipant = 'supply' | 'demand';

export type DiscreteRateOfChange =
  | { kind: 'const', const: number }
  | { kind: 'curve', curve: { m: number, i: number } }
  | { kind: 'scalar', scalar: number }
  | { kind: 'marginal', rate: readonly number[] }
  | { kind: 'cumulative', total: readonly number[] };

/**
 * The Curve namespace contains data to construct a
 */
export namespace Curve {
  /**
   * A direction to some extent can be inferred from the
   * multiplier (unless the line is flat), but explictly
   * specifying this helps generalise a few things.
   */
  export type Direction = -1 | 1;

  export type Discrete =
    { kind: 'discrete', rate: readonly number[], dir: Direction };

  export type Continious =
    { kind: 'continious', m: number, i: number, dir: Direction }

  /**
   * We have a specify type for shifted to simplify vertically
   * shifting each curve. If we stored it in the curve, shifting
   * would be more expensive, and we want painlessly swap up the
   * shift as we learn more about the nature of the market we are
   * dealing with.
   *
   * For example in the "solver" before we know this is an
   * autarky or exporting or importing, we deal with
   */
  export type Shifted =
    { kind: 'shifted', unit: number, base: Discrete | Continious }

  export type Base = Discrete | Continious;
  export type T = Discrete | Continious | Shifted;
}

export namespace Model {
  export namespace Config {
    export type PricePolicy = { unit: number };
    export type MarketVariant<V> = { demand: V, supply: V };

    export type T = {
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
  }

  export namespace Geom {
    export type Line = readonly VectorOf<'r', 2> [];
    export type Curve = { line: Line, surplus: Space };
    export type Space = { geom: VectorOf<'r', 2>[], size: number };
  }

  export namespace Desc {
    export type AllocAtom =
      | { quantity: number, reservationPrice: number, effectivePrice: number };

    export type Alloc =
      | { kind: 'mono-alloc', value: AllocAtom }
      | { kind: 'dual-alloc', local: AllocAtom, world: AllocAtom };

    export type MarginalValue = {
      curve: Curve.T;
      line: Model.Geom.Line;
      surplus: Model.Geom.Space;
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
      bounds: VectorOf<'r', 2>;
    };
  }
}

