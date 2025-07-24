# Application Architecture

This directory contains the application engine system that manages different types of apps in the complex analysis visualization environment.

## Overview

The architecture uses a **Factory + Engine** pattern to support multiple app types with consistent lifecycle management.

```
create.js           # Main coordinator - handles app loading and layout
├── engine/
│   └── single.js   # Single widget application engine
└── widget/         # Widget factories and implementations
    ├── canvas.js   # Canvas2D widget factory and implementation
    └── document/   # Document widget system
        └── create.js # Document widget factory and implementation
```

## Architecture Pattern

### Application Coordinator (`create.js`)
- Manages responsive layout and window resize handling
- Loads app modules and determines their type via `meta.kind`
- Uses single widget application factory to create engines
- Handles app lifecycle (loading, switching, cleanup)

### Factory + Engine + Widget Pattern

#### Application Engines (`engine/single.js`)
Manage state, lifecycle, and coordination:
- `start()` - Create shared state, initialize widgets, begin execution
- `stop()` - Clean up animation frames, widgets, and DOM elements
- `resize(width, height)` - Pass resize events to widgets
- Handle animation loops via `requestAnimationFrame`
- Own and manage application state via `createState()` and `onUpdate()`
- Coordinate between shared state and widget-specific rendering

#### Widget Factories (`widget/*.js`)
Create widgets with injected dependencies:
- Create rendering dependencies (canvas, containers, DOM elements)
- Instantiate widget implementations with dependencies injected
- Handle resource creation and initial DOM setup

#### Widget Implementations
Handle app-specific rendering:
- Own rendering context (renderer/viewport for Canvas, DOM containers for Document)
- Provide consistent `render(context, state)` interface across widget types
- Handle widget-specific resize concerns (viewport recalculation, container sizing)
- Focus purely on rendering, delegate state management to engines

## App Types

### Canvas2D Apps (`widget/canvas.js`)
For interactive complex analysis visualizations using HTML5 Canvas.

**Widget Factory creates:**
- Canvas element with high DPI support
- CanvasRenderer abstraction
- ComplexViewport for coordinate mapping
- ViewportConstraints for responsive sizing
- Canvas widget instance with injected dependencies

**Canvas Widget manages:**
- Rendering context (renderer, viewport, constraints)
- Context creation via app's `createContext({ renderer, viewport })`
- Pure rendering via `render(context, state)`
- Canvas-specific resize handling and viewport recalculation
- Widget-level viewport constraints (each widget can have different complex plane coverage)

**Application Engine manages:**
- Animation loop via `requestAnimationFrame`
- Shared application state and state updates
- Coordination between state updates and widget rendering

### Document Apps (`widget/document/create.js`)
For interactive content using HTML, MathML, and SVG. See `document/README.md` for detailed documentation.

**Document Widget Factory creates:**
- Unique container ID for style scoping
- Container div with overflow handling
- StyleManager for scoped CSS
- EventManager for event delegation
- Document widget instance with injected dependencies

**Document Widget manages:**
- Rendering context (container, style manager, eventManager)
- Document rendering from array specifications via `render(context, state)`
- Style application and cleanup via StyleManager
- Container resize handling
- Event registration and DOM diffing via EventManager
- Configuration panel integration via `getConfig()` support

**Application Engine manages:**
- Event handling and state updates via `onUpdate()`
- Event-driven re-rendering coordination
- Shared application state management
- Configuration change handling and state updates

## App Module Interface

### Canvas2D Apps
```javascript
export const meta = { kind: 'Canvas2d' };
export function createContext({ renderer, viewport }) { /* ... */ }
export function createState() { /* ... */ }
export function onUpdate(state, event) { /* ... */ }
export function render(context, state) { /* ... */ }
```

### Document Apps
```javascript
export const meta = { kind: 'document' };
export function createContext() { /* ... */ }
export function createState() { /* ... */ }
export function onUpdate(state, event) { /* ... */ }
export function render(context, state) { 
  return ['div', [['h1', ['Hello']], ['p', ['World']]]];
}
export function createStyle() { /* optional - see document/README.md */ }
export function getConfig() { /* optional - returns knob configuration */ }
```

## Lifecycle

1. **App Loading**: Coordinator loads module and checks `meta.kind`
2. **Engine Creation**: Single widget application factory creates engine with appropriate widget
3. **Widget Creation**: Widget factory creates widget with injected dependencies (canvas/containers)
4. **Engine Start**: Engine creates shared state, initializes widget with context, begins execution
5. **Rendering**: Widgets handle pure rendering, engines handle state and lifecycle coordination
6. **Resize Events**: Coordinator passes resize events to engine, which delegates to widget
7. **App Switching**: Current engine stopped/cleaned up, new engine and widget created
8. **Engine Stop**: Animation frames cancelled, widget cleanup, DOM elements removed

## Dependency Injection

All dependencies are created by widget factories and injected into widgets:
- **Canvas2D**: `{ canvas, renderer, viewport, constraints }`
- **Document**: `{ container, styleManager, eventManager }`
- **Engines**: Receive widgets and coordinate their lifecycle

This separation ensures widgets focus on rendering while engines manage state and coordination. Each widget owns its rendering context and can have different configurations (e.g., different viewport constraints).

## Error Handling

- Widget factories throw if previous apps weren't properly cleaned up
- Widgets validate required app module exports
- Engines handle state validation and event processing
- Coordinator catches and logs app loading errors
- Unsupported widget types throw descriptive errors

## Adding New App Types

1. Create new widget factory file (e.g., `widget/webgl.js`)
2. Export widget factory with `create(module, { container, containerId, viewportWidth, viewportHeight })` method
3. Implement widget with `initialize()`, `render(context, state)`, `resize()` methods
4. Add static `renderStrategy` (`'frame'` or `'event'`) and `scalingStrategy` (`'fixed'` or `'fluid'`) fields
5. Add widget factory to engine switch statements in both `engine/single.js` and `engine/multi.js`
6. Define app module interface with consistent `render(context, state)` signature
7. For fixed-scaling widgets, validate height requirements in multi-widget mode
8. Update documentation with widget-specific context and rendering concerns