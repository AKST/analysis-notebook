# Document Widget System

The document widget system provides a way to create interactive web applications using HTML, MathML, and SVG through a simple declarative syntax. Supports state management, event handling, efficient DOM updates, and nested CSS.

This is part of the Factory + Engine + Widget architecture where document widgets handle rendering while application engines manage state and lifecycle. Document widgets use **fluid scaling strategy** - height flows naturally without explicit constraints.

## Overview

Document apps can be static or interactive, supporting everything from mathematical formulas to interactive forms. They use a lightweight array-based syntax to define DOM structure, scoped CSS with nesting support, and an event system for user interactions.

```
document/
├── create.js         # Document widget factory and implementation
├── element.js        # DOM rendering and efficient updating
├── events.js         # Event registry and management system
├── style-manager.js  # CSS management with nested styles
└── README.md        # This file
```

## App Module Interface

Document apps work with the widget system through a consistent interface. The application engine manages state while the document widget handles rendering.

**Scaling Strategy**: Document widgets use `fluid` scaling - they flow naturally without height constraints. This makes them ideal for multi-widget layouts where content length varies.

### Required Exports

```javascript
export const meta = { kind: 'document' };

export function render(context, state) {
  // Return document specification using array format
  // Context is widget-specific, state is managed by application engine
  // State may be undefined for static apps
  return ['div', [
    ['h1', ['Hello World']],
    ['p', ['This is a document app']],
  ]];
}
```

### Optional Exports

```javascript
export function createContext() {
  // Initialize app context (optional - can return empty object or omit entirely)
  return {};
}

export function createState() {
  // Initialize app state (optional - omit for static apps)
  return { count: 0, name: 'Example' };
}

export function onUpdate(state, event) {
  // Handle events and return new state (managed by application engine)
  // Required if app has interactive elements
  // Must return a state object - returning undefined will throw an error
  switch (event.kind) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'reset':
      return { ...state, count: 0 };
    default:
      return state; // Handle unrecognized events
  }
}

export function createStyle() {
  // Return styles object for scoped CSS with nesting support
  return {
    '.container': {
      width: '100%',
      padding: '2rem',
      'button': {          // Nested CSS
        padding: [8, 16],
        border: 'none',
        '&:hover': {       // Future: pseudo-selectors
          backgroundColor: 'blue'
        }
      }
    }
  };
}

export function getConfig() {
  // Return configuration knobs for the app (optional)
  // See lib/ui/config/README.md for knob configuration details
  return {
    scale: { kind: 'number', range: [0.1, 2.0], of: 1.0 },
    color: { kind: 'color', of: 0xff0000 },
    settings: {
      kind: 'group',
      group: {
        speed: { kind: 'number', range: [0.1, 5.0] },
        enabled: { kind: 'boolean' }
      },
      of: { speed: 1.0, enabled: true }
    }
  };
}
```

## Document Specification Format

Document content is specified using a simple array format with support for attributes and events:

### Basic Structure
- `[tagName, [children...]]` - Element with children
- `[tagName, attributes, [children...]]` - Element with attributes and children
- `"text content"` - Text nodes

### Attributes Object
The attributes object can contain:
- `className` - CSS class name
- `events` - Event handlers object
- Future: `id`, `data-*`, etc.

### Examples

```javascript
// Simple text
"Hello World"

// Element with class
['div', { className: 'container' }, ['Content']]

// Interactive button
['button', {
  className: 'btn',
  events: {
    click: { kind: 'increment' }
  }
}, ['Click me']]

// Complex nested structure
['div', { className: 'app' }, [
  ['h1', ['Interactive Counter']],
  ['p', [`Count: ${state.count}`]],
  ['div', { className: 'buttons' }, [
    ['button', {
      events: { click: { kind: 'increment' } }
    }, ['+']], 
    ['button', {
      events: { click: { kind: 'reset' } }
    }, ['Reset']]
  ]]
]]
```

### Event System

Events are specified in the `events` attribute:

```javascript
{
  events: {
    click: { kind: 'button-clicked', data: 'extra-info' },
    submit: { kind: 'form-submitted' },
    change: { kind: 'input-changed' }
  }
}
```

When triggered, the event object is passed to the application engine, which calls the app's `onUpdate(state, event)` and re-renders the widget.

## Style System

### Style Object Format

Styles are defined as nested objects where:
- **Keys** are CSS selectors (relative to container)
- **Values** are CSS property objects

