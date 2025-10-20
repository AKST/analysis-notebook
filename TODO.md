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
        - [/] inv
        - [/] parensA
        - [/] table
        - [/] call
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
        - [/] mfrac
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

I want you to update a few things

## Updating `call`

can you update uses of `call` from base/render_app/helper/mathml.js to base/prelude/university/mathml_2.js

The main change in the API is the arguments are all the children passed to the helper, but the function name has to be specified as an attribute and should either be prefixed with `mi` or `mtext` like so

- Old
  ```
  call('a', [mn(0), mi`a`])
  ```
- New
  ```
  call.attr({ fn: mi`a` })(mn(0), mi`a`)
  ```

## Updating `paren`

Can update paren to use `parensA` from base/prelude/university/mathml_2.js

The main change in the API is dropping the wrapping of the children in [ ]

- Old
  ```
  paren([mn(0), mi`a`])
  ```
- New
  ```
  parensA(mn(0), mi`a`)
  ```

## Updating `inv`

Can update `inv` by moving the import from base/render_app/helper/mathml.js to base/prelude/university/mathml_2.js
It is the same API, the type does change but the new type is
inclusive of all existing usage.

## Updating `frac`

Can update `frac` from base/render_app/helper/mathml.js by replacing it with `mfrac` from base/prelude/university/mathml_2.js

The type does change. Instead of the args being to arrays of items as `(a: E.Item[] b: E.Item[]) => E.Item` instead is now roughly `(a: E.Item, b: E.Item) => E.Item`. Where there is more than one element in either the denominator or nominator wrap them with `mrow`. If it's a single element just remove the array surrounding it. Like so

- Old
  ```
  frac([mn(0)], [mi`a`])
  frac([mn(0), mo`+`, mi`b`], [mi`a`])
  frac([mi`b`, mo`+`, mi`c`], [mn(0), mo`+`, mi`b`])
  ```
- New
  ```
  mfrac(mn(0), mi`a`)
  mfrac(mrow(mn(0), mo`+`, mi`b`), mi`a`)
  mfrac(mrow(mi`b`, mo`+`, mi`c`), mrow(mn(0), mo`+`, mi`b`))
  ```

## Updating `table`

Can update `table` from base/render_app/helper/mathml.js by replacing it with `table` from base/prelude/university/mathml_2.js

In many cases you can just remove the top level square braces. But there is an optional second argument for html attributes, you can just move those to the `.attr(...)` call instead. I will give some examples


- Old
  ```
  table([...rows])
  table([...rows], { columnalign: 'a b c' })
  ```
- New
  ```
  table(...rows)
  table.attr({ columnalign: 'a b c' })(...rows)
  ```

## Instructions

I am entirely okay with using a lot of tokens. That's perfectly fine by me. I really don't trust your ability to automate this as it has often ended poorly in the past and took up a considerable amount of my own time to fix. I was forced to divert attention away from things that needed my focus because I was tidying up something you incorrectly automated and had entirely stuffed up.

I value my time considerable more than any cost incurred by excessive token usage. Please do not be celever about this, go through each mathml file one by one and correct apply the changes. Do not bulk change them because you start throw in inaccuracies, that I am forced to fix. Please respect this constraint. It is important to me.


