# RFC 008 view port projection

Currently it's only possible to scale the viewport
of a canvas 2d widget by an origin and a scale, I'd
like for there to be an option to allow an absolute
viewport dimension as well.

> Read this as a stream of conciousness if later parts
> contridict earlier parts defer to the later parts.

## The preserving existing method

This

```
export const meta = { kind: 'Canvas2d', origin: [x, y], scale: s }
```

should become (proj is short for projection)

```
export const meta = {
    kind: 'Canvas2d',
    proj: { kind: 'transform', origin: [x, y], scale: s },
}
```

proj should default to `{ kind: 'transform', origin: [0, 0], scale: 1 }`
if it is note specified.

Note the `proj.scale` and `proj.origin` in a transform
projection should behave the exact same as the
current `meta.scale` and `meta.origin`

> Note the origin is negated after being turned into
  a complex number for the transform logic, let this
  remain a quirk specific to the transform projection.
  You can see this in action in ui/application/widget/canvas

## Absolute viewport dimentions

This is how we should define absolute viewports

```
export const meta = {
    kind: 'Canvas2d',
    proj: { kind: 'viewbox', origin: [x, y], width: w, height: h },
}
```

If I want a view port where the bottom left was 0 0 and the
width was 500 and height was 5, I would do this.

```
export const meta = {
    kind: 'Canvas2d',
    proj: {
        kind: 'viewbox',
        origin: [0, 0],
        width: 500,
        height: 5,
    },
}
```

Note this is how the points map to the canvas not, the width of size of the canvas.

## Viewbox projection
### Variants

Actually `viewbox` doesn't exist it is actually 2
seperate variation.

- `{ kind: 'viewbox-absolute' }`
  - Default
  - Origin and height and width are all required
  - Aspect ratio is not preserved

- `{ kind: 'viewbox-min' ... }`
  - origin and width and height need defining
  - Viewport will have 1:1 aspect ratio
  - Viewport must be the smallest viewport
    that maintains that aspect ratio while
    including the width and height, with the
    area specified from the origin and max
    along the height and width being centered
    in the available space.

## Implementaion details

We'll want most of this logic to be abstracted by
Viewport, and ViewportConstraint and anything
interacting with them should remain the same, with
the exception of any factory or initialising code
(such as the create and install function).

### Viewport

- The interface should remain the same
- Existing behaviour should be preserved for
  anything using the current behaviour, however
  everything using that will need to specify their
  viewport in terms of the transform projection

### ViewportConstraint

The interface should remain the same

#### Creating the viewport constraints

We can create a factory function, called
`createViewportConstraints`, and it should
take the projection and handle any conditional
logic in creating viewport constraints.


