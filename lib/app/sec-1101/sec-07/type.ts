import { Vec2, RenderContextInit, Econ } from '../../prelude-type.js';
import {
  econFirm,
  TextRenderer,
  Grid,
  PointRenderer,
  PolygonRenderer,
  LineRenderer,
} from '../../prelude.js';

export type RenderContext = RenderContextInit & {
  text: TextRenderer,
  grid: Grid,
  line: LineRenderer,
  poly: PolygonRenderer,
  point: PointRenderer,
};

export type RateOfChangeCfg =
  | { kind: 'scalar', value: number }
  | { kind: 'marginal', value: number[] };

export type Config = {
  readonly exampleA: {
    readonly fixedCost: number;
    readonly perworkerCost: RateOfChangeCfg;
    readonly perworkerQuantity: RateOfChangeCfg;
    readonly price: [number, number];
    readonly maxWorkers: number;
  };
  readonly demand: {
    readonly demandSchedule: number[];
  };
  readonly exampleB: {
    readonly supply: [number, number];
    readonly demand: [number, number];
  };
};

export type TablePlots = ReturnType<typeof econFirm.tablePlots>;

export type State = {
  readonly exampleA?: Econ.Firm.BehaviourTable;
  readonly exampleB?: {
    readonly marginalCost: Econ.Curve.Continious;
    readonly marginalRevenue: Econ.Curve.Continious;
    readonly demand: Econ.Curve.Continious;
    readonly bounds: Vec2;
    readonly socialEq: Vec2;
    readonly profitEq: Vec2;
    readonly lines: {
      readonly demand: [Vec2, Vec2];
      readonly supply: [Vec2, Vec2];
      readonly revenue: [Vec2, Vec2];
    };
    readonly deadWeightLoss: Econ.Model.Geom.Space;
  };
};

export type Event =
  | { kind: 'config', config: Config }
