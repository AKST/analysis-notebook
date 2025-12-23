import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::04.1).widgets', () => {
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

  it('quantityTheoryOfMoney', () => {
    const el = renderWidget(doc.quantityTheoryOfMoney);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('theoryOfInflation', () => {
    const el = renderWidget(doc.theoryOfInflation);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('realAndNominalInterest', () => {
    const el = renderWidget(doc.realAndNominalInterest);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('costOfInflation', () => {
    const el = renderWidget(doc.costOfInflation);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('fiscalCausesOfHighInflation', () => {
    const el = renderWidget(doc.fiscalCausesOfHighInflation);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('tutorialNotes', () => {
    const el = renderWidget(doc.tutorialNotes);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
