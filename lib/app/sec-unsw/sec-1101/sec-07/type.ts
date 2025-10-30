import { Vec2, RenderContextInit, Econ } from '@app/prelude-type.js';
import {
  econFirm,
  TextRenderer,
  Grid,
  PointRenderer,
  PolygonRenderer,
  LineRenderer,
} from '@app/prelude.js';

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

export type PriceSchedule =
  | { kind: 'curve', value: { curve: [number, number] } }
  | { kind: 'schedule', value: { prices: number[] } };

export type Config = {
  readonly exampleA: {
    readonly fixedCost: number;
    readonly perworkerCost: RateOfChangeCfg;
    readonly perworkerQuantity: RateOfChangeCfg;
    readonly price: PriceSchedule;
    readonly maxWorkers: number;
  };
  readonly exampleB: {
    readonly supply: [number, number];
    readonly demand: [number, number];
    readonly fixedCost: number;
  };
  readonly exampleC: {
    readonly perworkerCost: RateOfChangeCfg;
    readonly perworkerQuantity: number;
    readonly marketSegments: Record<string, PriceSchedule>;
  };
};

export type TablePlots = ReturnType<typeof econFirm.tablePlots>;

export type MarketSurplusSummary = {
  readonly demand: Econ.Model.Geom.Space;
  readonly supply: Econ.Model.Geom.Space;
  readonly dwl: Econ.Model.Geom.Space;
};

export type State = {
  readonly exampleA?: Econ.Firm.BehaviourTable;
  readonly exampleB?: {
    readonly fixedCost: number;
    readonly marginalCost: Econ.Curve.Continious;
    readonly marginalRevenue: Econ.Curve.Continious;
    readonly demand: Econ.Curve.Continious;
    readonly bounds: Vec2;
    readonly eq: {
      readonly social: Vec2;
      readonly profit: Vec2;
      readonly atc: Vec2;
    };
    readonly lines: {
      readonly demand: [Vec2, Vec2];
      readonly supply: [Vec2, Vec2];
      readonly atc: readonly Vec2[];
      readonly revenue: [Vec2, Vec2];
    };
    readonly surpluses: {
      readonly marginalRevenuePrice: MarketSurplusSummary;
      readonly averageCostPrice: MarketSurplusSummary;
      readonly marginalCost: MarketSurplusSummary;
    };
  };
  readonly exampleC?: {
    readonly markets: Record<string, Econ.Firm.BehaviourTable>;
  };
};

export type Event =
  | { kind: 'config', config: Config }
