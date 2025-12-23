import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::1101::02).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  // example widget requires state.examples - skip for now

  it('quantity', () => {
    const el = renderWidget(doc.quantity);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('kindsOfCosts', () => {
    const el = renderWidget(doc.kindsOfCosts);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('elascity', () => {
    const el = renderWidget(doc.elascity);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('deriveAtcAndAvcFromMC', () => {
    const el = renderWidget(doc.deriveAtcAndAvcFromMC);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
