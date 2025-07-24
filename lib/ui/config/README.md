# Configuration System

This directory implements the application configuration system with interactive knob controls, following RFC 006 patterns. The system provides a hierarchical, event-driven architecture for managing application settings through web components.

## Architecture Overview

### Core Components

- **`create.js`**: Main ConfigComponent that manages the configuration panel
- **`knob-factory.js`**: Factory function for creating knob instances from configuration objects
- **`knobs/`**: Individual knob implementations (NumberKnob, ColorKnob, GroupKnob, etc.)
- **`common/`**: Shared utilities (layout helpers, label component)
- **`../inputs/`**: Reusable input components used by knobs

### Event Flow

```
User Interaction � Input Component � Knob � ConfigComponent � Application
                    (change)       (changeKnob)   (configChange)
```

## Knob Implementation Conventions

All knobs follow a consistent pattern based on RFC 006 specifications:

### Constructor Pattern

```javascript
export class ExampleKnob extends HTMLElement {
  constructor(cfg, label, value) {
    super();
    this.attachShadow({ mode: 'open' });
    this.label = label;  // ConfigKnobLabel instance or null
    this.#config = cfg;
    this.#value = value || defaultValue;
  }
}
```

**Parameters:**
- `cfg`: Configuration object containing knob-specific settings (e.g., `range`, `group`)
- `label`: ConfigKnobLabel web component instance (or `null` if no label)
- `value`: Initial value from the `of` field in configuration

### Lifecycle Methods

#### 1. `setup()` - Required
Called after construction to initialize child components and inputs:

```javascript
setup() {
  // Create child inputs or knobs
  this.#input = new SomeInput(this.#value, ...config);
  
  // For group knobs: create child knobs
  for (const [key, childConfig] of Object.entries(this.#config.group)) {
    const child = createKnob(childConfig, key);
    child.setup();
    child.dataset.key = key;
    this.#children.push(child);
  }
}
```

#### 2. `connectedCallback()` - Web Component Standard
Set up rendering and event listeners:

```javascript
connectedCallback() {
  this.render();
  this.shadowRoot.addEventListener('change', (e) => {
    // Handle input changes
  });
  this.shadowRoot.addEventListener('changeKnob', (e) => {
    // Handle child knob changes (for group knobs)
  });
}
```

#### 3. `render()` - Required
Update the shadow DOM using `updateOn`:

```javascript
render() {
  updateOn(this.shadowRoot, [
    ['style', {}, [getStyles()]],
    ['div', { class: 'container' }, [
      this.label && ['config-knob-label', {}, [this.label]],
      this.#input || this.#childElement
    ]]
  ]);
}
```

#### 4. `gridColumn()` - Required
Return the number of grid columns this knob should span:

```javascript
gridColumn() {
  return 4; // or 8 for full width, calculated for groups
}
```

### Event Handling Pattern

#### Input Events � Knob Events
Knobs listen for `change` events from their input components and transform them into `changeKnob` events:

```javascript
this.shadowRoot.addEventListener('change', (e) => {
  this.#value = e.detail.value;
  this.dispatchEvent(new CustomEvent('changeKnob', {
    detail: { value: this.#value },
    bubbles: true
  }));
});
```

#### Child Knob Events (Group Knobs)
Group knobs listen for `changeKnob` events from children and aggregate them:

```javascript
this.shadowRoot.addEventListener('changeKnob', (e) => {
  const { target: { dataset: { key } }, detail: { value } } = e;
  this.#currentValue[key] = value;
  this.dispatchEvent(new CustomEvent('changeKnob', {
    detail: { value: { ...this.#currentValue } },
    bubbles: true
  }));
});
```

### Dataset Key Pattern
All knobs receive a `dataset.key` attribute for identification in the event system:

```javascript
// In parent component (ConfigComponent or GroupKnob)
child.dataset.key = key;

// In event handler
const { target: { dataset: { key } }, detail: { value } } = e;
```

## Layout System

### Grid-Based Layout
The system uses CSS Grid with 8 columns. Knobs specify their width via `gridColumn()`:

```javascript
// lib/ui/config/common/layout.js
export const configGridLayout = (gridSize) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
  gridGap: 16,
  gridAutoRows: 'auto',
});

export function formatChildren(children) {
  return children.map(c => (
    ['div', { styles: { gridColumn: `span ${c.gridColumn()}` } }, [c]]
  ));
}
```

