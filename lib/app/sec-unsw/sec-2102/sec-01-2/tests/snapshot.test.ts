import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::01.2).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('solowSwanGrowthModel', () => {
    const el = renderWidget(doc.solowSwanGrowthModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('modelSetup', () => {
    const el = renderWidget(doc.modelSetup);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('solvingTheModel', () => {
    const el = renderWidget(doc.solvingTheModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('modelSteadyState', () => {
    const el = renderWidget(doc.modelSteadyState);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('transitionDynamics', () => {
    const el = renderWidget(doc.transitionDynamics);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('strengthsAndLimitations', () => {
    const el = renderWidget(doc.strengthsAndLimitations);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('continousK', () => {
    const el = renderWidget(doc.continousK);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
