/**
 * @import { SharedStyleSheet } from '../../../base/dom_ui/shared_style_sheet.js';
 * @import { ComponentType } from '../../../base/dom_ui/type.ts';
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