```javascript
{
  div: {              // Selects: #container-id div
    width: 600,       // Becomes: width: 600px
    padding: '2rem',  // Becomes: padding: 2rem
    margin: [10, 20], // Becomes: margin: 10px 20px
  },
  '.highlight': {     // Selects: #container-id .highlight
    backgroundColor: 'yellow'
  }
}
```

### Value Processing Rules

- **Strings**: Used as-is (`'2rem'` → `'2rem'`)
- **Numbers**: Add 'px' suffix unless zero (`24` → `'24px'`, `0` → `'0'`)
- **Arrays**: Join with spaces (`[10, 20]` → `'10px 20px'`)

### Scoping

All styles are automatically scoped to the document widget's container:
- `div` becomes `#widget-container-xyz div`
- `.class` becomes `#widget-container-xyz .class`
- `p.intro` becomes `#widget-container-xyz p.intro`

## Architecture

### Factory + Widget Pattern
The document widget factory (`createDocumentWidgetFactory`) creates:
- Unique container ID for style scoping
- DOM container element with overflow handling
- StyleManager instance for CSS management
- EventManager for event delegation
- DocumentWidget instance with dependencies injected

### Widget Lifecycle
1. **Constructor**: Receives module and dependencies (container, styleManager, eventManager)
2. **initialize()**: 
   - Creates app context via `createContext()`
   - Applies styles via `createStyle()` (if present)
   - Sets up event delegation
3. **render(state)**: 
   - Renders document via `render(context, state)`
   - Updates DOM efficiently using element diffing
   - Registers event listeners
4. **resize(width, height)**: 
   - Updates container width (required)
   - Height parameter optional due to fluid scaling strategy
   - Content flows naturally to determine height
5. **cleanup()**: 
   - Removes CSS styles from `<head>`
   - Cleans up event listeners

### Application Engine Coordination
The application engine:
- Creates shared state via app's `createState()`
- Handles events through widget's event system
- Updates state via app's `onUpdate()` and triggers widget re-render
- Manages widget lifecycle (start/stop/resize)
- Handles configuration panel integration via `getConfig()` and config change events

### Style Management
The StyleManager class:
- Creates `<style>` element in document head
- Converts style objects to CSS rules using `insertRule()`
- Automatically scopes selectors with container ID
- Cleans up styles on app shutdown

## Document Rendering

The `renderDocument()` function converts array specifications to DOM elements:

```javascript
function renderDocument(spec) {
  if (typeof spec === 'string') {
    return document.createTextNode(spec);
  }
  
  const [tagName, children] = spec;
  const element = document.createElement(tagName);
  
  if (children) {
    for (const child of children) {
      element.appendChild(renderDocument(child));
    }
  }
  
  return element;
}
```

## Error Handling

- **Container conflicts**: Throws if previous app wasn't cleaned up properly
- **Invalid specs**: Validates document specification format
- **Style cleanup**: Ensures CSS is removed on app shutdown

## Use Cases

Document widgets are ideal for:
- Mathematical notation (MathML)
- Static diagrams (SVG) 
- Explanatory text and documentation
- Interactive content that doesn't require animation loops
- Content that benefits from semantic HTML structure
- Multi-widget apps where some widgets need DOM-based rendering
- Variable-height content that should flow naturally
- Forms, text-heavy content, and responsive layouts

## Adding Document Apps

1. Create app file following naming convention
2. Export `meta = { kind: 'document' }`
3. Implement required function: `render(context, state)`
4. Optionally implement `createContext()`, `createState()`, `onUpdate()`, `createStyle()`, `getConfig()`
5. Add entry to navigation menu
6. For multi-widget apps: No height specification needed (fluid scaling)
7. Content will flow naturally and determine its own height

Example app structure:

```javascript
export const meta = { kind: 'document' };

export function createContext() {
  return { title: 'My Document App' };
}

export function createState() {
  return { count: 0 };
}

export function onUpdate(state, event) {
  if (event.kind === 'increment') {
    return { ...state, count: state.count + 1 };
  }
  return state;
}

export function createStyle() {
  return {
    div: {
      maxWidth: 800,
      margin: [0, 'auto'],
      padding: '2rem'
    }
  };
}

export function render(context, state) {
  return ['div', [
    ['h1', [context.title]],
    ['p', [`Count: ${state?.count || 0}`]],
    ['button', {
      events: { click: { kind: 'increment' } }
    }, ['Click me']]
  ]];
}
```