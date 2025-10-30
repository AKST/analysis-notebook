import { RenderContextInit, Econ, MakeConfigKnobs, Vec2 } from '@app/prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';

export type Config = {
  readonly marginalCost: number;
  readonly consumers: Record<string, [number, number]>;
};

export type RenderContext = RenderContextInit & {
  readonly text: TextRenderer,
  readonly grid: Grid,
  readonly poly: PolygonRenderer,
  readonly line: LineRenderer,
};

export type Behaviour = {
  readonly behaviour: 'contribute' | 'freeRide';
  readonly curve: Econ.Curve.Continious;
  readonly lindahlPrice: number;
  readonly surplus: {
    readonly contribute: Econ.Model.Geom.Space;
    readonly freeRide: Econ.Model.Geom.Space;
  };
};

export type State = {
  readonly bounds: Vec2;
  readonly aggregateDemand?: Econ.Curve.Continious;
  readonly marginalCost: number;
  readonly consumers: Record<string, Behaviour>;
  readonly produced: {
    contribute: number;
    freeRide: number;
  };
};

export type Event =
  | { kind: 'config', config: Config }
