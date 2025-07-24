import { RenderContextInit, MakeConfigKnobs } from '../../prelude-type.ts';
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
  readonly utility: {
    readonly muffins: number[];
    readonly muffinPrice: number;
    readonly muffinColor: number;
    readonly donuts: number[];
    readonly dountPrice: number;
    readonly donutColor: number;
  };
};

export type Knobs = MakeConfigKnobs<Config>;

export type GoodUtility = {
  price: number,
  color: number,
  total: readonly number[],
  marginal: readonly number[],
  marginalPer$: readonly number[],
}

export type State = {
  readonly utility?: {
    readonly donuts: GoodUtility,
    readonly muffins: GoodUtility,
  },
};

export type Event =
  | { kind: 'config', config: Config }

/**
 * # Demand Curve
 *
 * ## Concepts
 * ### Main
 *
 * - Marginal Utility
 * - Reservation Price
 * - Demand Curve
 *
 * ### Other
 *
 * - Relative price (?)
 * - Goods being substitutes
 * - Goods being complements
 * - Goods being normal
 * - Goods being complements
 * - Substition effect
 * - Income effect
 *
 * ## Content
 *
 * Lecture Video link:
 *   Lecture 1: https://www.youtube.com/watch?v=Q9bRl_v8CyQ
 *   Lecture 2: https://www.youtube.com/watch?v=anLD-DYm5q0
 *
 * - Introduce the concept of utilty
 *   - See the time 24:54 (lesson 1)
 *   - explain the concept of total utilty
 *   - explain the concept of marginal utilty
 *
 *   - Utilty
 *
 * - Resevation Price
 *   - See the time 27:21 (lesson 1)
 *   - It relates to
 *     - An actor and their preferences
 *     - A quantity of goods an varies
 *
 *   - Since it relates to an actor a reservation
 *     price is subjective in it is reference to
 *     an actor and relates to their preferences.
 *     And it varies in respect to a quantity as
 *     it relates to the concept of marginal utility.
 *
 *   - It is the price at which a buyer would be
 *     indifferent in picking between buying gum
 *     or buying sneakers.
 *
 * - Demand
 *   - interpretations  (31:43, lesson 1)
 *
 *     - Horizontal interpretation
 *       - Start from a given PRICE and then use the
 *         demand curve to derive the quantity of goods
 *         that the consumer is willing to buy at that price.
 *
 *     - Vertical interpretation
 *       - start from a given QUANTITY find associated
 *         price on the curve, this is the maximum
 *         amount a consumer is willing to pay for
 *         the marginal unit of the good
 *         (aka CONSUMER RESERVATION PRICE)
 *
 *    - terminology (35:15 lesson 1)
 *
 *      - Substitutes: when 2 goods are substitutes
 *        when an increase in the price of good A
 *        causes an increase in demand for good B.
 *
 *      - Complements: when 2 goods are substitutes
 *        when an decrease in the price of good A
 *        causes an increase in demand for good B.
 *
 *    - Nature of goods (38:49, lesson 1)
 *
 *      - Normal goods, goods we buy more of
 *        when our purchasing power goes up and
 *        less when our purchasing power goes down.
 *        - Thinks dinning out
 *
 *      - Inferior goods, goods we buy more of
 *        when our purchasing power goes down.
 *        - Thinks instant noodles
 *
 *    - Effects (39:27 lesson 1)
 *
 *      - Subtition effect, captures the changes in
 *        quantity demanded of a given good following
 *        a change in it relative price
 *
 *      - Income Effect, captures changes in the
 *        quantity demanded of a given good following
 *        a change in the consumers purchasing power.
 *
 *  - Shifts and movements along the demand curve (45:13)
 *
 *  - Price Elascity of Demand (46:00)
 *    - Elasticity = P/Q * dQ/dP = P/Q * 1/Slope
 *
 *    - Responsiveness of quantity demanded to changes in price
 *      if the price goes up how easy is it to switch to something
 *
 *      - Determinants
 *        - Availablity of Substitutes
 *        - Defitition of Good (narrower more elastic)
 *        - Income Shrae (more expensive means more elastic)
 *        - Time Horizon (more time means more elastic)
 *          - The time you have to look for alternatives
 *
 *      - Generally step means inelastic (51:00)
 *
 *  - Aggregating Demand (22:42 lesson 2)
 *
 *    - In order to do this we need to make a bunch assumptions
 *      in relation to perfect markets.
 *      - Consumers and producers are price-takers
 *      - Homogenous goods
 *      - No Externalities
 *      - Goods are excludable and rival
 *      - Full information
 *      - Free entry and exit
 *
 *    - Horizontal summation of indivisual consumers to
 *      construct a market wide curve for the market.
 *
 * ## TODO
 *
 * - [ ] Calculating marginal utility
 * - [ ] Calculating the reservation price
 *
 * ### Ideas
 *
 * #### Marginal Utilitiy
 *
 * Based on config to specifiy a cumulative utility
 * sequence, which we can compute a marginal sequence.
 *
 * #### Demand curve
 *
 * - Slider
 *   - Have a widget with a slider that lets someone
 *     scale a price along a demand curve to calculate
 *     the horizontal interpretation
 *
 *   - Do something similar for the vertical intepretation
 *
 *   - This can be state in the app and the answer can be
 *     output in the workbook
 *
 * #### Horizontal Summation of consumers
 *
 * Build a demand curve doing horizontal summation.
 *
 */

