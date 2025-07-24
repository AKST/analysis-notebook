# Application Config

> Status: Done 11/06/2025

## Overview

- Configs should be speified in a getConfig function
- There should be one getConfig function per engine,
  and data/state relating to configs exist at an engine
  level.

I have defined an example in app/sec-1101/app-1101.1.js

Here there are 4 kinds of configs a complex one, a
number one, a colour one and a group one.

These will work similar to storybook knobs
if you're familar with that JS tool. So in getConfig
we define the possible knobs their default values as
well as their colour (if relevant) and range.

Right now in app-1101.1.js we have some constants defined
as 'VECTORS' and 'SCALE', i'd ideally like to expose this
to the application in the form of knobs. I'd like to
eventually replace defining those with knobs, and expose
the resolved values (which defaults to the value `of`) in
a similar way state is passed into render functions. That
is the currently priority.

Eventually tho we will want to expose those as controls.

I geuss we can call indivisual configs knobs.


## Value behaviour of knobs
### Types of knobs

- number, just a number defined within a range
- colour, a colour as its hex number
- complex, a complex number
- group, groups more than one input

```ts
type Range = [number, number];
type Knob =
  | { kind: 'color', of: number }
  | { kind: 'number', of: number, range: Range }
  | { kind: 'complex', of: ComplexNumber, range: Range | [Range, Range] }
  | { kind: 'group', of: Record<string, Knob> }
```

### Knobs to values

In the render functions we don't want to interact with knobs
as their config but instead as their evaluated values. They
should default to the value specified in `of`. And they are
configurable within the ranges specified by range.

So the following config

```js
export function getConfig() {
  const vector = (x, y, c) => ({
    kind: 'group',
    of: {
      point: { kind: 'complex', of: _c(x, y), range: [0.1, 10] },
      color: { kind: 'color', of: c },
    },
  });

  return {
    scale: { kind: 'number', of: 1/5, range: [0.1, 10] },
    a: vector(16, 8, COLOR.CYAN),
    b: vector(4, 4, COLOR.YELLOW),
    c: vector(8, 16, COLOR.LIME),
  }
}
```

By default will evaluate to the following

```js
{
    scale: 1/5,
    a: { point: _c(16, 8), color: COLOR.CYAN },
    b: { point: _c(4, 4), color: COLOR.YELLOW },
    c: { point: _c(8, 16), color: COLOR.LIME },
}
```

And in render functions will be accessed like so

```
function render(_context,_state, config) {
  const { scale, a, b, c } = config;
  // ...
}
```

## Displaying config as knobs

Below I explain the appearance and interactions of knobs

### Location of controls

I think we need a sidebar or something to show the different
configs. The side bar should be collapsible and should trigger
reize when opening and closing, reducing the application width
by the width to show the knobs column.

On portrait layouts this won't work, maybe as need a button that
results in a menu being superimposed on top of the application,
using a tranform. So maybe it's rendered at all too times and
then slides up once it's necessary to show it.

On landscape layout it would be good to show this as on the right
hand side of the screen. It is fine to use transform to animate it
into place but we don't need to send the indivisualise updates of
the resizing to widget resize. While the the animation is taking place
just reduce the size of the application by the column width, and after
remove it from the width.

### Appearance of config column

- It should be a similar width to the menu.
- Have some padding of 16px
- Have a title at the top

#### The appearance of controls

- For numbers, it should be simple enough to have a slider.
  - The grid area should be 1 / 3
  - They will display their current value next to their
    label (which for all controls will be in the top left),
    where as their control will fill the entirity of the row.
    - Perhaps their value should be a number box on the right
    - Hand side
- For Complexs, I think we should consider having both slides
  as well as a square with a dot within it which we can drag
  around to get the new value.
  - The grid area should be 1 / 2 or 2 / 3, it shouldn't take
    up a full row like a number config

#### Grid layout

- It should have a grid layout with auto row of `1fr 1fr` and
  auto col of auto and the auto layout should be to add new rows.
  - each new row should be sized to auto
  - each new row should have 2 columns of 1fr 1fr
- Labels will often go in the top left of their container.

Alternatively maybe we can have row of 8 columns, 8px column
gap but a 16px row gap.

#### Number Knob grid

An example of number knobs might look
like this

```
| 1/9 A         |
| 1/8 B | 8/9 C |
```

- A is the label
- B is the slider
- C is a number input

#### Complex knob grid
For Complex knobs we can do something like this

```
| 1/5 A             |
| 1/5 B             |
| 1/4 C & E | 4/5 G |
| 1/4 D & F | 4/5 H |
```

It should fill 4 columns, and you have 2 side by side

- A is the label
- B is the square, with a drag handle
- C & D should just say x & y and take up minimal space
- E & F should be slider inputs
- G & H should be number inputs

