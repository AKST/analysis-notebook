import { ToggleableMixin } from '../mixins/toggleable.js';

export type NavigationController = {
  menuElement: ToggleableMixin & HTMLElement,
  navigationButton: HTMLElement,
  currentApp: string;
  currentAppId: string;
  transition: EventTarget,
};
