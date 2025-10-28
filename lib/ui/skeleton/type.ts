export type Layout = 'narrow' | 'medium' | 'wide';

export type AppState =
  | { kind: 'idle' }
  | { kind: 'open', hasConfig: 'boolean' };

export type Containers = {
  buttons: HTMLElement;
  navigation: HTMLElement;
  config: HTMLElement;
  main: HTMLElement;
};
