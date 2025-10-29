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
};

export type State = {
};

