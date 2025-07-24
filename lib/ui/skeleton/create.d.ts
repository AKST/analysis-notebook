import { ApplicationController } from '../application/create.js';
import { NavigationController } from '../navigation/create.js';
import { ConfigController } from '../config/create.js';

export type Layout = 'narrow' | 'medium' | 'wide';

export type SkeletonGridStyles_Internal = {
  body: {
    gridTemplateColumns: string;
    gridTemplateRows: string;
  },
  nav: {
    display: 'block' | 'none',
  },
  cfg: {
    display: 'block' | 'none',
  },
};

export type SkeletonGridStyleCfg_Internal = {
  state: {
    layout: Layout,
    showNav: boolean,
    showCfg: boolean,
  },
};

export function getLayout(): Layout;

export function getGridStylesInternal(cfg: SkeletonGridStyleCfg_Internal): SkeletonGridStyles_Internal;

export function installResponsiveSkeleton(cfg: SkeletonInstallCfg): void;

export type SkeletonInstallCfg = {
  application: ApplicationController,
  navigation: NavigationController,
  configMenu: ConfigController,
};
