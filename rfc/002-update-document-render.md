# RFC 002 update document render & update

> Abandoned, this was kind of superseded

Some additions have been made to the render
function of the document widget render function
such as:

- Namespaced element (to support MathML, see [some examples][mathml-eg]).
- [Document Fragement][Fragement] for simpler APIs.
- Number (which get turned into strings).
- Allowing children to be a single element.
- It would be nice to add handling `undefined` and `false`.

[Fragement](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
[mathml-eg]: http://eyeasme.com/Joe/MathML/MathML_browser_test.html

These are all great but we need to take steps to ensure the update
function is still working and not rerendering more than it needs to.
A bit of this logic is implemented in `parseElementSpec`.

Technically input takes this form atm:


```ts
type Event = unknown;
type Attrs = { events?: Record<string, Event> }
           & { styles?: Record<string, string> }
           & Record<string, string>

type Fragment = { children: Input[] }
type InputChildren = Fragment | string | number | Input[];
type Input =
    | Fragment
    | string
    | number
    | [string, InputChildren]
    | [string, { ns: string } & Attrs, InputChildren]
    | [string, Attrs, InputChildren]
```

## Suggestions
### Have stricter DSL

Instead of arrays have something `dom.p({}, [...])`, that way we can
do sanitisation much earlier. Personally not the biggest fan. Our
DSL should be light weight.

### Do a normalisation Pass

Do an upfront pass that normalises the contents of the dom. This is
the cleanest suggestion, but it may not be the most efficent solution.

### Inline the logic

I think is what we'll likely go with to ensure it is as smooth as it
can be in terms of performance, but this might have a higher maintainence
burden. But this may be a non issue if we implement it in a way that is
more maintainable, figuring out a nice approach may require some thoughts.

#### Naive solution

Is add more if's and conditional logic. This might be the worst outcome lol.

#### Classification

Kind of like how we have that `parseElementSpec` function, I think it maybe
worth having some logic to break down inputs into classifications. Have one
nasty function with a bunch of conditional logic but the consumer can have
flat logic. This will be useful in render as well.

```ts
type Classication =
    | { type: 'noop' }

    | { type: 'string', value: string }
    | { type: 'number', value: number }
    | { type: 'fragment', items: Array<Input> }

    /*
     * if there's any elements defined like [tagName, 'string'],
     * we should turn them into [tagName, []]
     */
    | { type: 'element',
        tagName: string,
        attributes: Object,
        events: Record<string, Event>,
        children: Array<Input> }

    | { type: 'element-ns',
        tagName: string,
        namespace: string,
        attributes: Object,
        events: Record<string, Event>,
        children: Array<Input> }
```

And then we should have a similar function that exists for elements. But
at that point that feels just as complicated if we're comparing all these
similar shapes.

#### Yield Deltas

Maybe it would be simpler to yield the detected deltas, that way it is
easier to see if it is working on not and it should be easier to test.



