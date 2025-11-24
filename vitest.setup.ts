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

// Mock SharedStyleSheet globally
vi.mock('@base/dom_ui/shared_style_sheet.js', () => ({
  SharedStyleSheet: class {
    constructor() {}
    install() {}
  },
}));