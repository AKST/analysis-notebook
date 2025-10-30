import { RenderContextInit } from '@app/prelude-type.ts';

export type RenderContext = RenderContextInit & {
};

export type Config = {
};

export type Event =
  | { kind: 'config', config: Config };

export type State = {};
