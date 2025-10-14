import { ConfigChangeEvent } from '../config/events.js';

export type ApplicationController = {
  events: EventTarget,
  container: HTMLElement,

  loadApp(path: string): void;
  onResize(): void;
  onConfigUpdate(config: ConfigChangeEvent): void;
};

