import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::05.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('header', () => {
    const el = renderWidget(doc.header);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('theLongrunTheShortrun', () => {
    const el = renderWidget(doc.theLongrunTheShortrun);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('theShortrunModel', () => {
    const el = renderWidget(doc.theShortrunModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('okunsLaw', () => {
    const el = renderWidget(doc.okunsLaw);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
