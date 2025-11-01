import { VectorOf as Vec, RenderContextInit } from '@app/prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';

export namespace Rendering {
  export type ChartContext = RenderContextInit & {
    readonly text: TextRenderer,
    readonly grid: Grid,
    readonly poly: PolygonRenderer,
    readonly line: LineRenderer,
  };

  export type Basic2d = {
    gridSize?: Vec<'r', 2>,
    bounds: Vec<'r', 2>,
    points: readonly Vec<'r', 2>[],
  };

  export type Equilibrium2d = Basic2d & {
    eq: Vec<'r', 2>,
    ticks: Vec<'r', 2>[],
  };
}

export namespace LongRun {
  export type T =
    | { kind: 'exogenous', value: Exogenous }
    | { kind: 'endogenous', value: CobbDouglas }

  export type CobbDouglas = {
    labour: number,
    capital: number,
    tfp: number,
    alpha: number,
  };

  export type Exogenous = {
    mpk: number,
    output: number,
  };
}

export namespace NationalAccounting {
  export namespace Components {
    export type Aggregate = { aggregate: number };
    export type Sensitivity = { sensitivity: number };
    export type Multiplier = { multiplier: number };
  }

  export type Agg = Components.Aggregate;
  export type AggWSense = Components.Aggregate & Components.Sensitivity;
  export type AggWMultiplier = Components.Aggregate & Components.Multiplier;

  export type ConsumerVariant = Extract<ExhaustiveVariant, (
    | { kind: 'agg' }
    | { kind: 'agg_mul' }
  )>;

  export type ExhaustiveVariant =
    | { kind: 'agg', value: Agg }
    | { kind: 'agg_mul', value: AggWMultiplier }
    | { kind: 'agg_sen', value: AggWSense }
};

export namespace ShortRun {
  export type IsCurve = {
    consumption: NationalAccounting.ConsumerVariant;
    aggregateGovtSpend: number;
    aggregateImporting: number;
    aggregateExporting: number,
    investment: NationalAccounting.AggWSense;
  };
}
