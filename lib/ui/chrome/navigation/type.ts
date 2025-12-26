import { TocItem } from './table-of-contents/type.ts';
import { NavigationMenu } from './element.js';

export type NavigationController = {
  menuElement: HTMLElement,
  navigationButton: HTMLElement,
  menuOpen: boolean;
  showMenu(state: boolean): void;
  currentApp: string;
  currentAppId: string;
  transition: EventTarget,
  setToc(items: readonly TocItem[]): void;
  jumpToTitle(): void;
};
