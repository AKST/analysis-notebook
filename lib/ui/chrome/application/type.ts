import { EngineRunner } from '@base/runtime/type.ts';
import { ConfigChangeEvent } from '../config/events.js';

export type ApplicationController = {
  events: EventTarget,
  loadApp(path: string): void;
  onResize(): void;
  onConfigUpdate(config: ConfigChangeEvent): void;
  onFocusTocItem(id: string): void;
};

export type ApplicationState =
  | { kind: 'initial' }
  | { kind: 'loading', path: string }
  | { kind: 'running', path: string, app: EngineRunner<any> }
