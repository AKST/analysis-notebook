import { expect, describe, it, beforeEach, vi } from 'vitest';
import { makeHelper } from '../helper.js';
import * as Meta from '../node_meta.js';
import { node, meta } from '../render.js';

describe('dsl_dom::helper', () => {
  const div = makeHelper({ of: ['html', 'div'] });

  it('unit', () => {
    const items = [1].map(div.unit);
    expect(items).toEqual([node('html', 'div', meta(), [1])]);
  });

  it('.c', () => {
    const items = div.c(1, 2, 3);
    expect(items).toEqual(node('html', 'div', meta(), [1, 2, 3]));
  });

  it('.t', () => {
    const items = div.t`${1} - ${2} - ${3}`;
    expect(items).toEqual(node('html', 'div', meta(), ['', 1, ' - ', 2, ' - ', 3, '']));
  });

  it('void', () => {
    const items = div.void({ id: 'hello' });
    expect(items).toEqual(node('html', 'div', Meta.attr(meta('html', 'div'), 'id', 'hello'), []));
  });

  it('from', () => {
    const items = div.from([1, 2, 3]);
    expect(items).toEqual(node('html', 'div', meta(), [1, 2, 3]));
  });
});
