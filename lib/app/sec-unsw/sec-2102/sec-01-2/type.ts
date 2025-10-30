import { VectorOf as Vec, RenderContextInit } from '@app/prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';

export type RenderContext = RenderContextInit & {
  readonly text: TextRenderer,
  readonly grid: Grid,
  readonly poly: PolygonRenderer,
  readonly line: LineRenderer,
};

export type Event =
  | { kind: 'init', config: Config }
  | { kind: 'config', config: Config, source: string[] };

export type ExogenousVariables = {
  alpha: number,
  labour: number;
  technology: number;
  capitalInit: number,
  investmentFactor: number,
  depreciationRate: number,
};

export type Model = {
  inputs: ExogenousVariables,
  steadyState: number,
  capitalZero: number,
};

export type TrajectoryMap = {
  capital: Vec<'r', 2>[],
  output: Vec<'r', 2>[],
};

export type RenderedTrajectoryMap = TrajectoryMap & {
  outputByK: Vec<'r', 2>[],
};

export type CameraTransform = {
  translate: Vec<'r', 2>,
  bounds: Vec<'r', 2>,
  dest: Vec<'r', 2>,
};

export type CameraMap = {
  capital: CameraTransform,
  output: CameraTransform,
  allAgg: CameraTransform,
};

export type State = {
  solowSwan: {
    trajectory: TrajectoryMap,
    model: Model,
    time: { branch: number, start: number, period: number },
    chart: {
      camera: CameraMap,
      prerenderedTrajectory: {
        current: RenderedTrajectoryMap,
        initial: RenderedTrajectoryMap | undefined,
      }
    },
  },
};

export type Config = {
  exogenous: ExogenousVariables,
  dynamics: {
    periodMs: number,
  },
};

