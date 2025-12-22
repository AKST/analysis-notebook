# CLAUDE.md

## Terms and Nomanclature

- `app` generally refers to one of the subdirectories of `lib/app`
  - New ones can be added with the script `./scripts/mk_app.sh`

## Code Style

- javascript
  - use trailing commas in multiline Objects and arrays
  - use `== null` to check for both null and undefined
  - dependency management
    - dependencies should be provided by constructor, avoid
      initialisation in construtors, use factory function or
      installer function.
  - typing
    - code is written in `.js` files with JSDoc type annotations
    - `@import` statements to reference TypeScript types in JSDoc
    - Avoid inline object types in function signatures - use `@typedef`.
      Create dedicated `@typedef` for config parameters rather than
      inline object literals
  - testing
    - prefer `@testing-library/user-event` for realistic user interactions
    - when testing a user interaction, prefer looking up elements by semantic
      queries over implementation specific queries like getBy{Role,Text}
- styles
  - grid is preferred over flex.
  - Use transform over position absolute, as it does not cause reflows.
    Especailly for animations.

## Development

This is a static site that runs directly in the browser - no build process required. Simply open `index.html` in a web browser.

The project uses:
- ES6 modules with native browser support
- HTML5 Canvas API with high DPI support
- CSS-based responsive layout
- No external dependencies or frameworks
- Dynamic imports for lazy-loaded app modules

## Important Instructions
- Do what has been asked; nothing more, nothing less
- Prefer editing an existing file to creating a new one
- NEVER proactively create documentation or comments unless explicitly requested

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
