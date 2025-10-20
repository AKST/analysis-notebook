# Tasks for CLaude to do


- base/render_app/render_app/typography
    - rename to base/render_app/helper/html
    - setup void selectors
    - remove dl, replace with a helper.

- base/prelude/uni
    - move container into side of infobox
- base/render_app/math
    - provide a similar api to typography api, but slowly go through
      and update things gradually.

- base/runtime/engine/multi
    - use the MS scroll for the contents of the app

- app
    - project structure changes
        - remove the type signature from LINK constants

- navigator
    - preserve the Table of contents in the URL bar
    - drop any title not found in the document.

- migrate to mathml_2 api
    - prelude
        - [ ] SPECIAL
        - [ ] operators
    - BLOCKER make operator more configurable (accept attrs)
    - Things to keep in mind with the special characters
        - delta is now Delta (merge with current Delta)
        - delta2 is now delta

