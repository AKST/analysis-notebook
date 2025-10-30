# Read me

## Architecture Overview

Interactive visualization framework using Canvas2D and Document widgets with responsive layout. Apps define configurations that are evaluated to values and passed to render functions.

### Core Systems

- **Engines**: Coordinate app lifecycle (single/multi widget)
- **Widgets**: Canvas2D (frame rendering) and Document (event rendering)
- **Configuration**: Pure evaluation pipeline from knob specs to values
- **Skeleton**: Responsive layout coordination between menus and app space
- **Navigation**: URL routing and hierarchical menu system

## App Principles

### Configuration vs State
- **Config**: Direct values passed to render(), updates trigger re-render automatically
- **State**: Optional derived calculations, `{ kind: 'config', config }` events bridge config to state
- **Key Principle**: Config updates don't require events - events only for state that depends on config

### App Module Structure

Each app must export a `meta` object identifying its type and the required functions for that type:

#### Canvas2D Apps
```javascript
export const meta = {
  kind: 'Canvas2d',
  proj: { kind: 'transform', origin: [0, -2], scale: 2 } // Optional projection constraints
};

export function render(context, state, config) {
  // Pure function: render current state
  // Use context.renderer and context.viewport for drawing
}
```

#### Document Apps

```javascript
export const meta = { kind: 'document' };

export function render(context, state, config) {
  // Return document specification using array format
  return ['div', { className: 'container' }, [
    ['h1', ['Interactive Counter']],
    ['p', [`Count: ${state?.count || 0}`]],
    ['button', {
      events: { click: { kind: 'increment' } }
    }, ['Click me']]
  ]];
}
```

#### Multi-Widget Apps
```javascript
export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 }  // Container width breakpoints
  }
};


export const children = [
  {
    meta: { kind: 'document' },
    render(context, state) { /* ... */ }
  },
  {
    size: {
      height: 400,
      gridColumn: {
        default: 1,  // Spans remaining 1 column
        s: 2         // Full width on small screens
      }
    },
    meta: { kind: 'Canvas2d', proj: { kind: 'transform', origin: [0, -2], scale: 2 } },
    header: ['h4', 'Hello world'],
    render(context, state) { /* ... */ }
  }
];
```

