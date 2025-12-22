import { beforeEach, expect, describe, it } from 'vitest';
import { SharedStyleSheet } from '@base/platform/styles/shared_style_sheet.js';
import { createTabLayoutElement } from '../create.js';

describe('TabLayout.snapshot', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should match snapshot', () => {
    const TabLayout = createTabLayoutElement({ scrollSheet: new SharedStyleSheet('') });
    const tabs = new TabLayout();
    document.body.appendChild(tabs);
    expect(tabs.shadow?.innerHTML).toMatchSnapshot();
  });
});
