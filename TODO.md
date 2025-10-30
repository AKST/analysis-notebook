# Tasks for CLaude to do

- lib/ui
    - refactor using dependency injection
        - On startup install all web components for th skeleton.
            - Consider if it's possible to have async wrappers for knobs.

- lib/ui/application
    - refactor using dependency injection
        - Implement state as a proper state machine, with store and presenter
        - Implement as a web component to isolate styles
        - After getting parity address this above issue.

- lib/ui/config
    - [What if it was a popup](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)

- navigator
    - preserve the Table of contents in the URL bar
    - drop any title not found in the document.
    - new tabs
        - Formular Explorer
        - Definition Explorer

- config
    - add Windows95 style select drop down

- base/runtime/widget/document
    - [ ] Replace `styles: string` with `styles: Record<string, string>`
    - [ ] Implement events
    - [ ] Element Attribute types dependent on Element
- base/runtime/widget/svg
    - Has an initialisation step
    - Then takes state
- base/runtime/engine/multi
    - use the MS scroll for the contents of the app

- base/runtime
    - wrap user apps in shadow dom
- base/runtime
    - support vanilla style sheets

