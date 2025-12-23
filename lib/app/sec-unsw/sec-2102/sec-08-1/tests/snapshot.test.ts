import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::08.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('dummy', () => {
    const el = renderWidget(doc.dummy);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('introduction', () => {
    const el = renderWidget(doc.introduction);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('governmentSpendingRevenue', () => {
    const el = renderWidget(doc.governmentSpendingRevenue);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('internationalEvidence', () => {
    const el = renderWidget(doc.internationalEvidence);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('budgetConstraint', () => {
    const el = renderWidget(doc.budgetConstraint);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('governmentBorrowing', () => {
    const el = renderWidget(doc.governmentBorrowing);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('fiscalProblem', () => {
    const el = renderWidget(doc.fiscalProblem);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('extras', () => {
    const el = renderWidget(doc.extras);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
