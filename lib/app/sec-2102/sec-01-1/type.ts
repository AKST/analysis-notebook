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

export type Config = {
  productivity: {
    capital: number,
    labour: number,
    alpha: number,
  },
};

export type Chart2d = {
  bounds: Vec<'r', 2>,
  points: readonly Vec<'r', 2>[]
};

export type State = {
  charts: {
    productivityOverLabour?: Chart2d,
    productivityOverCapital?: Chart2d,
    productivityOverTechnology?: Chart2d,
  },
};

