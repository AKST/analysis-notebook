import { ModelRenderer } from '@prelude-econ/2d-micro/model.js';
import { RenderContextInit } from '@app/prelude-type.ts';
import * as Econ from '@base/econ/micro/type.ts';

export type RenderContext = RenderContextInit & {
  model: ModelRenderer,
}

export type Config = {
  readonly worldPrice: number;
  readonly market: {
    readonly demand: [number, number];
    readonly supply: [number, number];
  };
  readonly policy: {
    readonly tariff: number;
    readonly quota: number;
  };
};

export type State = {
  readonly demand: Econ.Curve.Continious;
  readonly supply: Econ.Curve.Continious;
  readonly examples: {
    readonly exporting?: [Econ.Model.Config.T, Econ.Model.Desc.T];
    readonly importing?: [Econ.Model.Config.T, Econ.Model.Desc.T];
  };
  readonly models: {
    readonly base?: Econ.Model.Desc.T;
    readonly freeTrade?: Econ.Model.Desc.T;
    readonly tariff?: [Econ.Model.Config.T, Econ.Model.Desc.T];
    readonly quota?: [Econ.Model.Config.T,  Econ.Model.Desc.T];
  };
};

export type Event =
  | { kind: 'config', config: Config }

/**
 * Horizontal Summation for quota
 */
