# RFC 010: Type Checking Without Compilation

## Status
Done - 22nd of June 2025

## Summary

I want to be able to introduce type checking without a compile step.
Mostly because I just want some slight type checking in the most
relevant parts. I don't want to output any source.

The goal here isn't to add types to everything the initial upfront setup
so I can do that going forward.

## Proposed Solution

Claude has suggested doing a combination of:

- JSDoc types
- Creating complex types in `*.d.ts` files in a `types` direcory.

I have prefixed it below with the type `Claudes suggestion`

## Some Priorities and use cases of mine

- I will want to enforce interfaces quite a bit in different parts of the code.
- I would like to define types with `type`
- A lot of my code is nested so I'd like to avoid having to import stuff constantly
  from nested locations in source. I think it would be good to namespace the types
  So I really don't want to use `import()` if I can help it.
  - With the exception of types only used within the same directory or its children
    - This is preferrable for everything in `lib/app`

## Configure setup
### 1. Suggested JSCONFIG.JSON
Claude suggested this, I am assuming this is just a tsconfig
but for js and the typescript compiler will pick it up?

```json
{
  "compilerOptions": {
    "checkJs": true,
    "noEmit": true,
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["lib/**/*", "*.js"],
  "exclude": ["node_modules"]
}
```

> Since this is claudes suggestion I am not married to any specified
  aspect of this config, as long as any changes uphold the constraints
  I have laid out.

### 2. setup a package.json for this directory

we need to be able to install developer dependencies like
typescript, we should also make sure we update the git ignore
to ignore node modules (I've already done that).

### 3. Setup typecheck script
this should just be a bash script the runs typechecking

We will need to install typescript, this should be local to the project

## Defining types

### `types/*.d.ts`
I'd like most of my types here, and for them to be enforced by

```
/**
 * @implements ...
 */
```

with a reference to the type in the appropiate namespace.

Some Candidates

- Widgets
- Application Engines
- The knobs elements for the config panel

#### Algebraic datatypes

It would be good to also define some algerbric datatypes there

Some Candidates
- the DSL for rendering with `lib/util/render-dom`
- the other DSL for rendering with `lib/ui/widget/document/element`
  - Namespace in App


### JSDoc Annotations

This will make sense for most things defined in lib/util, such
as complex numbers

# Claudes proposal
### Type Annotation Strategy

#### JSDoc Annotations
Use JSDoc comments for type annotations in existing JavaScript files:

```javascript
/**
 * @param {CanvasRenderingContext2D} renderer
 * @param {ViewportConstraints} viewport
 * @param {string} text
 * @returns {void}
 */
function renderPlaceholder(renderer, viewport, text) {
  // implementation
}

/**
 * @typedef {Object} AppConfig
 * @property {string} kind
 * @property {number[]} [origin]
 * @property {number} [scale]
 */

/**
 * @param {AppConfig} config
 * @returns {Context}
 */
function createContext(config) {
  // implementation
}
```

#### Complex Types
For complex shared types, create `.d.ts` files in a `types/` directory:

```typescript
// types/canvas.d.ts
export interface CanvasRenderer {
  ctx: CanvasRenderingContext2D;
  // methods...
}

export interface ViewportConstraints {
  toCanvas(complex: Complex): [number, number];
  // other methods...
}
```

Reference in JSDoc:
```javascript
/**
 * @param {import('./types/canvas').CanvasRenderer} renderer
 */
```

