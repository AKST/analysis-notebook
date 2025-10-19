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
    - ECON-1101
        - move to the more general prelude
    - project structure changes
        - remove the type signature from LINK constants

- navigator
    - preserve the Table of contents in the URL bar
    - drop any title not found in the document.

- migrate to mathml_2 api
    - BLOCKER make operator more configurable (accept attrs)
    - See example in app/sec-2206/sec-01-2
    - Things to keep in mind with the special characters
        - delta is now Delta (merge with current Delta)
        - delta2 is now delta
    - Move from base/prelude/university/mathml to base/prelude/university/mathml_2
    - Move from base/render_app/helpers/mathml to base/render_app/helpers/mathml_2
    - processs
        - update to base/prelude/university/mathml_2
            - SUGGESTION: replace one method at a time
            - replace all use of previous API with new API
            - delete old API
        - update to base/render_app/helpers/mathml_2
            - replace all use of previous API with new API
            - delete old API


