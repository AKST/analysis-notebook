// Vitest setup file
// Add missing globals that components expect
global.PointerEvent = class PointerEvent extends Event {
  constructor(type: string, options: any = {}) {
    super(type, options);
    this.pointerType = options.pointerType || 'mouse';
  }
  pointerType: string;
};