import { VectorOf } from '../math/type.ts';

export type Partipant = 'supply' | 'demand';

export type CurveParams =
  | { kind: 'supply', m: number, i: number }
  | { kind: 'demand', m: number, i: number };

export type TransferKind =
  | 'tax'
  | 'subsidy';

export type PricePolicy = { unit: number };
export type MarketVariant<V> = { demand: V, supply: V };

export type ModelState = {
  world: {
    price: number,
  },
  market: {
    supply: Extract<CurveParams, { kind: 'supply' }>,
    demand: Extract<CurveParams, { kind: 'demand' }>,
  },
  policy: {
    transfer: {
      tax: MarketVariant<PricePolicy>,
      subsidy: MarketVariant<PricePolicy>,
      tariff: {
        import: PricePolicy,
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

export type CurveStatus = {
  quantity: number,
  reservePrice: number,
  effectivePrice: number,
};
export type ModelStatus = MarketVariant<CurveStatus>

export type Space = { geom: VectorOf<'r', 2>[], size: number };
export type Line = { src: VectorOf<'r', 2>, dst: VectorOf<'r', 2> };
export type Curve = { line: Line, surplus: Space };

export type ModelSnapshot = ModelOutput<'snapshot'>;

export type ModelOutput<K> = {
  consumer: ModelPartipantOutput<K>,
  producer: ModelPartipantOutput<K>,
};

export type ModelPartipantOutput<K> = {
  line: SubShape<K, Line, undefined>,
  alloc: SubShape<K, VectorOf<'r', 2>, VectorOf<'r', 2>>,
  surplus: SubShape<K, Space, number>,
};

type SubShape<Kind, V, Diff = number>
  = Kind extends 'snapshot' ? V
  : Kind extends 'difference' ? Diff extends undefined
      ? never
      : Diff
  : Kind extends 'comparison' ? Diff extends undefined
      ? { before: V, after: V }
      : { before: V, after: V, diff: Diff }
  : never;

