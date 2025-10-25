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

export type CobbDouglas = { labour: number, capital: number, ftp: number, alpha: number };

export type Config = {
  mpk: (
    | { kind: 'exogenous', value: number }
    | { kind: 'cobbDouglas', value: CobbDouglas }
  ),
  realInterest: number,
  isCurve: {
    aggregateConsumption: number;
    aggregateGovtSpend: number;
    aggregateImporting: number;
    aggregateExporting: number,
    investment: {
      aggregate: number;
      rateSensitivity: number;
    };
  },
};


export type State = {
};

