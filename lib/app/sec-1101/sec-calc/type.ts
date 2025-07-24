import {
  Vec2,
  RenderContextInit,
  MakeConfigKnobs,
  Econ,
} from '../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PointRenderer,
  LineRenderer,
  PolygonRenderer,
} from '../../prelude.js';
import { ModelRenderer } from '../common/2d/model.js';

export type RenderContext = RenderContextInit & {
  model: ModelRenderer,
}

type TransferKind = {
  readonly unit: number;
};

type MarketVariant<V> = {
  readonly demand: V;
  readonly supply: V;
};

export type Config = {
  readonly market: {
    readonly demand: [number, number];
    readonly supply: [number, number];
  };
  readonly controls: {
    readonly priceFloor?: number;
    readonly priceCeiling?: number;
  },
  readonly transfer: {
    readonly tax: MarketVariant<TransferKind>;
    readonly subsidy: MarketVariant<TransferKind>;
  };
  readonly trade: {
    readonly worldPrice: number;
    readonly tariff: {
      readonly import: TransferKind;
      readonly export: TransferKind;
    };
    readonly permit: {
      readonly exporting: boolean;
      readonly importing: boolean;
    };
  },
};

export type Knobs = MakeConfigKnobs<Config>;

export type State = {
  readonly model: Econ.ModelSnapshot | undefined;
  readonly modelFreeLocal: Econ.ModelSnapshot | undefined;
  readonly modelFreeWorld: Econ.ModelSnapshot | undefined;
  readonly input: Econ.ModelState | undefined;
  readonly bounds: Vec2;
  readonly demand: Econ.CurveParams,
  readonly supply: Econ.CurveParams,
};

export type Event =
  | { kind: 'config', config: Config }
