# Multi widget app layouts

> Status: Done 2025/06/13

Lets make easier to have 2 widgets side by side. We'll
want to do the following to implement this.

1. Allow Multi widgets to specify a gridTemplateColumn,
   as well as a few width break points.
2. By default each widget will occupy every column on
   their row.
3. At the widget (child) level let the child specify
   a gridColumn in the same way you would in css.
   However we will require to define one for each
   break point (defined in step 1).

## GridTemplateColumns and break points

In a multi widget lets define the gridTemplateColumns
and break points like so.

```
export const meta = {
  kind: 'multi',
  layout: {
    // we cannot use `repeat` here as we want to be able
    // to tell how many columns there are with little effort.
    // That said I would love to have the repeat syntax, but
    // we'll need to make sure we parse it correctly.
    gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr'],

    // there is an implict break point called 'default'
    // but here we have created a break point at max
    // width of 600
    breakpoints: { s: 600 },
  },
};
```

## Widget Child defining its gridColumn

Again by default each child wile have a gridColumn
that occupies every column unless specified otherwise. So:

- If you have a break point `s` with a grid of `1fr 1fr 1fr 1fr`
  - everything by will have a gridColumn of `span 4`, unless
    specified otherwise.
  - If something has a `default` (breakpoint) gridColum of
    `1 / 3`, it will still have a `s` gridColumn of `span 4`.
  - If something has a `s` gridColum of `1 / 3`, it will
    still have a `default` (breakpoint) gridColumn of `span 4`.
- a widget can specify a gridColumn for each breakpoint if
  it wants. A widget can also not specify any gridColumn at
  all, as a result, it will just occupy every column on it row.
- The layout should have a grid auto flow of rows (I believe
  this is already the case).

This should look like this roughly.


```
export const children = [
  {
    size: { gridColumn: { default: '1 / 2' }, ... },
    meta: { kind: 'Canvas2d', ... },
    // ...
  },
  {
    size: { gridColumn: { default: '2 / 3' }, ... },
    meta: { kind: 'Canvas2d', ... },
    // ...
  }
]
```

## Applying Updates

We don't want to update the break point every time someone
resizes the screen only when thresholds are passed and a
resize has resulted in entering a new breakpoint from an old
one. So we should add some state to the `MultiWidgetApplicationEngine`
that specifies the current breakpoint. And on resize we will
compute if the resize is still the same, if not then we will
go through and update the break points as necessary.

> So yes breakpoints will be determined by the container width
> not the window width.

### Setting the gridTemplateColumns

We should only need to do this once and we can do that on load
of the application. We can add an additional paramater to
`createGlobalStyles` for the gridTemplateColumns

### Mutating the containers

Widgets should expose a setStyle method which engines can call
in practise it will just be the multi, but maybe that will change
in future. Some usescases

1. Setting the gridColumn `widget.setStyle({ gridColumn: '1 / 3' })`
2. Unsetting the gridColumn `widget.setStyle({ gridColumn: undefined })`

The widgets from there will set these styles to their container element.

# Amendment

In order to not break resizing, children should just specify their
number of spans.

```
export const children = [
  {
    size: { gridColumn: { default: 1 }, ... },
    meta: { kind: 'Canvas2d', ... },
    // ...
  },
  {
    size: { gridColumn: { default: 1 }, ... },
    meta: { kind: 'Canvas2d', ... },
    // ...
  }
]
```

