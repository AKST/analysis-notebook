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
  1. [x] Unify `dom_app` and `dom_ui` APIs, currently underway.
  2. [x] Post unifying changes
  3. Clean up
     - [ ] Migrate anything using the style attr to use the css helper
     - [ ] Turn doc.ul into a normal helper not a template helper
     - [ ] Setup tests to preserve render output
  4. API changes
     - [x] helper method, `doc.[tag].void` which just takes attribute and returns the element
     - [ ] helper method, `doc.[tag].unit` which has type `(it: E.Item) => E.Node<...>`
           See `lib/app/sec-unsw/sec-1101/sec-03/tables.js` (193)
     - [ ] helper method, `doc.[tag].from` which has type `(it: Iterable<E.Item>) => E.Node<...>`
           See `lib/app/sec-unsw/sec-1101/sec-03/tables.js` (256)
           See `lib/app/sec-unsw/sec-1190/common.js`
           See `lib/app/sec-debug/sec-2/index.js`
  5. The hardest part
    - [ ] Support events.
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

### Safe Render Function

Add method to the dom rendering DSL library to avoid tags like script,
or style or anything possibly unsafe being rendered, possibly rename
render as unsafeRender or render without safety. I want to be able to
continue to it through out my app but I whatver.

### Improve App Layout APIs

For how frequently `responsiveGridAutoRow` is used, it's pretty bad.

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
    - toggle on calculator looks bad
  - [ ] ticker input
- Consistent Borders for inputs
  - [ ] text input has inconsistent border size
  - [ ] UPDATE inset & outset TO USE EXPLICT COLOURS.
- Typography
  - [ ] label in many knob somewhat big
  - [ ] Fix typography sizing in unsw.1101.*
- Load States
  - [ ] Minimise load jank
- Bugs
  - [ ] Table styles are missing lower footer caption on unsw.1101.03
  - [ ] Summary array for details in unsw.2206.04-1
  - [ ] Layout overflow of unsw.1101.01
  - [ ] Fix all of unsw.comm1190

### Renames

- Rename lib/base/dom_app/helpers/typography to html
- Rename lib/ui/chrome to lib/ui/{os,chasis,environment,system}
- DSL_DOM: Helper::void, this name is somewhat inaccurate, as void tags
  are supposed to be implict self closing tag in html, whereas I've named
  a method void to construct a node with only attributes.

### Remove old APIs

- There's some stuff in prelude components that can probably be replaced

## Exploration

### Is it possible to type CSS?

Two options

- Type the strings
  - I'm not really sure how possible this is

- Allow expressing css in more advance datastructures?
  - One an immediately unappealing aspect is it adds a runtime overhead

Both require require an insane amount of work, possibly better
addressed by some kind of linter.

### Organising directory structure

#### General Thoughts

I think I need to figure out what problems really exist,
consider them in relation to longer term objects, and what
I really want to accomplish.

1. With unifiying `dom_ui` and `dom_app` as `dom_dsl`,
   - do I need to differeiant between reusable ui in both the app and chrome?
   - if so does it make sense to
     - nest the contents of ui in a directory like `ui/runtime`?
     - create a directory like `ui/common` for the reused stuff?

2. Are there larger packages that would benefit from incremental compliation?
   Are there directory structures that mitigate that better manage this cost?

3. Have fewer relative import paths in base. The reason I haven't specified a
   self relative import within base is because I wanted to keep the code in
   usable with fewer steps and forcing them to always also setup a path alias
   but in practise anything already using it already does this. So maybe this
   is a nonissue?
   - Should I just expose that alias to base?

4. There are some sense of arbitrary self importance of earlier added code
   that ended up not being as important in the long run or code that after
   giving more thought, I realised could be done differently. They are being
   imported in more places than I would like, and I would like to emphasis them.
   - The subproblems
     1. Some of these packages have been added to the default prelude but have
        no business being there. Their import should be removed, and possibly

#### What would a better structure look like

If I can't define this, maybe this is a grass is always greener thing.

#### Unsorted Thoughts

- Should there be a general pkg dir?
  - It just includes anything that is reused
  - I think a place like that might be more appropiate for `runtime` than `base`
  - `prelude/blah` could just `pkg/prelude-blah`
- Group `app` and `prelude`
  - `app` because `app/instances`
  - `prelude` because `app/preludes`, unless it just gets moved to `pkg/prelude-{a,b,c}`
- Move stuff out of `base` into prelude
  - like the math and economics stuff

### Worklets

[Read more here](https://developer.mozilla.org/en-US/docs/Web/API/Worklet).

#### General Thoughts

- I can't really benefit from this if browser support isn't there and its
  unclear when safari will support any of the useful stuff here.

## Unsorted

- ui/navigator
  - new tabs
    - Formular Explorer
    - Definition Explorer
- Use Marquee effect in long titles.
- Loader doesn't consistently appear for loading.
- Fix tests for components
- get rid of any duplication in comm-1190/common.js
