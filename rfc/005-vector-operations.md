# Vector Number type

> An update, this should be thought as allowing
> generallised 2d vectorspaces
>
> Another update since writing this complex has
> been moved to lib/util/math/numbers.js along
> with vector and matrix, it would be good to
> implement something similar there.

Complex numbers are sick and all, but real numbers
are worth using as well. In particular there is some
value being able to do much of what I'm doing in
complex numbers, with vectors.

I think I may need type classes of something to
implement this, or some kind of module that gets
passed around that provides a `fields` interface
(as in an algebric number field).

Apparently the term is either:

- `Isomorphic`
  - Describes their relationship precisely. ℂ and ℝ² are isomorphic as real vector spaces (same additive structure), and ℂ is isomorphic to ℝ² with the multiplication I mentioned above as real algebras.
- `Vector Space`
  - Vector Space is the most general term. Both ℝ² (2D real vectors) and ℂ (complex numbers) are vector spaces over ℝ, sharing the same additive structure: they have a zero element, addition is commutative and associative, and every element has an additive inverse

I think Vector space might be good enough.

# Concept

## Vector Space

A vector space should have the following definition

```
type VectorSpace = {
    xy()
    zero(): VectorSpace;
    add(a: VectorSpace, b: VectorSpace): VectorSpace;
    mul(a: VectorSpace, b: VectorSpace): VectorSpace;
    scale(a: VectorSpace, b: number): VectorSpace;
    invert(a: VectorSpace): VectorSpace;
};
```

In order to represent implement vector inversion,
we'll want to actually implement our vector as a
2x2 matrix, or prehaps our inverstion operation
like so.

```
[a -b]
[b  a]
```

Which is just complex number inversion. Maybe
we can call our typeclass Complex Vector or
something. Except we'll still be defining a
vector type, however we'll be passing our
vector space, which acts as an abstract
that handles all interactions with our number types.

# Vision

I don't mind if the implementation of them is slighly hairy
but I want usage of these to be painless

# Implementation
## Approach

## Changes to existing code.

> outdated

As a general rule, anything currently calling
ComplexNumber / c(0, 0), is currently coupled to
the complex number. We need to start by allowing
this aspect of those types to be parameterised.

Some examples:

- Viewport
- lib/2d/renders/grid
- lib/2d/convex-hull
- lib/2d/util::renderPlaceholder
- lib/2d/viewport-constraints
- lib/2d/viewport
- lib/ui/config/knobs/complex-input

These should be written in a way to be agnostic to
which vector space they're using. And coupling
should really happen at the lib/app/**/*.js level.
## Implement Details

### Matrices

These will be n by m matrices of no specific size.
We'll want some utilties like

- creating difference matrices of N size
- creating idenity matrices.
- one or zero matrice.

These should of course provide methods for
multiplication (matrix and element), inversion,
deteriminant, etc. Both this and vector will need
to do a number safety checks before they interact
given the fact these types can have variable length.
