import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::1101::08).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('header', () => {
    const el = renderWidget(doc.header);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('entryGame', () => {
    const el = renderWidget(doc.entryGame);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('prisonerDelimma', () => {
    const el = renderWidget(doc.prisonerDelimma);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('cartels', () => {
    const el = renderWidget(doc.cartels);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('mixedStrategy', () => {
    const el = renderWidget(doc.mixedStrategy);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
