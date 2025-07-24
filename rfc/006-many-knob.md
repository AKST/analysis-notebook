# RFC 006, Many Knob

> Status Done 2025-06-14

A knob type that allows scaling the numer of inputs.
Lets call it the many knob

## Example definition

Note each new entry for the knob comes with an
associated Id.

```
// assume all variables referenced in this example
// are placeholders for constants that might exist
// in practise but aren't too relevant to explaining
// how this works.
{
  kind: 'many',
  label: "Actor",
  /**
   * This tells you part of the config is configurable.
   * In practise that means we treat it as a format string
   * where the label specified for the child is used in
   * creating the field.
   */
  childTemplate: ['label'],
  /**
   * Internally within the many knob, when the name
   * for a new item is specified with a text input
   * that name is passed into the create function
   * and it should return config for that group.
   *
   * There should be enough information here to
   * create a config for the input. The `of` values
   * represent the default state of a new knob.
   */
  child: {
    kind: 'group',
    label: `Agent {label} Cost`,
    of: {
      point: {
        kind: 'complex',
        of: _c(DEFAULT_X, DEFAULT_Y),
        range: DEFAULT_RANGE,
      },
      color: {
        kind: 'color',
        of: DEFAULT_COLOR,
        label: null,
      },
    }
  },
  /**
   * Here is some default state for children,
   * it should also be consistent with the
   * value that this knob resolves too.
   *
   * The key in the `of` object represents the
   * label for the entry, and the value represents
   * the default state for that entry.
   */
  of: {
    a: { point: _c(.5, 1), color: COLOR.CYAN  },
    b: { point: _c(2, 2), color: COLOR.YELLOW  },
    c: { point: _c(1, .5), color: COLOR.LIME  },
  },
}
```

## Tech debt prerequisets

### Implement `lib/util/update` function

I created a stub it would be good for you to flesh it
out, there's an example of its usage in this doc.

### Update `lib/util/render-dom` to handle dataset

I'd like to be able to define attributes like html like
```
<p data-blank="blah"></p>
```
as this in my config
```
['p', { dataset: { blank: 'blah' } }, []]
```

### Group knob
We need to extract the group knob into its own file,
similar to every other knob, so it has its own class.
This will make recursive usage easier.

Honestly I really dislike how its currently inlined
in the definition of `ui/config/create.js`

#### Group config `of` field

While I haven't shown this in any of the other
examples of the rest of the RFC here, in all the
other knobs they use `of` to specify a default
value. That's not how `of` is being used here,
lets replace `of` in the group knob with the field
`group`.

#### Consistent usage of 'of', field

Lets make it so all knobs can assume `of` is where
its and its own childrens default state is specified.

It would be good if `of` was consistent used to
represent the value that a knob resolves too.

### Start passing params through constructors

Instead of using the `renderElement` logic, lets
instead create instances of element store them
as state in the component and pass them into the
`renderElement` function as Elements.

Ideally there should be an implementation of group
knobs that exist indepenntly of the config menu.

The key and label value should not be private methods

### Initialisation of Config
We should have a recursive create function

```js
// need to implement this (should serialise the object) passed in
import { UnknownCaseError } from '??/util/types.js';

function createKnob(cfg, key) {
  // dependent on changes of above tech debt fix
  const value = cfg.of ?? undefined;

  // if label is set to `null` of `undefined` explictly then
  // do not fallback to `key`
  const label = 'label' in cfg ? cfg.label : key;

  switch (cfg.kind) {
    case 'group': {
      const children = Object.entries(cfg.group).map(([k, initCfg]) => (
        createKnob({ ...initCfg, of: cfg.of[k] || undefined }, k)
      ));

      return new GroupKnob(key, label, value, children);
    }

    case 'complex':
      return new ComplexKnob(key, label, value, cfg.range);

    case 'number':
      return new NumberKnob(key, label, value);

    case 'color':
      return new ColorKnob(key, label, value);

    case 'many':
      // internally creates
      return new ManyKnob(key, label, value, cfg.child, cfg.childTemplates);

    default:
      // don't try and handle this this throws when
      // there are issues with our implementation.
      throw new UnknownCaseError(cfg)
  }
}
```

This style of initialisation is not necessary for
other type of web components, however for this
part I think it makes sense seeing as we have
config object as an input making this a natural
fit for this type of initialisation pattern.

#### Relevance to many knob

Internally the many knob will use this to create
its own children.

#### Assume there's a setup method

When somethign creates knobs it should also call
setup on each one.

