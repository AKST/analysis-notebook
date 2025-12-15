# Todos

This is effectly a poor mans issue tracker.

## Big Fish

### Build System

1. Look at settting up `esbuild` or `bun`.
   - Main blocker is really just how to handle dynamism.

### Archetecture

1. Run UI in iFrame
2. Run state in web worker
3. Run canvas rendering in web worker

### Internal API

1. dom
  1. Unify dom_ui and dom_app under dom_desc
    - Need to first ensure the APIs are uniform before merging
      - make sure they both use `class` or `className` for classes.

  2. Post unifying changes
    - [ ] Attribute typing dependent on `tagName`
      - For different names spaces
        - HTML, SVG: In typescript there are builtin types for this
          - for svg there is `SVGElementNameMap`
          - for html there is `HTMLElementNameMap`
          - for mathml there is `MathMLElement`
    - [ ] Replace `styles: string` with `styles: Record<string, string>`
    - [ ] Allow supporting events.
        - Alternatively maybe I can add an effect system where certain
          attributes emit directives to perform events and the events
          are performed after render (an example is a directive to
          create a style tag with a media query or register an event)
        - In typescript these types exist
          - `HTMLElementEventMap`
          - `HTMLMediaElementEventMap`
          - `HTMLFormElementEventMap`
          - `HTMLInputElementEventMap`

2. webgpu buffer memoryLayout
  - Rewrite reading from GPU buffer
    - Current approach is probably wasteful

  - Add typing
    - Generate useful types & Propagate them to everything else

  - Allow Nesting Of Layo3ts
    - Sometimes structs take structs as params

  - Generate config for createPipeline
    - Generate pipeline buffer params

3. Url State
  - Need a generalised archetecture for representing this.
    - Something that encodes this information, generates
      short URL params while maintaining backwards compatibility.
    - Isolate params to specify parts of the app

  - More state should be tracked in the url
    - Within apps, last visible header
    - Within the chrome which tabs are visible.

4. User content containment and moving into an iframe
  - Unordered changes
    - [ ] Each widget exist in a web component.
    - [ ] State should be managed in a web worker
    - [ ] Rendering should also be moved a web worker

  - Ordered Changes
    1. Need to unify single/multi engines
      - [ ] Single Engines should be just be specialised config,
        it can probably already be generalised in multi apps.
      - [ ] It might just be a matter of rewritting existing single
        engine apps to multi apps and the appropiate extensions
        to archive that.
      - [ ] After that we can delete the single engine and simplify
        the types of the runtime generally.

    2. Figure out what code runs in the parent and child window.
      - We will probably need to define a quasi runtime for the window.


## Small Fish

### Tables with editable cells

We need to have a way of updating data without it always having to
first be defined in a config panel or modified in the config panel.
It would be nice to have more interactive components where edits to
it trigger some kind of event to produce an output which we again
show in the table.

### UI Chrome improvements

- Loading State
  - Make reusable

- Web Components should replace their mounting elements.
  - This is already done by `user-content` and `app-header`

- lib/ui/chrome/config
  - Load indivisual knobs asyncronously

- Crazy stuff
  - [What if it was a popup][window-open]

[window-open]: https://developer.mozilla.org/en-US/docs/Web/API/Window/open

### Explore Column Layouts

There is this [w3c spec](https://www.w3.org/TR/css-multicol-1/)
for multicolumn layouts, alot of the content I have written might
benefit from using it. Its worth exploring.

### Mathml Cleanup

- [ ] Replace unicode combining characters in mathml
  - Lets accept defeat and not use unicode combining characters... We
    shoulds a combination of `mover` and `munder`. We can probably
    make some specialised functions or a version of `mi` in the
    prelude with methods like `.circumflex`, `.accent`, `.tilda`, etc
    (although shorthand might be nice).
- [ ] simplify annontation under
  - it should just let you specify the next positionally


### Clean up CSS

- move hardcoded units to styles.css
  - [ ] colours used for borders
  - [ ] font-sizes in inputs
- Cross platform: make styles consistent across chrome and safari
  - [ ] slider input
  - [ ] toggle input
  - [ ] ticker input
- Consistent Borders for inputs
  - [ ] text input has inconsistent border size
  - [ ] UPDATE inset & outset TO USE EXPLICT COLOURS.

### Renames

- Rename lib/base/dom_app/helpers/typography to html
- Rename lib/ui/chrome to lib/ui/{os,chasis,environment,system}

## Exploration

### Worklets

[Read more here](https://developer.mozilla.org/en-US/docs/Web/API/Worklet).

## Unsorted

- ui/navigator
  - new tabs
    - Formular Explorer
    - Definition Explorer
- Use Marquee effect in long titles.
