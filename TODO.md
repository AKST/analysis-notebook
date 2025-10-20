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
    - prelude
        - [x] rows
        - [x] sum
        - [x] multiscripts
        - [x] matrix
        - [x] piecewise
        - [x] iv
        - [x] set
        - [x] abs
        - [x] idx
        - [ ] inv
        - [ ] parensA
        - [ ] table
        - [ ] call
        - [ ] SPECIAL
    - base
        - [x] mo
        - [x] mi
        - [x] mtext
        - [x] mrow, math
        - [x] mover
        - [x] mn
        - [x] msub, msup, msubsup
        - [x] msqrt
        - [x] munder
        - [x] mspace
        - [ ] mfrac
    - grouping changes together
        - mtext, mi, mo
        - mrow, math rows
        - mover
        - sum, mn, msub, msup, msubsup, msqrt, munder

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


-------------
Can I get you to replace usage of frac with mfrac. If you remove the export from base/render_app/helper/mathml.js for frac, typescript will tell you everwhere there's an issue. In each of those places can you use
will get type errors

