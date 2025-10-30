import { VectorOf as Vec, RenderContextInit } from '@app/prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';
import { Rendering } from '../common/type.ts';

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

export type Event =
  | { kind: 'config', config: Config };

export type Config = {
  longRun: LongRun.T,
  realInterest: number,
  isCurve: ShortRun.IsCurve,
};

export type State = {
  isCurveChart?: Rendering.Equilibrium2d,
};

