import { VectorOf as Vec, RenderContextInit } from '../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '../../prelude.js';

export type RenderContext = RenderContextInit & {
  readonly text: TextRenderer,
  readonly grid: Grid,
  readonly poly: PolygonRenderer,
  readonly line: LineRenderer,
};

export type Event =
  | { kind: 'config', config: Config };

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

export namespace ShortRun {
  export type IsCurve = {
    aggregateConsumption: number;
    aggregateGovtSpend: number;
    aggregateImporting: number;
    aggregateExporting: number,
    investment: {
      aggregate: number;
      rateSensitivity: number;
    };
  };
}

export type Config = {
  longRun: LongRun.T,
  realInterest: number,
  isCurve: ShortRun.IsCurve,
};

export type State = {
  isCurveChart?: Rendering.Equilibrium2d,
};

export namespace Rendering {
  export type Equilibrium2d = {
    bounds: Vec<'r', 2>,
    points: readonly Vec<'r', 2>[],
    tick: Vec<'r', 2> | number,
    eq: Vec<'r', 2>,
  };
  export type Basic2d = {
    bounds: Vec<'r', 2>,
    points: readonly Vec<'r', 2>[],
    tick: Vec<'r', 2> | number,
  };
}

