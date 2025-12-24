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

1. DOM DSL Improvements
   1. Dynamically Generate StyleSheet from input to `.css`
      - Elements can also have styles relating to states
        as well as media query constraints. It's almost
        always better to put it in a style sheet, and
        specify any dynamism in CSS variables. But what
        if I don't want to do that?

   2. Event API.
      - General Ideas
        1. Idea one, encorporate it into the effect system.
      - Useful information and partially solved Problems
       - With handling typing, typescript has these types exist
         - `HTMLElementEventMap`
         - `HTMLMediaElementEventMap`
         - `HTMLFormElementEventMap`
         - `HTMLInputElementEventMap`

2. Widget Isolation
   - DESIGN
     - Currently document widgets render into the parents TreeScope
       (the light dom [if it was running there] or their respective
       shadow dom [typically this is the user-content element]). But
       I'd like for each widget to be placed in its own web component.

     - Some design questions and considerations:
       - For all Widgets
         - (!) There SHOULD be a commmon style sheet.
           - IMPLICATION there needs to be a for a widget to adopt it.

       - For document Widgets
         - (?) Is there value in a local css?
         - (?) Is there value in a local event handler?

   - ROADMAP
     - Unify single/multi engine
       - In practise this should a combination of
         - making implict behaviour of a multi widget app not seen in
           single widget apps explict via config.
         - making implict behaviour of a single widget possible via config.


3. webgpu buffer memoryLayout
  - Rewrite reading from GPU buffer
    - Current approach is probably wasteful

  - Add typing
    - Generate useful types & Propagate them to everything else

  - Allow Nesting Of Layouts
    - Sometimes structs take structs as params

  - Generate config for createPipeline
    - Generate pipeline buffer params

4. Url State
  - Need a generalised archetecture for representing this.
    - Something that encodes this information, generates
      short URL params while maintaining backwards compatibility.
    - Isolate params to specify parts of the app

  - More state should be tracked in the url
    - Within apps, last visible header
    - Within the chrome which tabs are visible.

5. User content containment and moving into an iframe
  - Unordered changes
    - [ ] Each widget exist in a web component.
        - The main challenge here is sharing stylesheets.

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

### Get rid of `StyleManager`

Replace with `StyleService`.

### Snapshot Regression tests for `lib/app`

This should be useful when migrating to new APIs.

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
- DSL_DOM: Helper::void, this name is somewhat inaccurate, they are named
  after [void elements][void-elements] which are a bit like implict self
  closing tag in html. The problem is this method really has nothing to do
  with this. When I gave it this name, tbh I was in between a few things
  but I decided a method like this when I noticed there were several cases
  where .c() was used (like this with no arguments) immediately after attr
  which is entirley doable with the void helpers, and in jsx would just be
  a self closing tag. IDK the name is kind of confusing so I should rename
  it.

[void-elements]: https://developer.mozilla.org/en-US/docs/Glossary/Void_element

## Exploration

### Is it possible to type CSS?

By this I mean, the css specified in js or in calls to `.css` in the dom dsl.

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

#### emphasis on runtime

With the introduction of a build system (a work in progress at the
time of writting this). Code in src will now have different assumption
about the runtime they are in.

- Most code at this stage is code written to run in the browser in
  someone elses browser.
- But Some code will be written to run on my machine of a build machine
  I control. Maybe even on a server?
- Some code will be written independently of either of it.

Perhaps this fact should be reflected in an eventual directory structure

##### Candidates

I don't think a perfect of names exist, as I am trying to
capture some abstract notion in them. But I'd also like for
them to have similar length in terms of characters.

- intern / extern / shared
  - one thing I don't like about this is the suggestion that
    code running in a browser is always public facing what if
    its an internal tool? But the names are some what satisifying.

  - meanings
    - Intern refers to code running on my development machine or
      a hypothetical build environment I control. In that way it
      is internal, in the sense the environment the code is run
      is internal.
    - Extern refers to code running on an external environment
      such as a users device.
    - Shared code that runs in either environment.

- home / away / both
  - This nomanclature is interesting but it is also confusing
    and possibly misinterpretable.

- publ / priv / core
  - This has similar problems of the last two, but it is fun
    to use the word core.

- caller / callee / (either|shared)
  - This one focus on the inversion of control aspect, where
    code on my server and code in the browser have a distiction
    in terms of inversion of control.

  - It is a bit abstract but it doesn't have this public internal
    facing confusion.

  - I guess not a problem at this stage but I wonder what it mean
    if I had to start considering more than one environment or if
    code run in a controlled environment became less controlled or
    had some level of inversion of control like next.js does

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

- Should I use `bun`?
- look at moving all config files into `./config`
- ui/navigator
  - new tabs
    - Formular Explorer
    - Definition Explorer
- Use Marquee effect in long titles.
- Loader doesn't consistently appear for loading.
- Fix tests for components
