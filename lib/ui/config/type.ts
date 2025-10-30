import { ConfigKnobLabel } from './common/label.js';

export interface KnobElement extends HTMLElement {
  gridColumn: number;
  label?: ConfigKnobLabel
  setup(): void;
  setEnable(value: boolean): void;
}


