/**
 * @import {
 *   ChildWidgetParam,
 *   MultiEngineFactory,
 *   EngineRunner,
 *   RenderStrategy,
 *   ScalingStrategy,
 *   MultiModule,
 *   WidgetAnchor,
 *   WidgetRunner,
 *   WidgetFactory,
 *   WidgetChild,
 *   WidgetSize,
 * } from '../type.ts';
 * @import { StyleManager } from '../widget/document/style-manager.js';
 * @import { StyleService } from '../service/style/type.ts';
 */
import { createStyleManager } from '../widget/document/style-manager.js';
import { generateCSS, renderOnto } from '../../../base/dom_ui/index.js';
import { insertAtStart } from '../../util/dom.js';
import { renderDocument as appRender } from '../../../base/dom_app/index.js';
import { initialiseState, getFactory } from './util.js';

/**
 * @param {{
 *   services: {
 *     style: StyleService,
 *   },
 * }} options
 * @returns {MultiEngineFactory} */
export function createMultiWidgetApplicationFactory({ services }) {
  return {
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
        services.style,
        appStyleManager,
        config,
        // @ts-ignore - its fine
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
 * @implments {EngineRunner<Cfg>}
 */
class MultiWidgetApplicationEngine {
  #state;
  #columns

  /** @type {StyleService} */
  #styleService

  /** @type {number | null} */
  #animationFrame = null;

  #currentBreakpoint = 'default';

  #lifecycles = {
    ready: Promise.withResolvers(),
    closed: Promise.withResolvers(),
  };

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
   * @param {StyleService} styleService
   * @param {StyleManager} appStyleManager
   * @param {Cfg} configValues
   * @param {St} state
   * @param {number} columns
   */
  constructor(
    module,
    container,
    styleService,
    appStyleManager,
    configValues,
    state,
    columns,
  ) {
    this.module = module;
    this.container = container;
    this.#styleService = styleService;
    this.appStyleManager = appStyleManager;
    this.configValues = configValues;
    this.#state = state;
    this.#columns = columns;
  }

  get ready () { return this.#lifecycles.ready.promise; }
  get closed () { return this.#lifecycles.closed.promise; }

  /**
   * @param {number} viewportWidth
   */
  installWidgets(viewportWidth) {
    const gridTemplateColumns = this.module.meta?.layout?.gridTemplateColumns?.join(' ');
    if (gridTemplateColumns) {
      this.container.style.setProperty('--multi-app-gridTemplateColumns', gridTemplateColumns);
    }

    const { sheets } = this.module.meta;

    if (sheets) {
      const promises = sheets.map(url => (
        this.#styleService.installStyleSheet({ url })
      ));
      Promise.all(promises).then(() => {
        this.#lifecycles.ready.resolve(undefined);
      }, error => {
        this.#lifecycles.ready.reject(error);
      });
    } else {
      this.#lifecycles.ready.resolve(undefined);
    }

    if (this.module.createStyle) {
      this.appStyleManager.applyStyles(this.module.createStyle());
    }
    if (this.appStyleManager.styleElement) {
      this.container.appendChild(this.appStyleManager.styleElement);
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
      widget.render(this.configValues, this.#state, undefined);
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
      this.renderEventWidgets(undefined);
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
        widget.render(this.configValues, this.#state, e);
      }
      this.#animationFrame = requestAnimationFrame(loop);
    };

    this.#animationFrame = requestAnimationFrame(loop);
  }

  /**
   * @param {Event | undefined} event
   */
  renderEventWidgets(event) {
    for (const { widget, renderStrategy } of this.#widgets.values()) {
      if (renderStrategy !== 'event') continue;
      widget.render(this.configValues, this.#state, event);
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

    this.renderEventWidgets(enrichedEvent);
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

    this.appStyleManager?.cleanup?.();

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    const { sheets } = this.module.meta;
    if (sheets) {
      const promises = sheets.map(url => (
        this.#styleService.uninstallStyleSheet({ url })
      ));

      Promise.all(promises).then(() => {
        this.#lifecycles.closed.resolve(undefined);
      }, error => {
        this.#lifecycles.closed.reject(error);
      });
    } else {
      this.#lifecycles.closed.resolve(undefined);
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
  const container = document.createElement('article');
  container.id = containerId;
  container.className = 'multi';
  container.style.width = viewportWidth + 'px';
  container.style.position = 'relative';

  mainContent.appendChild(container);

  return container;
}
