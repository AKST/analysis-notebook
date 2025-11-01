import { EngineRunner } from '@base/runtime/type.ts';
import { ConfigChangeEvent } from '@ui/config/events.js';

export type ApplicationController = {
  events: EventTarget,
  container: HTMLElement,

  loadApp(path: string): void;
  onResize(): void;
  onConfigUpdate(config: ConfigChangeEvent): void;
};

export type ApplicationState =
  | { kind: 'initial' }
  | { kind: 'loading', path: string }
  | { kind: 'running', app: EngineRunner<any> }
