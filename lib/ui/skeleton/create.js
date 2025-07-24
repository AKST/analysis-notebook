/**
 * @typedef {import('./create.js').SkeletonGridStyleCfg_Internal} SkeletonGridStyleCfg
 * @typedef {import('./create.js').SkeletonGridStyles_Internal} SkeletonGridStyles
 */

const PADDING = 4;
const GRIDGAP = 2;
const HEADER_HEIGHT = 36;
const GUTTER_WIDTH = 300;

/**
 * @param {SkeletonGridStyleCfg} cfg
 * @returns {SkeletonGridStyles}
 */
export function getGridStylesInternal({
  state: { layout, showNav, showCfg },
}) {
  const hh = HEADER_HEIGHT;
  let tCols, tRows;

  /** @type {'block' | 'none'} */
  let displayCfg;

  /** @type {'block' | 'none'} */
  let displayNav;

  if (layout === 'narrow') {
    tCols = '1fr'
    displayNav = showNav ? 'block' : 'none';
    displayCfg = showCfg && !showNav ? 'block' : 'none';

    const vws = PADDING * 2 + GRIDGAP * 1;
    const mh = (showNav || showCfg) ? 50 : 100;
    tRows = `${hh}px calc(${mh}dvh - ${hh}px - ${vws}px)`;
  } else {
    const vws = PADDING * 2 + GRIDGAP;
    tRows = `${hh}px calc(100dvh - ${hh}px - ${vws}px)`;

    if (showNav && showCfg) {
      tCols = `${GUTTER_WIDTH}px 1fr ${GUTTER_WIDTH}px`;
    } else if (showCfg) {
      tCols = `1fr ${GUTTER_WIDTH}px`;
    } else if (showNav) {
      tCols = `${GUTTER_WIDTH}px 1fr`;
    } else {
      tCols = '1fr';
    }
    displayNav = showNav ? 'block' : 'none';
    displayCfg = showCfg ? 'block' : 'none';
  }

  return {
    body: {
      gridTemplateColumns: tCols,
      gridTemplateRows: tRows,
    },
    nav: {
      display: displayNav,
    },
    cfg: {
      display: displayCfg,
    },
  }
}

export const getLayout = function () {
  const { innerWidth } = window;
  if (innerWidth < 600) return 'narrow';
  if (innerWidth < 900) return 'medium';
  return 'wide';
};

const BODY_CLS = {
  wide: 'layout-wide',
  medium: 'layout-wide',
  narrow: 'layout-narrow',
};

/**
 * @typedef {Object} Containers
 * @property {HTMLElement} buttons
 * @property {HTMLElement} navigation
 * @property {HTMLElement} config
 *
 * @returns {Containers}
 */
const getContainerElements = () => /** @type {any} */ ({
  buttons: document.getElementById('buttons'),
  navigation: document.getElementById('sidebar'),
  config: document.getElementById('config'),
});

/**
 * @param {import('./create.js').SkeletonInstallCfg} cfg
 */
export function installResponsiveSkeleton({
  navigation: {
    navigation,
    navigationButton,
  },
  application,
  configMenu: {
    config: configMenu,
    configButton,
  },
}) {
  const containers = getContainerElements();

  containers.navigation.appendChild(navigation);
  containers.config.appendChild(configMenu);
  containers.buttons.appendChild(navigationButton);
  containers.buttons.appendChild(configButton);

  const updateLayout = function () {
    const layout = getLayout();

    const {
      body: { gridTemplateColumns, gridTemplateRows },
      nav: { display: displayNav },
      cfg: { display: displayCfg },
    } = getGridStylesInternal({
      state: {
        layout,
        showNav: navigation.open,
        showCfg: configMenu.open,
      },
    });

    containers.navigation.style.display = displayNav;
    containers.config.style.display = displayCfg;
    document.body.className = BODY_CLS[layout];
    document.body.style.gridTemplateRows = gridTemplateRows;
    document.body.style.gridTemplateColumns = gridTemplateColumns;
    return layout;
  };

  const resetMenus = function () {
    const layout = getLayout();

    if (layout === 'narrow') {
      navigation.showMenu(false);
      configMenu.showMenu(false);
    } else if (layout === 'medium') {
      navigation.showMenu(true);
      configMenu.showMenu(false);
    } else {
      navigation.showMenu(true);
      configMenu.showMenu(true);
    }
  };

  resetMenus()
  updateLayout();

  navigation.addEventListener('loadApp', event => {
    /** @ts-ignore - no clue how to type that */
    const { id, name, path } = event.detail;
    console.log(`Loading app [${id}] ${name}`);
    configMenu.clearKnobs();
    application.loadApp(path);
  })

  application.events.addEventListener('startApp', event => {
    configMenu.showMenu(
      /** @ts-ignore - no clue how to type that */
      event.detail.showConfig && getLayout() === 'wide'
    );
  });

  configMenu.addEventListener('configChange', (event) => {
    /** @ts-ignore - no clue how to type that */
    application.onConfigUpdate(event.detail.values);
  });

  const onLayoutChange = () => {
    updateLayout();
    application.onResize()
  };

  navigation.addEventListener('toggle', () => {
    if (navigation.open && getLayout() !== 'wide') {
      configMenu.showMenu(false);
    }
    onLayoutChange()
  });

  configMenu.addEventListener('toggle', () => {
    if (configMenu.open && getLayout() !== 'wide') {
      navigation.showMenu(false);
    }
    onLayoutChange();
  });

  globalThis.addEventListener('resize', () => {
    resetMenus();
    onLayoutChange()
  });
}

