import { Econ, RenderContextInit } from '../../prelude-type.ts';
import { ModelRenderer } from '../common/2d/model.js';

export type RenderContext = RenderContextInit & {
  model: ModelRenderer,
}

export type Config = {
};

export type State = {
  ceilingInput: Econ.Model.Config.T;
  ceilingModel?: Econ.Model.Desc.T;
  floorInput: Econ.Model.Config.T;
  floorModel?: Econ.Model.Desc.T;
  subsidyInput: Econ.Model.Config.T;
  subsidyModel?: Econ.Model.Desc.T;
  taxInput: Econ.Model.Config.T;
  taxModel?: Econ.Model.Desc.T;
};

export type Event =
  | { kind: 'config', config: Config }
