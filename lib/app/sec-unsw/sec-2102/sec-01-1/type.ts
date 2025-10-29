import { VectorOf as Vec, RenderContextInit } from '../../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '../../../prelude.js';

export type RenderContext = RenderContextInit & {
  readonly text: TextRenderer,
  readonly grid: Grid,
  readonly poly: PolygonRenderer,
  readonly line: LineRenderer,
};

export type Event =
  | { kind: 'config', config: Config };

export type Config = {
  productivity: {
    technology: number,
    capital: number,
    labour: number,
    alpha: number,
  },
};

export type Chart2d = {
  bounds: Vec<'r', 2>,
  points: readonly Vec<'r', 2>[],
  tick: Vec<'r', 2> | number,
};

export type ComparisonChart2d = {
  bounds: Vec<'r', 2>,
  tick: Vec<'r', 2> | number,
  points: Record<string, {
    points: readonly Vec<'r', 2>[],
    colour: number,
  }>,
};

export type EquilibriumChart2d = {
  bounds: Vec<'r', 2>,
  points: readonly Vec<'r', 2>[],
  tick: Vec<'r', 2> | number,
  eq: Vec<'r', 2>,
};

export type State = {
  aggregate: {
    output: number,
    realWage: number,
    realRentOfCapital: number,
  },
  charts: {
    productivityOverLabour?: Chart2d,
    productivityOverCapital?: Chart2d,
    marginalProductOfLabor?: Chart2d,
    marginalProductOfCapital?: Chart2d,
    equilibriumLabour?: EquilibriumChart2d,
    equilibriumCapital?: EquilibriumChart2d,
    usaVsChina?: ComparisonChart2d,
  },
};

