/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import { todo } from '../common/components.js';
import { container, twoColumns, twoThree } from '../common/layout.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';


/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: (_ctx) => container(
    ['h1', 'Market Power and Oligopolies'],
    ['p', 'Create Matrix Knob for games'],
    todo({}, 'show how games work'),
    /*
     * A dominant strategy is one where the player
     * with the dominant strategy always receives
     * a higher payoff playing that dominant strategy
     * than any other, regardless of the strategies
     * their opponents choose
     *
     * It is possible for a player has no dominant strategy.
     */
    todo({}, 'explain dominant strategies'),
    /**
     * Show the reduced table based on the presence
     */
    todo({}, 'iterated deletion of dominated strategies'),
    todo({}, 'nash equilibrium'),
    todo({}, 'unilateral deviation'),
  ),
};
