import { VectorOf } from '../math/type.ts';

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

export namespace Firm {
  export type MarginalBehaviour = {
    readonly costVar: number,
    readonly costTotal: number,
    readonly units: number,
    readonly price: number,
    readonly workers: number,
    readonly revenue: number,
    readonly profit: number,
    readonly avgCostVar: number,
    readonly avgCostTotal: number,
    readonly marginalCost: number,
    readonly marginalBenefit: number,
    readonly marginalRevenue: number,
  };

  export type BehaviourTable = {
    readonly costVar: readonly number[],
    readonly costTotal: readonly number[],
    readonly units: readonly number[],
    readonly price: readonly number[],
    readonly workers: readonly number[],
    readonly revenue: readonly number[],
    readonly profit: readonly number[],
    readonly avgCostVar: readonly number[],
    readonly avgCostTotal: readonly number[],
    readonly marginalCost: readonly number[],
    readonly marginalBenefit: readonly number[],
    readonly marginalRevenue: readonly number[],
  };
}

export namespace Model {
  export type Classification =
    | { kind: 'autarky', bind: undefined | 'ceiling' | 'floor' }
    | { kind: 'exporting', demand: 'floor' | 'world' }
    | { kind: 'importing:world', supply: 'ceiling' | 'world' }

    /**
     * - When consumer importing is permitted the quota is irrelevant.
     *
     * - If permitted quantity is equal or greater to the number of
     *   units that would be imported at the world price, then we
     *   collapse into the `importing:world` case.
     */
    | { kind: 'importing:quota', supply: 'ceiling' | 'quota' };

  export namespace Config {
    export type QuotaPolicy = { unit: number };
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
        quota: {
          /**
           * Private License holders for quotas
           */
          licensed: QuotaPolicy,
        },
        permit: {
          /**
           * When `true`, the consumers will ignore:
           *
           * - licensed importers
           * - demostic producers if selling at a price floor
           */
          importing: boolean,
          exporting: boolean,
        },
        anchor: {
          price: {
            floor?: number,
            ceiling?: number,
          },
        },
      },
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

    export type PriorityImporterStatus = {
      size: number,
      cost: number,
      rent: Geom.Space,
      binding: boolean,
    };

    export type WorldStatus = {
      price: number,
      export: { price: number, binding: boolean },
      import: {
        price: number,
        binding: boolean,
        quota: {
          licensed: PriorityImporterStatus,
        },
      },
    };

    export type T = {
      supply: CurveDescription;
      demand: CurveDescription;
      world: WorldStatus;
      bounds: VectorOf<'r', 2>;
    };
  }
}

