import { VectorOf as Vec, RenderContextInit } from '../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '../../prelude.js';
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
};

export namespace ShortRun {
  export type IsCurve = {
    aggregateConsumption: number;
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