### Common Grid Spans
- **Number knobs**: 8 columns (full width)
- **Color knobs**: 4 columns (half width)
- **Group knobs**: Maximum of child spans
- **Complex knobs**: 8 columns (full width)

## Standard Knob Types

### NumberKnob
- **Input**: `NumberInput` (slider + number field)
- **Config**: `{ kind: 'number', range: [min, max], of: defaultValue }`
- **Grid span**: 8 columns

### ColorKnob
- **Input**: `ColorInput` (color picker)
- **Config**: `{ kind: 'color', of: 0xff0000 }`
- **Grid span**: 4 columns

### GroupKnob
- **Children**: Other knobs defined in `group` field
- **Config**: `{ kind: 'group', group: {...}, of: {...} }`
- **Grid span**: Maximum of children
- **Features**: Recursive knob creation, aggregated value handling

### ManyKnob
- **Input**: `TextInput` for creating new items
- **Children**: Dynamically created knobs based on `create` function
- **Config**: `{ kind: 'many', create: (id) => knobConfig, of: {...} }`
- **Grid span**: 8 columns
- **Features**: Dynamic child creation/deletion, collapsible details view, delete buttons integrated with labels

### ComplexKnob (planned)
- **Inputs**: `SquareInput` + two `NumberInput` components
- **Config**: `{ kind: 'complex', range: [min, max], of: complexNumber }`
- **Grid span**: 8 columns

## Label System

Shared label component for consistent styling and button integration:

```javascript
// Created by knob factory
const labelElement = label && new ConfigKnobLabel(label);

// Usage in render - label is now a web component instance
this.label  // Direct web component inclusion

// Button integration (for ManyKnob delete buttons)
this.label.installButton(deleteButton);
```

The `ConfigKnobLabel` component:
- Handles text display with consistent styling
- Supports button integration for complex interactions
- Uses Shadow DOM for style isolation
- Forwards click events when buttons are installed

## Configuration Schema

### Basic Knob Config
```javascript
{
  kind: 'number',        // Knob type
  label: 'Scale',        // Display label (optional, defaults to key)
  of: 1.0,              // Default value
  range: [0.1, 5.0]     // Type-specific config
}
```

### Group Config
```javascript
{
  kind: 'group',
  label: 'Transform',
  group: {               // Child knob definitions
    scale: { kind: 'number', range: [0.1, 5.0] },
    color: { kind: 'color' }
  },
  of: {                 // Default values for children
    scale: 1.0,
    color: 0xff0000
  }
}
```

### Many Config
```javascript
{
  kind: 'many',
  label: 'Actors',
  create: (id) => ({     // Function that creates child config
    kind: 'group',
    label: `Actor ${id}`,
    group: {
      position: { kind: 'complex', range: [0.1, 10] },
      color: { kind: 'color' }
    },
    of: {
      position: c(1, 1),
      color: 0xff0000
    }
  }),
  of: {                 // Initial children
    alice: { position: c(2, 3), color: 0x00ff00 },
    bob: { position: c(1, 2), color: 0x0000ff }
  }
}
```


## Creating New Knobs

### 1. Create Knob Class
Follow the standard pattern in `knobs/your-knob.js`:

```javascript
export class YourKnob extends HTMLElement {
  constructor(cfg, label, value) { /* ... */ }
  setup() { /* Create inputs */ }
  connectedCallback() { /* Setup events */ }
  render() { /* Update DOM */ }
  gridColumn() { return 8; }
}

customElements.define('config-your-knob', YourKnob);
```

### 2. Add to Factory
Update `knob-factory.js`:

```javascript
import { YourKnob } from './knobs/your-knob.js';

function createKnob(cfg, key) {
  // ...
  switch (cfg.kind) {
    case 'your-type':
      return new YourKnob(cfg, label, value);
    // ...
  }
}
```

### 3. Create Input Component (if needed)
Add reusable input in `../inputs/your-input.js` following the input conventions:
- Web component with shadow DOM
- `observedAttributes` for attribute changes
- `change` event dispatch on user interaction
- `setValue()` and `getValue()` methods

## Best Practices

1. **Separation of Concerns**: Inputs handle UI interaction, knobs handle configuration logic
2. **Event Bubbling**: Use `bubbles: true` for all `changeKnob` events
3. **Immutable Updates**: Always create new objects when updating values
4. **Grid Awareness**: Consider layout impact when designing knobs
5. **Label Consistency**: Use the shared label component
6. **Dataset Keys**: Always set `dataset.key` for event identification
7. **Setup Pattern**: Initialize expensive operations in `setup()`, not constructor