- In config panel this can be called each call to
  `createKnob` or whatever.
- In `GroupKnob` this can be done in its own setup method
- In `ManyKnob` this can be done ins own setup method

We shouldn't do any logic in the constructor method, so
we can assume each knob exposes a create method, and
each knob can assume this will be called.

### Create ui/inputs
Firstly the implementation of knobs should remain
where they are `lib/ui/config/knobs` but we should
extract the input portion into `ui/input`. So we
can reuse different input types amoungst the knobs
and components outside the config config panel.

These should have the `observedAttributes` and
logic for `attributeChangedCallback`, whereas
with knob as we'll be defined by constructor
we don't need to worry about that.

The `ui/input` web components should fire their
own change events, however the knobs should
intercept them by listening to their shadowRoot
and bubble up the event ensuring the config
receivives updates for the different knobs in
a consistent structure.

#### Styles
As we extract these we should move our styles into them.

#### General assumptions
- These inputs will assume they are created via
  create element and they are configured by their attributes.
- They should also have methods like setValue for setting
  their value without rerendering.
- They should fire the event `change` on input change.

### Knobs sending updates to ui/config/create

We should use a knobChange event instead where
the knob id is specified in the details field.
We should not propagate group information as
the panel only needs to know its direct child
has updated. And a group will send its child
up as an object and the parent just assigns
that to the currentValues.

#### Group knob should

The Group knob can expect its child to provide
information to it the same way a child in the
config panel does to it via the knobChange event
and it should maintain its own internal state.
When it receives an update it should send it to
its parent.

## Changes of priorities since RFC 000

In RFC 000 quite a bit of emphasis was placed on
a grid system. While proportionally I'd like
complex knobs to not take up as much space, and
I want to retain as much of the current layout as
possible, I wouldn't mind simplfiying where it
makes sense.

## Many Knob
### Vague implementation

```
import { update } from '??/lib/util/object.js';

// purely updates cfg to create a new
function expandChildConfig(label, cfg, templates) {
  const apply = (cfg, next) => update(cfg, next, value => {
    const obj = { label };
    return value.replace(/{(\w+)}/g, (m, k) => obj[k] || m);
  });

  // templates are split by '.'
  return templates.map(t => t.split('.')).reduce(apply, cfg);
}

export class ManyKnob {
  #child; // child config
  #state;
  #childTemplates

  // initialised in setup
  #childKnobs = null;

  constructor(key, label, state, child, childTemplates) {
    this.key = key
    this.label = label
    this.#child = child
    this.#state = state
    this.#childTemplates = childTemplates
  }

  setup() {
    // some initial setup logic.
    #childKnobs = Object.entries(this.#state).map((k, value) => {
      const expanded = expandChildConfig(
        k,
        this.#child,
        this.#childTemplates,
      );
      // same create knob as specified in the tech debt
      return [k, createKnob({ expanded, ...value } , k)]
    })

    // some other logic
  }

  #childCreate(name, ...) {
    // similar logic to setup
    // dispatch update to parent
    // ensure render occurs.
  }

  // wired up somewhere
  #childChange(...) {
    // update state
    // dispatch to parent as change event
  }

  // wired up somewhere
  #childDelete(button) {
    // remove from this.#childKnobs
    // remove from this.#state
    // dispatch update to parent as change event
  }

  render() {
    const delBtnCfg = { class: 'delete-button', dataset: { knob: id } };
    // example of rendering approach
    updateOn(this.shadowRoot, [
      ['style', {}, [getStyle()]],
      ['div', { class: 'container' }, (
        this.#childKnobs.map(([id, knob]) => (
          ['div', { class: 'knob-container' }, [
            knob,
            ['button', delBtnCfg, ['Delete']],
          ]]
        ))
      )],
    ]);

    // setup event listeners
  }
}

function getStyle() { /* ... */ }
```

### Edgecases

- No children, then state should be `{}`.
- There's no maximum numer of allowed children


### Appearance

This will like the rest of the config panel
but above its contents will be an input
labelled "A new <LABEL>".

#### Layout

The proportion of the contents of the knob
should be consistent with the layout as if
the indivisual knobs were defined seperately.

- So if a knob's width is half the column it
  should continue to do so when its an input of
  this component.
- If a knob is full width outside the many knob
  it should be full width inside the many knob.

It's possible the container styles coudl be shared
between these 2 knobs, are there's a common component
shared between the 2 components.

#### Layout Items

- A label similar style to other knobs (such as group)
- A text input

### Text input `ui/input/text`

This component should be used in the many component.

