# CLAUDE.md

This file provides guidance for maintaining the visualization framework infrastructure.

## Widget Systems

### Configuration Independence
Config passed directly to `render(context, state, config)`. Events only needed for state derived from config.

### Canvas Pipeline
- **CanvasRenderer**: Wraps 2D context with complex-plane methods
- **ViewportConstraints**: Maps complex coordinates to pixels, efficient resize via `updateCanvasAndViewport()`

### Document Pipeline
- **Virtual DOM**: `renderDocument()` for creation, `updateElement()` for updates
- **Event Management**: Registry handles cleanup and re-binding

### Multi-Widget Responsive Grid (RFC 001)
- **Grid Configuration**: Apps define `gridTemplateColumns` array and breakpoints in `meta.layout`
- **Span-Based Positioning**: Widgets specify column spans (numbers) instead of CSS grid positions
- **Dynamic Width Calculation**: Widget widths calculated based on grid span and available container space
- **Breakpoint Management**: Container width-based breakpoints trigger layout updates
- **Efficient Updates**: Only recalculates grid positioning when breakpoint thresholds are crossed

## App Development Conventions

### Dependency Injection Pattern

- **Renderer + Viewport**: All rendering classes take `(renderer, viewport)` as constructor parameters
- **Context Creation**: Apps receive `{ renderer, viewport }` and create needed components
- **No Globals**: All dependencies passed explicitly through constructors/parameters

### Rendering Patterns

- Use `clearCanvas(renderer, viewport, shouldClear)` from `lib/2d/util.js`
- Colors specified as hex integers (e.g., `0xff0000` for red)
- Coordinate conversion handled by viewport: `viewport.toCanvas(complexNumber)`
- High DPI support handled automatically by application layer

## Responsive Layout System

#### Layout Detection
- **Wide Layout**: Default for desktop/tablets (width ≥ 600px AND height ≤ 1.5 × width)
- **Narrow Layout**: Mobile/portrait mode (width < 600px OR height > 1.5 × width)

#### Canvas Sizing
- **Wide Layout**: CSS Grid with 311px navigation column and remaining space for canvas
- **Narrow Layout**: Canvas width = screen width, navigation hidden (overlay when opened)

#### Viewport Constraints
- **Minimum Coverage**: Always shows at least 16×16 complex plane units
- **Aspect Adaptation**: Expands bounds to fill canvas while keeping origin centered
- **Dynamic Updates**: `ViewportConstraints.updateCanvasAndViewport()` handles resize without recreating objects

## Development

This is a static site that runs directly in the browser - no build process required. Simply open `index.html` in a web browser.

The project uses:
- ES6 modules with native browser support
- HTML5 Canvas API with high DPI support
- CSS-based responsive layout
- No external dependencies or frameworks
- Dynamic imports for lazy-loaded app modules

### Adding New Apps

1. Create `index.js` file following hierarchical directory structure:
   - Complex Analysis: `lib/app/sec-c/sec-X/index.js`
   - ECON1101: `lib/app/sec-1101/sec-X/index.js`
   - Debug/Development: `lib/app/sec-d/sec-X/index.js`
2. Export `meta` object with app type and optional functions as defined by TypeScript interfaces in `lib/ui/application/type.ts`
4. Add entry to menu structure in `lib/ui/navigation/create.js` under appropriate section (c, 1101, or d)
5. Use `renderPlaceholder()` for quick Canvas2D placeholders
6. For multi-widget apps: Canvas widgets must specify `size: { height: number }` in children array

### System Architecture Notes

## Navigation System

### Current Implementation
- **URL Routing**: `generateAppPath()` maps IDs to file paths (`c.1.1` → `./lib/app/sec-c/sec-1/index.js`)
- **DOM Updates**: Uses `render()` utility, hierarchical menu with auto-expansion
- **Browser Integration**: `pushState()` for history, URL parameter loading

### Technical Debt & Migration
- **Current**: `innerHTML` updates, direct event handler attachment
- **Target**: `updateElement()` for cleanup, event delegation pattern, Shadow DOM isolation
- **Priority**: Remove direct handlers → consistent DOM management → style encapsulation

## Viewport Constraints

### Core System
`ViewportConstraints` maps complex plane to canvas pixels with guarantees:
- **Minimum Coverage**: Always shows specified area (default 16×16)
- **Aspect Preservation**: Expands bounds proportionally
- **Origin Stability**: Keeps origin centered

### Performance
- `updateCanvasAndViewport()`: Efficient resize without object recreation
- High DPI handling and bidirectional coordinate mapping
- Per-widget constraints for different mathematical coverage
## Code Patterns

- Complex numbers use immutable operations (methods return new instances)
- Use dependency injection: pass dependencies as constructor parameters rather than creating them within constructors
- All rendering classes take `(renderer, viewport)` as constructor parameters
- Colors are specified as hex integers (e.g., `0xff0000` for red)
- Animation loops use pure functions for state updates and rendering
- Factory functions return objects with clear interaction points
- URL routing and responsive behavior handled by UI layer
- Use american english in code and british english in documentation.

### Code Style

- use trailing commas in multiline Objects and arrays
- use `== null` to check for both null and undefined

### CSS
- grid is preferred over flex.
- Use transform over position absolute, as it does not cause reflows.
  Especailly for animations.

## TypeScript Integration

### Typing Strategy
The codebase uses a JSDoc + TypeScript hybrid approach:
- **JavaScript Implementation**: `.js` files with JSDoc type annotations
- **Type Definitions**: Co-located `.ts` and `.d.ts` files alongside implementations
- **Type Imports**: `@import` statements to reference TypeScript types in JSDoc
- **Type Assertions**: `@type` annotations for complex expressions
- **Generics**: `@template` for generic type parameters in JSDoc

