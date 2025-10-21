/**
 * @import {
 *   WidgetAnchor,
 *   RenderStrategy,
 *   ScalingStrategy,
 *   ChildWidgetParam,
 *   WidgetRunner,
 *   MultiModule,
 *   WidgetChild,
 *   WidgetSize,
 * } from '../type.ts';
 * @import { StyleManager } from '../widget/document/style-manager.js';
 *
 * @typedef {Object} ConfigMultiModule
 * @property {number} viewportWidth
 * @property {number} viewportHeight
 * @property {HTMLElement} mainContent
 * @property {any} config
 */
import { createStyleManager } from '../widget/document/style-manager.js';
import { generateCSS, renderOnto } from '../../../base/dom_ui/index.js';
import { insertAtStart } from '../../../util/dom.js';
import { renderDocument as appRender } from '../../../base/dom_app/index.js';
import { initialiseState, getFactory } from './util.js';

export function createMultiWidgetApplicationFactory() {
  return {
    /**
     * @param {MultiModule<any, any, any>} module
     * @param {ConfigMultiModule} cfg
     */
    create(module, {
      viewportWidth,
      viewportHeight,
      mainContent,
      config,
    }) {
      //const containerId = `mapp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const containerId = `mapp-chrome`;
      const container = createContainer(viewportWidth, viewportHeight, mainContent, containerId);
      const appStyleManager = createStyleManager(containerId)
      const engine = new MultiWidgetApplicationEngine(
        module,
        container,
        appStyleManager,
        config,
        initialiseState(module, config, {}),
        module.meta.layout?.gridTemplateColumns?.length ?? 1,
      );

      engine.installWidgets(viewportWidth);

      return engine;
    }
  };
}

/**
 * @template St
 * @template Cfg
 * @template Event
 */
class MultiWidgetApplicationEngine {
  #state;
  #columns

  /** @type {number | null} */
  #animationFrame = null;

  #currentBreakpoint = 'default';

  /** @type {MultiModule<St, Cfg, Event>} */
  module;

  /**
   * @type {Map<string, {
   *   widget: WidgetRunner<St, Cfg>,
   *   container: HTMLElement,
   *   renderStrategy: RenderStrategy,
   *   scalingStrategy: ScalingStrategy,
   *   kind: string,
   *   size?: WidgetSize,
   * }>}
   */
  #widgets = new Map();

  /**
   * @param {MultiModule<St, Cfg, Event>} module
   * @param {HTMLElement} container
   * @param {StyleManager} appStyleManager
   * @param {Cfg} configValues
   * @param {St} state
   * @param {number} columns
   */
  constructor(module, container, appStyleManager, configValues, state, columns) {
    this.module = module;
    this.container = container;
    this.globalStyleElement = null;
    this.appStyleManager = appStyleManager;
    this.configValues = configValues;
    this.#state = state;
    this.#columns = columns;
  }

  /**
   * @param {number} viewportWidth
   */
  installWidgets(viewportWidth) {
    const gridTemplateColumns = this.module.meta?.layout?.gridTemplateColumns?.join(' ');
    const styles = createGlobalStyles(this.container.id, gridTemplateColumns);
    this.globalStyleElement = document.createElement('style');
    this.globalStyleElement.textContent = generateCSS(styles);
    document.head.appendChild(this.globalStyleElement);

    if (this.module.createStyle) {
      this.appStyleManager.applyStyles(this.module.createStyle());
    }

    if (gridTemplateColumns) {
      const breakpoints = this.module.meta?.layout?.breakpoints;
      this.#currentBreakpoint = calculateBreakpoint(viewportWidth, breakpoints);
    }

    this.module.children?.forEach((childSpec, index) => {
      this.installWidget(childSpec, index, viewportWidth);
    });

    this.updateBreakpointStyles();

    renderOnto(this.container, [
      ['hr', { styles: { width: '100%', borderColor: 'transparent' } }],
    ])
  }

