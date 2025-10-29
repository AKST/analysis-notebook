import { vis2dModel } from '../prelude.js';
import {
  Vec2,
  RenderContextInit,
  MakeConfigKnobs,
  Econ,
} from '../../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PointRenderer,
  LineRenderer,
  PolygonRenderer,
} from '../../../prelude.js';

export type RenderContext = RenderContextInit & {
  model: vis2dModel.ModelRenderer,
}

type TransferKind = {
  readonly unit: number;
};

type MarketVariant<V> = {
  readonly demand: V;
  readonly supply: V;
};

export type Config = {
  readonly market: MarketVariant<[number, number]>;
  readonly externality: MarketVariant<number>;
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
    readonly licenseeQuota: number;
  },
};

export type Knobs = MakeConfigKnobs<Config>;

export type State = {
  readonly model: Econ.Model.Desc.T | undefined;
  readonly modelFreeLocal: Econ.Model.Desc.T | undefined;
  readonly modelFreeWorld: Econ.Model.Desc.T | undefined;
  readonly input: Econ.Model.Config.T | undefined;
  readonly bounds: Vec2;
};

export type Event =
  | { kind: 'config', config: Config }
