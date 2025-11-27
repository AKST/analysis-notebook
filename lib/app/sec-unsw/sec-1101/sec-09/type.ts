import { ModelRenderer } from '@prelude-econ/2d-micro/model.js';
import { RenderContextInit } from '@app/prelude-type.ts';
import * as Econ from '@base/econ/micro/type.ts';

export type RenderContext = RenderContextInit & {
  model: ModelRenderer,
}

export type CoaseProblem = {
  initator: { refrain: number, exercise: number },
  bystander: { refrain: number, exercise: number },
};

type MarketVariant<V> = {
  readonly demand: V;
  readonly supply: V;
};

export type Config = {
  readonly externality: number;
  readonly transfer: number;
  readonly market: MarketVariant<[number, number]>;
};

export type State = {
  readonly model?: [Econ.Model.Config.T,  Econ.Model.Desc.T];
};

export type Event =
  | { kind: 'config', config: Config }
