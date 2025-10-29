import { RenderContextInit } from '../../prelude-type.ts';

export type RenderContext = RenderContextInit;

export type Config = {
};

export type Event =
  | { kind: 'config', config: Config };

export type State = {};
