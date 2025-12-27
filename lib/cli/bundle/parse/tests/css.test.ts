import { expect, describe, it } from 'vitest';
import { parseCss } from '../css.js';

describe('parseCss', () => {
  it('extracts @import paths', () => {
    const css = `@import './base.css';`;
    const result = parseCss(css);

    expect(result.imports).toHaveLength(1);
    expect(result.imports[0].path).toBe('./base.css');
  });

  it('extracts url() paths', () => {
    const css = `background: url(./image.png);`;
    const result = parseCss(css);

    expect(result.urls).toHaveLength(1);
    expect(result.urls[0].path).toBe('./image.png');
  });

  it('skips data: and http urls', () => {
    const css = `
      background: url(data:image/png;base64,abc);
      background: url(https://example.com/img.png);
    `;
    const result = parseCss(css);

    expect(result.urls).toHaveLength(0);
  });

  it('handles empty CSS', () => {
    const result = parseCss('');

    expect(result.imports).toHaveLength(0);
    expect(result.urls).toHaveLength(0);
  });
});
