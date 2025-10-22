# RFC 012 Document Events

## Options
### Option 1

Similar to what [elm does](https://guide.elm-lang.org/architecture/forms)
and similar things in the Haskell and Friends ecosystem and use
function for events.

- One reason I don't want to do this because it's not serialisable.

### Option 2

Partial events. Say you have an event type like this

```
type Event =
  | { kind: 'config', config: Config }
  | { kind: 'update', name: string, value: string }
```

You would define the event like this:

```
['input', { events: { change: { kind: 'update' } } }]
```

Which is somthing like

```
Omit<Event, 'name' | 'value'>
```

## Considerations

### Typing

Does it make sense to make the user end side of this type the events
provided in the tree? This risks significantly complicating the type
signatures, but it could work.

General idea:
- Document helper expects `E.Item<Event>` where the children
  return the type of event. If any child emits an event that
  isn't a subtype of `Event` it will be a type error.
  - If something returns `never` as event then it's fine and ignored.
- For Helpers
    - Event type of helper return value is just the type of their
      children. Maybe there are special kinds of helpers that transform
      the event type of their child.
- These types are ignored within the renderer, as ultimately it defers
  responsibilty to the caller of the render, which is the widget, and
  widget does the same but to the document widget.
