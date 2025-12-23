import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::01.2).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('models', () => {
    const el = renderWidget(doc.models);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('linearRegression', () => {
    const el = renderWidget(doc.linearRegression);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('ordinaryLeastSquaresEstimate', () => {
    const el = renderWidget(doc.ordinaryLeastSquaresEstimate);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('functionalFormsInvolvingLogs', () => {
    const el = renderWidget(doc.functionalFormsInvolvingLogs);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('assumptionsOfUnbiasednessInOLS', () => {
    const el = renderWidget(doc.assumptionsOfUnbiasednessInOLS);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('summary', () => {
    const el = renderWidget(doc.summary);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
