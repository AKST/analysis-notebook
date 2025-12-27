// Vitest setup file
import { vi, expect } from 'vitest';

const projectRoot = process.cwd();

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string' && val.includes(projectRoot),
  print: (val) => (
    (typeof val === 'string')
      ? val.replace(new RegExp(escapeRegex(projectRoot), 'g'), '<PROJECT_ROOT>')
      : val.toString()
  ),
});

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
vi.mock('@base/platform/styles/shared-style-sheet.js', () => ({
  SharedStyleSheet: class {
    constructor() {}
    install() {}
    sheetPromise = Promise.resolve(new CSSStyleSheet());
  },
}));
