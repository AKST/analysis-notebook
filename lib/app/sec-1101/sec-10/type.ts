import { MakeConfigKnobs } from '../../prelude-type.ts';

export type Config = {
  readonly marginalCost: number;
  readonly consumers: Record<string, [number, number]>;
};

export type State = {
};

export type Event =
  | { kind: 'config', config: Config }
