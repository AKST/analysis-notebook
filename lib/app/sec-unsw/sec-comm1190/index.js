/**
 * @typedef {{}} Config
 * @typedef {{}} State
 */
import { doc } from '../../prelude.js';
import * as week1 from './weeks/01.js';
import * as week2 from './weeks/02.js';
import * as week3 from './weeks/03.js';
import * as week4 from './weeks/04.js';
import * as week5 from './weeks/05.js';
import * as week7 from './weeks/07.js';
import * as week8 from './weeks/08.js';
import * as week9 from './weeks/09.js';

export const meta = {
  kind: 'multi',
  sheets: [
    import.meta.resolve('@prelude-uni/styles.css'),
  ],
};

/**
 * @param {unknown} _context
 * @param {State} _state
 * @param {Config} _config
 */
function render(_context, _state, _config) {
  return doc.div({ className: 'main container' }).c(
    doc.h1`COMM1190 notes`,
    week1.render(),
    week2.render(),
    week3.render(),
    week4.render(),
    week5.render(),
    week7.render(),
    week8.render(),
    week9.render(),
  )
}

export const children = [{
  meta: { kind: 'document' },
  render,
}];
