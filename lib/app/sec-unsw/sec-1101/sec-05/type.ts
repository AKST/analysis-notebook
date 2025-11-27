import { ModelRenderer } from '@prelude-econ/2d-micro/model.js';
import { RenderContextInit } from '@app/prelude-type.ts';
import * as Econ from '@base/econ/micro/type.ts';

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
  readonly demand: Econ.Curve.Continious;
  readonly supply: Econ.Curve.Continious;
  readonly base?: Econ.Model.Desc.T;
  readonly ceiling?: [Econ.Model.Config.T,  Econ.Model.Desc.T];
  readonly floor?: [Econ.Model.Config.T, Econ.Model.Desc.T];
  readonly subsidy?: [Econ.Model.Config.T, Econ.Model.Desc.T];
  readonly tax?: [Econ.Model.Config.T, Econ.Model.Desc.T];
};

export type Event =
  | { kind: 'config', config: Config }
