import { VectorOf as Vec, RenderContextInit } from '@app/prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';
import {
  Rendering,
  LongRun,
  ShortRun,
  NationalAccounting,
} from '../common/type.ts';

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

