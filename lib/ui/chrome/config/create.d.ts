import { ConfigMenu } from './element.js';

export type ConfigController = {
  readonly config: ConfigMenu,
  readonly configButton: HTMLElement,
};

export function installConfig(): ConfigController;
