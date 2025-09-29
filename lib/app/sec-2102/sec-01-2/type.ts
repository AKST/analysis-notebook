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

export type Config = {
  exogenous: {
    alpha: number,
    labour: number;
    technology: number;
    capitalInit: number,
    investmentFactor: number,
    depreciationRate: number,
  },
  dynamics: {
    periodMs: number,
    discrete: boolean,
  },
};


export type State = {
  capitalDynamics: {
    state: number,
    steadyState: number,
    start: {
      time: number,
      capital: number,
    },
    chart: {
      period: number,
      trajectory: Vec<'r', 2>[],
      translate: Vec<'r', 2>,
      bounds: Vec<'r', 2>,
    },
  },
};

