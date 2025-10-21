import { VectorOf, RenderContextInit } from '../../prelude-type';
import {
  Grid,
  VectorRenderer,
  PointRenderer,
} from '../../prelude.js';

type V2 = VectorOf<'r', 2>;

export type RenderConfig = {
  grid: Grid,
  vec: VectorRenderer,
  point: PointRenderer,
} & RenderContextInit;

export type Event =
  | { kind: 'config', config: Config };

export type Config = {
  time: number,
  scale: number,
  priceX: number,
  priceY: number,
  agents: Record<string, { point: [number, number], color: number }>;
};

export type AgentState = { point: V2, color: number };

export type State = {
  price: V2;
  agents: Record<string, AgentState>;
  econPPF: V2[],
  optimalProduction: V2,
};

/**
 * # TODO
 *
 * - [ ] Explain Absolute Advantage
 *   - Show with table
 *
 * - [ ] Explain how to mathematically model a PPC
 *
 * - [ ] Explain how to mathematically get a CPC
 *
 * ## Concepts to explain
 *
 * - PPC
 *  - Efficient Production Point
 *  - Inefficient Production Point
 *  - Attainable Production Point
 *  - Unattainable Production Point
 * - Absolute Advantage
 *   - An agent (or an economy) has an Absolute Advantage
 *     in a productive activity (like collecting bananas
 *     or catching rabbits) when he/she can carry on this
 *     activity with less resources (for example, less
 *     time) than another agent.
 */


