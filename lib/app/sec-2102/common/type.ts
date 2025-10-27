import { VectorOf as Vec, RenderContextInit } from '../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '../../prelude.js';


export namespace Rendering {
  export type ChartContext = RenderContextInit & {
    readonly text: TextRenderer,
    readonly grid: Grid,
    readonly poly: PolygonRenderer,
    readonly line: LineRenderer,
  };

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
