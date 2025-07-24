import { ConfigMenu } from '../config';

export type ApplicationControllerCfg = {
  config: ConfigMenu,
  container: HTMLElement,
  initialApp: string,
  loadModule: (path: string) => Promise<any>,
};

export type ApplicationController = {
  events: EventTarget,
  container: HTMLElement,

  loadApp(path: string): void;
  onResize(): void;
  onConfigUpdate(config: any): void;
};

export function installApplication(cfg: ApplicationControllerCfg): ApplicationController;