### Removing Options

How do this exactly, I am unsure but there should be
a button next to each item in a group (maybe the label,
or maybe below the input), allowing the removal of the
item.

#### Path forward

For the sake of keeping this RFC scope reasonable
There should be a small button below each knob to
remove this that exists within the many knob.


## Summary hirachcy of config panel with this change
This section to clarify the various changes and
should be read after reading the other tech debt
sections

```
inferface ConfigPanel<Config> {
  #currentValues: { Key in Config => Key: Config[Key].Value }

  #children: Record<string, AbstractKnob>

  event(in) changeKnob(detail: { key, value })
    from: child knobs
    behaviour:
      - update state
      - fire configChange
      - assume children did their own rendering

  event(out) configChange(values: #currentValues })
}

interface AbstractKnob {
  type Value

  #currentValue: Value
  #label: string
  #key: string
  event(out) changeKnob(detail: { key, value })

  method setup();
}

inferface GroupKnob<Config>  extends AbstractKnob {
  type Value = { Key in Config => Key: Config[Key].Value }

  #children: Record<string, AbstractKnob>

  event(in) changeKnob(detail: { key, value })
    from: child knobs
    behaviour:
      - update state
      - fire changeKnob
      - assume children did their own rendering
}

interface ManyKnob<Config> extends AbstractKnob {
  type Value = { Key in Config => Key: Config[Key].Value }

  #children: Record<string, AbstractKnob>

  event(in) childDelete(name)
    from: child delete button
    behaviour:
      - create child
      - update state
      - fire changeKnob to parent.
      - rerender

  event(in) childCreate(name)
    from: text input
    behaviour:
      - create child
      - update state
      - fire changeKnob to parent.
      - rerender

  event(in) changeKnob(detail: { key, value })
    from: child knobs
    behaviour:
      - update state
      - fire changeKnob
      - assume children did their own rendering
}

interface ComplexKnob extends AbstractKnob {
  type Value = ComplexNumber

  event(in) change(detail: ...)
    from: 'ui/inputs/number' (x or y) or `ui/input/square`
    behaviour:
      - update state
      - fire changeKnob
}

interface NumberKnob extends AbstractKnob {
  type Value = number

  event(in) change(detail: ...)
    from: 'ui/inputs/number'
    behaviour:
      - update state
      - fire changeKnob
}

interface ColorKnob extends AbstractKnob {
  type Value = number (representing a color)

  event(in) change(detail: ...)
    from: 'ui/inputs/color'
    behaviour:
      - update state
      - fire changeKnob
}
```

Note `AbstractKnob` doesn't really exist, it's just
a concept of a hypothetical interface / protocol

## Suggestioned series of steps

This is mostly a suggestion, and feedback and deviation is
welcomed if means there a smoother less disruptive series
of changes.

- Carry out any techinical debt not dependent on anything
- Extract inputs into `ui/inputs`
- Make the all the techincal debt changes relating to knobs
  and the config panel
- Implement Many knob

# Update

- inputs have be refactored out
- config panel has mostly been refactored.
- layout is handled by ui/config/common/layout
  - this is how layout logic is shared between group and config panel

I would refer to the patterns seen in ui/config/knobs to get an
idea how to implement the many knob at this stage.

## new schema


```
// assume all variables referenced in this example
// are placeholders for constants that might exist
// in practise but aren't too relevant to explaining
// how this works.
{
  kind: 'many',
  label: "Actor",
  /**
   * Internally within the many knob, when the name
   * for a new item is specified with a text input
   * that name is passed into the create function
   * and it should return config for that group.
   *
   * There should be enough information here to
   * create a config for the input. The `of` values
   * represent the default state of a new knob.
   */
  create: id => {
    kind: 'group',
    label: `Agent ${id} Cost`,
    of: {
      point: {
        kind: 'complex',
        of: _c(DEFAULT_X, DEFAULT_Y),
        range: DEFAULT_RANGE,
      },
      color: {
        kind: 'color',
        of: DEFAULT_COLOR,
        label: null,
      },
    }
  },
  /**
   * Here is some default state for children,
   * it should also be consistent with the
   * value that this knob resolves too.
   *
   * The key in the `of` object represents the
   * label for the entry, and the value represents
   * the default state for that entry.
   */
  of: {
    a: { point: _c(.5, 1), color: COLOR.CYAN  },
    b: { point: _c(2, 2), color: COLOR.YELLOW  },
    c: { point: _c(1, .5), color: COLOR.LIME  },
  },
}
```

