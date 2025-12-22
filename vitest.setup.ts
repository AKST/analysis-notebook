// Vitest setup file
import { vi } from 'vitest';

// Add missing globals that components expect
global.PointerEvent = class PointerEvent extends Event {
  constructor(type: string, options: any = {}) {
    super(type, options);
    this.pointerType = options.pointerType || 'mouse';
  }
  pointerType: string;
};

/*
 * We need to gradually refactor users of this to avoid
 * global dependencies like this.
 */
vi.mock('@base/platform/styles/shared_style_sheet.js', () => ({
  SharedStyleSheet: class {
    constructor() {}
    install() {}
    sheetPromise = Promise.resolve(new CSSStyleSheet());
  },
}));
