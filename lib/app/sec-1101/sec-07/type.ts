export type Config = {
  readonly monopoly: {
    readonly fixedCost: number;
    readonly perworkerQuantity: (
      | { kind: 'scalar', value: number }
      | { kind: 'marginal', value: number[] }
    );
  };
  readonly demand: {
    readonly demandSchedule: number[];
  };
};

export type State = {
};

export type Event =
  | { kind: 'config', config: Config }
