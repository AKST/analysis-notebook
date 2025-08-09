import {
  RenderContextInit,
  Widget,
  MakeConfigKnobs,
  Econ,
  Vec2,
} from '../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PointRenderer,
  LineRenderer,
} from '../../prelude.js';

export type RenderContext = RenderContextInit & {
  text: TextRenderer,
  grid: Grid,
  line: LineRenderer,
  point: PointRenderer,
};

export type Config = {
  readonly examples:{
    readonly a: {
      readonly fishColor: number;
      readonly fishPrice: number;
      readonly fishCost: readonly number[]
      readonly appleColor: number;
      readonly applePrice: number;
      readonly appleCost: readonly number[]
    },
  },
  readonly firm: {
    readonly price: number;
    readonly fixedCost: number;
    readonly quantity: number[];
    readonly varCost: (
      | { kind: 'scalar', value: number }
      | { kind: 'cumulative', value: number[] }
    );
  },
};

export type Knobs = MakeConfigKnobs<Config>

export type Good = {
  readonly price: number;
  readonly color: number;
  readonly table: Econ.Firm.BehaviourTable,
};

export type State = {
  readonly examples?: {
    readonly fish: Good;
    readonly apple: Good;
  };
  readonly firm?: Econ.Firm.BehaviourTable;
  readonly firmScale: Vec2;
};

export type Event =
  | { kind: 'config', config: Config }

/**
 * TODO
 * - emphrasis the difference between
 *   discrete and continuious
 *
 * - Vertical and horizontal interpretation
 *   of quantity and price
 *
 * # Questions
 *
 * - How does the model change with the fixed
 *   good is aquisition of something that
 *   apprecitates and depreciates.
 *
 * - Does elascity at a given quantity
 *   change when price changes.
 *
 */


