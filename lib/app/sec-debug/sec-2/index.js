/**
 * @import {
 *   MakeConfigKnobs,
 *   E,
 * } from '@app/prelude-type.ts';
 *
 * @typedef {{
 *   name: Record<string, number>,
 *   sequence: readonly number[],
 * }} Config
 *
 * @typedef {{
 *   clicks: number,
 * }} State
 *
 * @typedef {(
 *   | { kind: 'inc' }
 *   | { kind: 'reset' }
 *   | { kind: 'change' }
 * )} Event
 */
import { doc } from '@app/prelude.js';

export const meta = { kind: 'document' };

export function createStyle() {
  return {
    '.container': { width: '100%', padding: '2rem' },
    '.buttons': {
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr',
      gridGap: '1rem',
      'button': {
        outline: 'none',
        padding: [4, 16, 6],
        borderRadius: 0,
      },
    },
  };
}

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    name: {
      kind: 'many',
      label: 'names and ages',
      of: { a: 41, b: 22, c: 32 },
      create: {
        kind: 'number',
        label: 'age of {id}',
        of: 5,
        range: [1, 90],
      },
    },
    sequence: {
      kind: 'sequence',
      of: [1, 2, 3, 4, 5, 6],
    },
  }
}

/** @returns {State} */
export function createState() {
  return { clicks: 0 };
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  console.log(arguments);
  switch (event.kind) {
    case 'inc':
      return { clicks: state.clicks + 1 };
    case 'reset':
      return { clicks: 0 };
    default:
      return state;
  }
}

/**
 * @param {unknown} _context
 * @param {State} state
 * @param {Config} config
 * @returns {E.Item}
 */
export function render(_context, state, config) {
  /** @param {string} label @param {Event} click @returns {E.Item} */
  const button = (label, click) =>
    ['button', { events: { click } }, [label]];

  return ['div', { className: 'container' },  [
    ['h1', ['Hello world']],
    ['p', ['This is a demo document application']],
    ['p', ['Document apps can output HTML, MathML, and SVG content']],
    ['p', ['Clicks: ' + state.clicks]],
    ['div', {
      className: 'buttons',
    }, [
      button('Increment', { kind: 'inc' }),
      button('Reset', { kind: 'reset' }),
    ]],
    ['input', { type: 'number', value: '0', events: { change: { kind: 'change' } } }],
    doc.h2`Names and ages`,
    ['ul', Object.entries(config.name).map(([k, v]) => (
      ['li', `${k} number is ${v}`]
    ))],
    doc.h2`Sequence Values`,
    ['ul', config.sequence.map((v, i) => (
      ['li', `Item ${i} is ${v}`]
    ))],
  ]];
}