### File Organization
- Types distributed throughout codebase, not centralized
- Module-level `type.ts` files (e.g., `lib/app/sec-1101/sec-1/type.ts`)
- Shared types in `prelude-type.ts` files
- Interface definitions in `lib/ui/application/type.ts` for core application patterns

### Type Declaration Conventions
- **No Inline Types**: Avoid inline object types in function signatures - use `@typedef` or named types
- **Top-level @import**: All type imports declared at file top, never inline in JSDoc
- **Config Object Types**: Always create dedicated `@typedef` for config parameters rather than inline object literals
- **Named References**: Function signatures reference named types, not anonymous object shapes
- **Defensive Type Checking**: Use `instanceof` checks and optional chaining (`?.`) for DOM interactions
- **Single Event Casting**: Cast events once per handler: `const event = /** @type {any} */ (e)`

**Preferred:**
```javascript
/**
 * @import { SingleModule } from '../type.ts';
 * @typedef {Object} ConfigSingleModule
 * @property {number} viewportWidth
 * @property {number} viewportHeight
 * @param {ConfigSingleModule} config
 */
```

**Avoid:**
```javascript
/**
 * @param {{viewportWidth: number, viewportHeight: number}} config
 */
```

## Testing

### Testing Framework
Uses **Vitest** with TypeScript support for testing without build steps.

### Testing Approach
Tests focus on user behavior and component outputs rather than implementation details:

1. **Snapshot Testing** - Capture rendered DOM and styling output
2. **User Interaction Testing** - Simulate real user workflows
3. **API Testing** - Test public methods and getters
4. **Edge Case Testing** - Validation, clamping, error handling

### Test Structure
```typescript
import { expect, describe, it, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { getByRole, getByText, getByDisplayValue } from '@testing-library/dom';

describe('ComponentName', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    document.body.innerHTML = '';
    user = userEvent.setup();
  });

  const create = (...args) => {
    const component = new ComponentName(...args);
    document.body.appendChild(component);
    return component;
  };
});
```

### User Interaction Testing
**STRONGLY PREFER** `@testing-library/user-event` for realistic user interactions:

```typescript
// PREFERABLE: Realistic user interactions
const button = getByText(component.shadowRoot!, 'Click me');
await user.click(button);

const input = getByPlaceholderText(component.shadowRoot!, 'Enter text...');
await user.type(input, 'Hello world');
await user.keyboard('{Enter}');
```

Only use manual event dispatching when userEvent has JSDOM limitations:

```typescript
// AVOID: Only use when userEvent doesn't work in JSDOM
input.value = 'new value';
input.dispatchEvent(new Event('input', { bubbles: true }));
```

### Semantic Queries
Find elements by what users see, not implementation:

```typescript
// PREFERABLE: Semantic queries
getByRole(shadowRoot, 'button')           // Find by semantic role
getByText(shadowRoot, 'Submit')           // Find by visible text
getByPlaceholderText(shadowRoot, 'Search') // Find by placeholder
getByDisplayValue(shadowRoot, '42')       // Find by current value

// AVOID: Implementation details
shadowRoot.querySelector('.submit-btn')   // Depends on CSS classes
shadowRoot.querySelector('#input-id')     // Depends on internal IDs
```

### Test Patterns
- Use `create()` helper functions to reduce duplication
- Test one behavior per test case
- Prefer snapshot tests for visual output verification
- Test the component's public API, not internal state
- Mock minimal globals only when necessary (e.g., `PointerEvent` for JSDOM)

### Documentation Guidelines

When updating documentation:
- **JSDoc comments** - Add docstrings when method signatures or behavior are unclear
- **Project documentation** - Update CLAUDE.md and README files in the project
- **Type Coverage** - Prefer TypeScript interfaces over prose descriptions of object shapes

Only add docstrings when ambiguity could cause errors, not for every function.

## Important Instructions
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- Respect the no-build philosophy - this project runs directly in browsers without bundling

## Automations

### Generating boilerplate from table of contents

When provided with table of contents images for educational content (textbook chapters, lecture notes), generate structured boilerplate following this pattern:

#### Structure for Numbered Sections

For each numbered entry (e.g., "16.1 Section Title"), create an export in `doc.js`:

```javascript
export const sectionName = createDoc(() => container(
  ref({ page: XXX }, doc.h2`Section Title`),
  dashbox(
    twoThree(
      container(
        note(),
        // subsections here
      ),
      doc.dl(
      ),
    ),
  ),
));
```

#### Structure for Subsections

For nested subsections under numbered entries, add them within the container:

```javascript
container(
  note(),
  ref({ page: XXX }, doc.h4`Subsection Title 1`),
  note(),
  ref({ page: XXX }, doc.h4`Subsection Title 2`),
  note(),
  // ... additional subsections
)
```

#### Pattern Rules

- **Numbered sections** (e.g., 16.1, 16.2) → `doc.h2` with export
- **Unnumbered subsections** → `doc.h4` without separate export
- **Page references**: Use `ref({ page: N }, ...)` for all headings
- **Slide references**: Use `ref({ slide: N }, ...)` when available
- **Note placeholders**: Add `note()` after each heading for future content
- **Layout**: Use `twoThree()` with `container()` for content and `doc.dl()` for definitions

#### Update index.js

Add all numbered section exports to the `children` array in order:

```javascript
export const children = [
  // existing content
  doc.sectionName1,
  doc.sectionName2,
  doc.sectionName3,
];
```

#### Naming Conventions

- Use camelCase for export names
- Abbreviate long titles meaningfully (e.g., "The Neoclassical Consumption Model" → `neoclassicalModel`)
- Avoid overly generic names like `section1`, prefer descriptive names
