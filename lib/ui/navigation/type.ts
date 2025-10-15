import { TocItem } from './table_of_contents/type.ts';
import { ToggleableMixin } from '../mixins/toggleable.js';

export type NavigationController = {
  menuElement: ToggleableMixin & HTMLElement,
  navigationButton: HTMLElement,
  currentApp: string;
  currentAppId: string;
  transition: EventTarget,

  setToc(items: readonly TocItem[]): void;
  jumpToTitle(): void;
};
