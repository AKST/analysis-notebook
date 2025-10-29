import { vis2dModel } from '../prelude.js';
import {
  Vec2,
  RenderContextInit,
  MakeConfigKnobs,
  Econ,
} from '../../../prelude-type.ts';
import {
  TextRenderer,
  Grid,
  PointRenderer,
  LineRenderer,
  PolygonRenderer,
} from '../../../prelude.js';

export type RenderContext = RenderContextInit & {
  model: vis2dModel.ModelRenderer,
  text: TextRenderer,
  grid: Grid,
  line: LineRenderer,
  poly: PolygonRenderer,
}

export type Config = {
  readonly summation: {
    readonly priceCtrl: (
      | { kind: 'relative', value: number }
      | { kind: 'absolute', value: number }
    );
    readonly consumers: Record<string, [number, number]>;
    readonly producers: Record<string, [number, number]>;
  };
  readonly reservationPrices: {
    readonly consumers: number[];
    readonly producers: number[];
  };
};

export type DiscretePartipant = { reservationPrice: number, surplus: number };
export type DiscretePartipantState = {
  readonly curve: Econ.Curve.Discrete;
  readonly agents: readonly DiscretePartipant[];
};

export type Knobs = MakeConfigKnobs<Config>;

export type State = {
  readonly discrete: {
    readonly bounds: Vec2;
    readonly equilibrium: Vec2 | undefined;
    readonly consumers: Econ.Curve.Discrete;
    readonly producers: Econ.Curve.Discrete;
    readonly model: Econ.Model.Desc.T | undefined;
  },
  readonly summation: {
    readonly model: Econ.Model.Desc.T | undefined;
    readonly modelEq: Econ.Model.Desc.T | undefined;
    readonly modelState: Econ.Model.Config.T  | undefined;
    readonly bounds: Vec2;
    readonly consumers: Record<string, Econ.Curve.Continious>;
    readonly producers: Record<string, Econ.Curve.Continious>;
    readonly aggregate: {
      readonly consumption: Econ.Curve.Continious,
      readonly production: Econ.Curve.Continious,
    },
  },
};

export type Event =
  | { kind: 'config', config: Config }

/**
 * # Equilibrium
 *
 * ## Concepts
 * ### Main
 *
 * ### Other
 *
 * ## Content
 *
 * Lecture Video link:
 *   Lecture 2: https://www.youtube.com/watch?v=anLD-DYm5q0
 *
 *  - Equilibrium
 *
 *      - Excess Demand (32:25 lesson 2)
 *        - is when the price is well below the equilibrium
 *          - demand quantity is above the equilibrium
 *            - many consumers love this price
 *          - supply quantity is below the equilibrium
 *            - few producers would be willing to accept this price
 *        - The outcome will be, there will be a shortage supply
 *
 *      - Excess Supply
 *        - is when the price is well above the equilibrium
 *          - demand quantity is below the equilibrium
 *            - few consumers would be willing to accept this price
 *          - supply quantity is above the equilibrium
 *            - many producers love this price
 *        - The outcome will be, there will be a shortage of demand
 *
 *  - Surplus
 *    - Consumer Surplus, difference between what a buyer is
 *      willing to pay (reservation price) and what they ended
 *      up paying (market price). Which is basically the remainder.
 *
 *    - Producer Surplus, difference between what a producer is
 *      recevies (the market price) and what they were prepared to
 *      accept (reservation price). Which is also the remainder.
 *
 *  - Equlibrium Example (40:36 lesson 2)
 *    - Rationing Rule, highest consumer reservation
 *      price goes first
 *
 *  - Pareto Efficency (54:08, lesson 2)
 *    - A transaction in which at least one party
 *      is made better off and no party no party is made worse off.
 *    - Pareto Improving tranactions are impossible when something
 *      is already pareto efficent.
 *
 *  - Shifting of the curves (57:04, lesson 2)
 *
 *  - Invisible Hand Prinipal
 *    - Outcome
 *      - In the long run firms will be pushed to produces
 *        at the lowest possible average total cost.
 *      - Perfectly competitvive markets will reach
 *        socially optimial outcomes with intervention.
 *    - Assumptions
 *      - Goods are homogenous
 *      - Free entrey and exit
 *      - Firms and consumers are price takers
 *      - Shutdown conditions
 *        - short run: P < minATC
 *        - long run: Π < 0
 *
 *  - long run equilibrium
 *    - as the market equilibrium increases, new firms
 *      will enter the market until the firm price is
 *      back at the ATC
 *
 * ### Ideas
 *
 * #### Equrilbruim Example
 *
 * - Input
 *   - A sequence of producers and consumers
 *
 * - Output
 *   - compute the convex hull of area left
 *     of the equirilbrum and half to get
 *     the consumer and producer surplus
 *   - Extract the curves based on the
 *     consumers and producers
 *
 * #### Pareto Efficency
 *
 * - Show a demand and supply curve allowing the
 *   price to be adjusted, showing dead weight loss
 *   - Show the prices and area of surplus and the
 *     dead weight loss.
 *
 * #### Shifting Curves
 *
 * Show how the equrilibruim moves as the curves move
 * use complex inputs
 *
 * #### Demostrate perfect elasticity with long run equilibrium (1hr 4)
 *
 * show the curve for a firm moving with the market equilibrium
 *   - show economic profit when curve moves up
 *   - indicate if firms are entering the market
 *   - possibly use state to adjust the number of firms over time
 */

