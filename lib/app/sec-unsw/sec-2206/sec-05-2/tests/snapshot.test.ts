import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::05.2).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('consequencesOfHeteroskedasticity', () => {
    const el = renderWidget(doc.consequencesOfHeteroskedasticity);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('robustInference', () => {
    const el = renderWidget(doc.robustInference);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('testingHeteroskedasticity', () => {
    const el = renderWidget(doc.testingHeteroskedasticity);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('weightedLeastSquares', () => {
    const el = renderWidget(doc.weightedLeastSquares);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('lpmRevisited', () => {
    const el = renderWidget(doc.lpmRevisited);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
