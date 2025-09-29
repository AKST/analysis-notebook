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
  | { kind: 'init', config: Config }
  | { kind: 'config', config: Config, source: string[] };

export type ExogenousVariables = {
  alpha: number,
  labour: number;
  technology: number;
  capitalInit: number,
  investmentFactor: number,
  depreciationRate: number,
};

export type Config = {
  exogenous: ExogenousVariables,
  dynamics: {
    periodMs: number,
    discrete: boolean,
  },
};


export type State = {
  capitalDynamics: {
    steadyState: number,
    exogenous: ExogenousVariables,
    trajectory: Vec<'r', 2>[],
    start: {
      timeAnimation: number,
      timeTrajectory: number,
      capital: number,
    },
    chart: {
      period: number,
      trajectory: Vec<'r', 2>[],
      trajectoryInit: undefined | Vec<'r', 2>[],
      translate: Vec<'r', 2>,
      bounds: Vec<'r', 2>,
      dst: Vec<'r', 2>,
    },
  },
};

