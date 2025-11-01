import { Vec2, VectorOf as Vec, RenderContextInit } from '@app/prelude-type.ts';
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
  dynamics: {
    msPerPeriod: number,
  },
  longRun: LongRun.T,
  isCurve: ShortRun.IsCurve,
  mpCurve: {
    realInterest: Record<string, number>,
  },
  inflationShock: {
    size: number,
    decay: number,
  },
};

export type State = {
  isCurveChart?: {
    bounds: Vec2,
    ticks: Vec2[],
    isCurve: Vec2[],
    mpCurves: Vec2[],
  },
};

