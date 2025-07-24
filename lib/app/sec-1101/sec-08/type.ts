export type Config = {
  readonly placeholder: number;
};

export type State = {
};

export type Event =
  | { kind: 'config', config: Config }
