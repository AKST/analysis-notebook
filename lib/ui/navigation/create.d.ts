import { NavigationMenu } from './element.js';

export type NavigationController = {
  navigation: NavigationMenu,
  navigationButton: HTMLElement,
};

export function installNavigation(cfg: {
  debug: boolean,
  onlyEcon: boolean,
}): NavigationController;
