import { beforeEach, expect, describe, it } from 'vitest';
import { renderWidget } from '@base/runtime/testing/test-multi.js';
import * as doc from '../doc.js';

describe('app(unsw::2102::07.1).widgets', () => {
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

  it('neoclassicalModel', () => {
    const el = renderWidget(doc.neoclassicalModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('lessonsFromModel', () => {
    const el = renderWidget(doc.lessonsFromModel);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('empiricalEvidence', () => {
    const el = renderWidget(doc.empiricalEvidence);
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('deriveUtilityFunction', () => {
    const el = renderWidget(doc.deriveUtilityFunction);
    expect(el.outerHTML).toMatchSnapshot();
  });
});
