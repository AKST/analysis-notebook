/**
 * @import { SharedStyleSheet } from '@base/platform/styles/shared_style_sheet.js';
 * @import { TabLayout } from './type.ts';
 */
import { TabLayout as TabLayoutIntern } from './element.js';

/**
 * @param {{
 *   scrollSheet: SharedStyleSheet,
 * }} cfg
 * @returns {TabLayout}
 */
export function createTabLayoutElement({
  scrollSheet,
}) {
  const TagLayoutImpl = class extends TabLayoutIntern {
    constructor() { super(scrollSheet) }
  };

  customElements.define('tabs-layout', TagLayoutImpl);

  return TagLayoutImpl;
}