  start() {
    for (const { widget } of this.#widgets.values()) {
      widget.render(this.configValues, this.#state);
    }
    this.startRenderLoop();
  }

  /**
   * @param {WidgetChild<unknown, St, Cfg>} childModule
   * @param {number} index
   * @param {number} viewportWidth
   */
  installWidget(childModule, index, viewportWidth) {
    const id = `widget-${index}`;
    const { meta, size } = childModule;

    const widgetContainer = createWidgetContainer(meta.kind);
    const widgetContainerId = `${this.container.id}-${id}`;
    widgetContainer.id = widgetContainerId;

    const widgetFactory = getFactory(childModule);

    // Calculate widget dimensions
    const widgetWidth = viewportWidth;
    const widgetParams = /** @type {ChildWidgetParam} */ ({
      container: widgetContainer,
      containerId: widgetContainerId,
      viewportWidth: widgetWidth
    });

    // Only add height if the widget specifies one
    if (size?.height) {
      widgetParams.viewportHeight = size.height;
    }

    // Create widget with injected container
    const widget = widgetFactory.create(childModule, widgetParams);

    // Check scaling strategy requirements for multi-widget mode
    if (widget.scalingStrategy === 'fixed' && !size?.height) {
      throw new Error(`Widget ${index} (${meta.kind}) has fixed scaling strategy but no height specified. Multi-widget apps require explicit height for fixed-scaling widgets.`);
    }

    widget.initialize((event) => {
      this.handleEvent(/** @type {Event} */ (event), id)
    });

    const hud = widget.getHUD();
    if (hud.header) {
      insertAtStart(widgetContainer, appRender(hud.header, undefined));
    }

    this.#widgets.set(id, {
      widget,
      container: widgetContainer,
      kind: meta.kind,
      renderStrategy: widget.constructor.renderStrategy,
      scalingStrategy: widget.scalingStrategy,
      size,
    });

    if (this.#columns > 1) {
      const gridColumnSpec = childModule.size?.gridColumn;
      const gridColumn = gridColumnSpec?.[this.#currentBreakpoint];

      widgetContainer.style.gridColumn = `span ${gridColumn ?? this.#columns}`;
    }

    this.container.appendChild(widgetContainer);
  }

