# About

These are a list of style preferences, it is likley nonexhaustive.

## General

### Use `function *(): Iterable<Item>` functions over `function (): Item[]`

Why? I just want to emphasis using generator functions is perfectly fine
and in many cases makes code more readable.

When not to do this:
- If the array is not being manually constructed in that function. If the
  array is already assemebled as property or array param or return value of
  an internal function call, do not needless convert the function into a
  generator
- Do not do this in a hot loop
- Try not to do this if the primary caller needs an array to conform with
  an DSL call signature.
- Do not do this if the primary caller is clearly trying to do some array
  manipulation, or anything relating to buffers.
- If it's called in many places and it's clear the caller wants an array
  more than 50% of the time.

When to do this:
- The main deciding factor to do this is if the function is returning a
  variable number of items based on conditional logic or the number of items
  is contingent on the parameters.
- If there is a level of indifference with a primary caller between it being
  an array or iterator. Like if:
  - map is called immediately on the return value, Array.from works too
  - being used in a for of loop.
- If the caller wants array in the end, and it's largely called in one place
  it is fine to just wrap the call in `Array.from`.

It's entirely possible it lies in between, if so it doesn't matter to much.

### When styles should go in a stylesheet, style attribute or dynamic stylesheet

To clarify the above:
- stylesheet, means a css file
- style attribute, means styles inlined on an elements style attribute
- dynamic stylesheet, means styles generated at runtime used in a style element.
