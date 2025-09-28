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