  startRenderLoop() {
    const hasFrameWidgets = Array.from(this.#widgets.values())
      .some(({ renderStrategy }) => renderStrategy === 'frame');

    if (!hasFrameWidgets) {
      this.renderEventWidgets();
      return;
    }

    /**
     * @param {number} time
     */
    const loop = (time) => {
      const e = /** @type {any} */ ({ kind: 'frame', time });
      this.#state ??= this.module.onUpdate?.(this.#state, e) ?? this.#state;
      for (const { widget, renderStrategy } of this.#widgets.values()) {
        if (renderStrategy !== 'frame') continue;
        widget.render(this.configValues, this.#state);
      }
      this.#animationFrame = requestAnimationFrame(loop);
    };

    this.#animationFrame = requestAnimationFrame(loop);
  }

  renderEventWidgets() {
    for (const { widget, renderStrategy } of this.#widgets.values()) {
      if (renderStrategy !== 'event') continue;
      widget.render(this.configValues, this.#state);
    }
  }

  /**
   * @param {Event} event
   * @param {string} [widgetId]
   */
  handleEvent(event, widgetId = undefined) {
    const enrichedEvent = widgetId != null
      ? ({ ...event, widgetId })
      : event;

    if (this.module.onUpdate) {
      this.#state = this.module.onUpdate(this.#state, enrichedEvent);
    }

    this.renderEventWidgets();
  }

  stop() {
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame);
      this.#animationFrame = null;
    }

    for (const { widget } of this.#widgets.values()) {
      widget.cleanup?.();
    }

    this.#widgets.clear();

    if (this.globalStyleElement && this.globalStyleElement.parentNode) {
      this.globalStyleElement.parentNode.removeChild(this.globalStyleElement);
    }

    this.appStyleManager?.cleanup?.();

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  /**
   * @param {number} newViewportWidth
   */
  resize(newViewportWidth) {
    const vPadding = 64;
    const gridGap = 16;
    const width = newViewportWidth - vPadding;

    this.container.style.width = newViewportWidth + 'px';

    const breakpoints = this.module.meta?.layout?.breakpoints;
    if (breakpoints) {
      const newBreakpoint = calculateBreakpoint(newViewportWidth, breakpoints);
      const breakpointChanged = newBreakpoint !== this.#currentBreakpoint;

      if (breakpointChanged) {
        this.#currentBreakpoint = newBreakpoint;
        this.updateBreakpointStyles();
      }
    }

    for (const { widget, scalingStrategy, size } of this.#widgets.values()) {
      const gridspan = widget.module.size
        ?.gridColumn?.[this.#currentBreakpoint]
        ?? this.#columns;

      const w = (width - gridGap * (this.#columns - gridspan)) * (gridspan / this.#columns);
      if (scalingStrategy === 'fixed' && size?.height) {
        widget.resize?.(w, size.height);
      } else if (scalingStrategy === 'fluid') {
        widget.resize?.(w);
      }
    }
  }

  updateBreakpointStyles() {
    const layout = this.module.meta?.layout;
    if (!layout?.gridTemplateColumns || !layout?.breakpoints) return;

    for (const [_widgetId, { widget, container }] of this.#widgets) {
      const gridColumnSpec = widget.module.size?.gridColumn;
      if (!gridColumnSpec) continue;

      const gridColumn = `span ${gridColumnSpec[this.#currentBreakpoint] ?? this.#columns}`;
      container.style.gridColumn = gridColumn;
    }
  }

  /**
   * @param {Cfg} config
   * @param {string[]} source
   */
  updateConfig(config, source) {
    const event = /** @type {Event} */ ({ kind: 'config', config, source });
    this.configValues = config;
    this.handleEvent(event);
  }

  /**
   * @returns {readonly WidgetAnchor[]}
   */
  getAnchors() {
    return Array.from(this.#widgets.values()).flatMap(w => {
      return w.widget.getAnchors();
    });
  }
}

/**
 * @param {number} containerWidth
 * @param {Record<string, number> | undefined} breakpoints
 * @returns {string}
 */
function calculateBreakpoint(containerWidth, breakpoints) {
  if (!breakpoints) return 'default';

  const sortedBreakpoints = Object.entries(breakpoints)
    .sort(([, a], [, b]) => b - a); // Sort descending by breakpoint value

  for (const [name, maxWidth] of sortedBreakpoints) {
    if (containerWidth <= maxWidth) {
      return name;
    }
  }

  return 'default';
}

/**
 * @param {string} containerId
 * @param {string | undefined} gridTemplateColumns
 */
function createGlobalStyles(containerId, gridTemplateColumns) {

  return {
    [`#${containerId}`]: {
      display: 'grid',
      gridAutoFlow: 'row',
      gridAutoRows: 'auto',
      padding: 32,
      gap: 16,
      width: '100%',
      gridTemplateColumns,
      alignContent: 'start',
    },
    [`#${containerId} canvas`]: {
      display: 'block',
      border: 'solid 2px #666',
    }
  };
}

/**
 * @param {string} kind
 */
function createWidgetContainer(kind) {
  const container = document.createElement('div');
  container.className = `widget-container ${kind.toLowerCase()}`;
  return container;
}

/**
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @param {HTMLElement} mainContent
 * @param {string} containerId
 */
function createContainer(viewportWidth, viewportHeight, mainContent, containerId) {
  const container = document.createElement('div');
  container.id = containerId;
  container.style.width = viewportWidth + 'px';
  container.style.height = viewportHeight + 'px'; // Use as min-height for multi-widget layout
  container.style.position = 'relative';

  mainContent.appendChild(container);

  return container;
}