> Note C E & G or D F & H are just number inputs, I guess
  unlike the input number knob we put the label in the
  same row. Maybe this can be configurable.

Ultimately there is 2 values the x & y value, and three
different inputs to manage it. X is updated by the x axis
of the square input, but also the x slider and x number
input, all of these should update in sync. The same should
be done for Y respectively.

> Note any grid sizing i've mentioned above should be
  considered relative, and ideally would be defined with
  units that don't require knowing exactly what column it
  starts in, just that different parts take up N columns

#### Group knobs

These will just stack its items, and then prefix their
labels with the group name. So for the following definition

```
const config = { a: { kind: 'group', of: {
    b: { kind: 'color', ... }],
    c: { kind: 'color', ... }],
} } }
```

You'd have the labels "a's b" and "a's c"

### Web Components of layout

> Generally speaking, it should be assumed state passed by
  attributes should be treated as initial values, and as
  as internal state changes they can be ignored, but as
  they update assume internal state needs to reflect those
  new values.

> all web components for knobs will have a config property
  which resembles the objects in the types above.

- Knob Grid, it has the controls of the grid. Not configurable
  should just fill the space it container provides. The different
  web components used within it can make assumptions about the
  number of columns in the layout.
- Square input
  - Height will be determined by width
  - Props,
    - X (x [initial value])
    - Y (y [initial value])
    - X Range (x-min y-max)
    - Y Range (y-min y-max)
  - Events
    - onChange (a pair of numbers)
- Number Input
  - This should included in both the complex and number knob
  - Props
    - Label
    - Label id
    - Label positition, "inline" or "stacked"
      - Stacked in the number knob style
      - inline is the complex knob style
    - Value ([value] initial value)
  - Events
    - onChange (a single number)
- Color
  - This should use a colour input built in the browser.
  - Props

- Group
  - I think the simplest way to define these will be too go
    ```
    const element = document.createElement(...);
    element.config = <config of group>
    ```
    and then internally it figures out which component to use.

# Update

Something that was unclear previously was how engines interact
with the config panel. When an application is loaded, the engine
will be given an instance of a config panel controller, this is
basically just an object that wraps an instance of the config
panel element, which will be created with `render`.

```js
function installConfig() {
    const configEl = document.createElement('config-component');
    return {
        setConfig(knobs) {
            configEl.setKnobs(knobs);
        },
        clearConfig() {
            configEl.clearKnobs();
        }
    };
}
```

actually on second thought the engine will have access to an
instance of the configEl instead. But it will call those methods
to update the contents of the panel.

## Rendering updates

There is a function in `lib/util/render` which needs updating
but it can handle incremental updates to arbirary dom. Update
it to handle the behaviour of when knobs change.

## Event logic

Hopefully a similar approach handling updates can be done to
what is done in the navigation component.

## The Application engine

In the application engine factory an event listener will be
setup to update the knob state within the application engine.
But this also needs to be detached on closing of the
application. Possibly it makes more sense to setup an event
listener in lib/ui/application/create

# Layout Amendment

Turns out grid is not shared between shadow dom, which I
guess isn't too surpring. So here are some general layout
suggestions

- In the main grid Group should infer what grid it
  should have, it is possible this may need to be
  computed? Possibly needs to be set on ':host'?
- In the main grid Complex should have a span of 4
- Complex should setup its own grid but have 4 columns

# Implementation Notes

## Key Differences from Proposal

### Event Handling
- **Proposal**: Suggested using `render` utility with inline event handlers
- **Implementation**: Uses event delegation pattern with `shadowRoot.addEventListener()` for efficiency
- **Rationale**: Avoids event handler cleanup issues and improves performance

### DOM Updates
- **Proposal**: Expected incremental updates via `lib/util/render`
- **Implementation**: Uses `updateOn()` function that filters falsy elements and efficiently updates DOM
- **Rationale**: Handles conditional rendering (like optional labels) properly by converting falsy values to empty text nodes

### Component Architecture
- **Proposal**: Suggested web components with config properties
- **Implementation**: Uses attribute-based configuration with `observedAttributes` and `attributeChangedCallback`
- **Rationale**: Follows standard web component patterns for better integration

### Grid Layout
- **Proposal**: Expected shared grid context across shadow DOM boundaries
- **Implementation**: Each component sets `gridColumn: 'span N'` on `:host` and manages internal layout independently
- **Rationale**: Shadow DOM encapsulation prevents grid context sharing, requiring explicit span declarations

### Configuration Integration
- **Proposal**: Suggested `getConfig()` function approach
- **Implementation**: Uses static `config` objects evaluated by `evaluateKnob()` function in application engines
- **Rationale**: Simpler static configuration that's easier to integrate with existing application architecture
