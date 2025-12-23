import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2206::04.1).widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('intro', () => {
    const el = renderWidget(doc.intro);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('introduction', () => {
    const el = renderWidget(doc.introduction);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('consistency', () => {
    const el = renderWidget(doc.consistency);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('asymptoticNormality', () => {
    const el = renderWidget(doc.asymptoticNormality);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('asymptoticEfficiencyOfOLS', () => {
    const el = renderWidget(doc.asymptoticEfficiencyOfOLS);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
