export type CoaseProblem = {
  initator: { refrain: number, exercise: number },
  bystander: { refrain: number, exercise: number },
};

export type Config = {
  readonly placeholder: number;
};

export type State = {
};

export type Event =
  | { kind: 'config', config: Config }
