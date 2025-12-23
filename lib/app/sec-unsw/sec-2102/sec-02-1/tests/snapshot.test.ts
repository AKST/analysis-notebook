import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::02.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('economicsOfIdeas', () => {
    const el = renderWidget(doc.economicsOfIdeas);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('increasingReturnsToScale', () => {
    const el = renderWidget(doc.increasingReturnsToScale);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('problemsWithPerfectCompetition', () => {
    const el = renderWidget(doc.problemsWithPerfectCompetition);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('romerGrowthModel', () => {
    const el = renderWidget(doc.romerGrowthModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('solvingRomerModel', () => {
    const el = renderWidget(doc.solvingRomerModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('balancedGrowthPath', () => {
    const el = renderWidget(doc.balancedGrowthPath);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('growthAccounting', () => {
    const el = renderWidget(doc.growthAccounting);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('summary', () => {
    const el = renderWidget(doc.summary);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('continiousRomerSolow', () => {
    const el = renderWidget(doc.continiousRomerSolow);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
