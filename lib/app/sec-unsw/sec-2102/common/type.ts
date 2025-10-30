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
    bounds: Vec<'r', 2>,
    points: readonly Vec<'r', 2>[],
  };

  export type Equilibrium2d = Basic2d & {
    eq: Vec<'r', 2>,
    ticks: Vec<'r', 2>[],
  };
}
