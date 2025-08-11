import { Econ, RenderContextInit } from '../../prelude-type.ts';
import { ModelRenderer } from '../common/2d/model.js';

export type RenderContext = RenderContextInit & {
  model: ModelRenderer,
}

export type Config = {
  readonly market: {
    readonly demand: [number, number];
    readonly supply: [number, number];
  };
  readonly policy: {
    readonly floor: number;
    readonly ceiling: number;
    readonly tax: number;
    readonly subsidy: number;
  };
};

export type State = {
  readonly ceiling?: [Econ.Model.Config.T,  Econ.Model.Desc.T];
  readonly floor?: [Econ.Model.Config.T, Econ.Model.Desc.T];
  readonly subsidy?: [Econ.Model.Config.T, Econ.Model.Desc.T];
  readonly tax?: [Econ.Model.Config.T, Econ.Model.Desc.T];
};

export type Event =
  | { kind: 'config', config: Config }
