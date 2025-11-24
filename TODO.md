# Tasks for CLaude to do


- ui/navigator
    - just emit all events from the navigation element
    - app state
        - preserve the Table of contents in the URL bar
    - new tabs
        - Formular Explorer
        - Definition Explorer

- config
    - load knobs asyncronously

- base/runtime
    - Can I get util to run in a webworker?

- base/runtime/widget/document
    - [ ] Replace `styles: string` with `styles: Record<string, string>`
    - [ ] Implement events
    - [ ] Element Attribute types dependent on Element
    - [ ] Make each widget exist in a web component.
- base/runtime/widget
    - [ ] Make each widget exist in a web component.
- base/runtime/{multi-styles + widget/document/appStyleManager}
    - I need to have a more explict API for loading styles. I should
      also consider styles sheets as well. But for now I'd like to
      avoid having the widget runners and engines making direct dom
      mutations
      - [ ] Establish API for engine runner to specify their widget content
      - [ ] Establish API for engines to emit their stylesheets
        - support vanilla style sheets
- base/runtime/widget/svg
    - Has an initialisation step
    - Then takes state
- base/{dom_ui,dom_app}
    - unify these two APIs, have seperate renders if necessary.

- prelude
    - move econ here

- lib/ui/chrome
    - Reusable loading state, possibly even clone the top level one.
- lib/ui/chrome/config
    - [What if it was a popup](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)

