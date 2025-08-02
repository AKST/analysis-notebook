# RFC 011: Microeconomics model

## Status
Draft - 29th July 2025

## Claude instructions
Do no look at the implementation of the earlier version
or its tests as they are incomplete and occasionally wrong
and misleadings, use microeconomic theory to determine
the correct behaviour within the defined interface.

- reuse types here `lib/base/econ/types.ts`
- Implment tests here `lib/base/econ/tests/market_2.test.ts`
- Implment module here `lib/base/econ/market_2.js`

Implementation is written in Javascript, however types are
defined in typescript and are accessed in JS by doctype,
any solution inconsistent with this constraint is useless.

## Summary

I want to rewrite `lib/base/econ/{solver,market}.js` (do no read it)

And I want to implement a solver for microeconomic problems. Given
these inputs

- Market curves (in terms of an intercept and multiplier)
  - A local supply curve
  - A local demand curve
  - Each curve can have positive and negative externalities
- Price controls, binding only when equilibrium goes below threshold
  - An optional price floor
  - An optional price ceiling
- Unit Transfers Taxes/Subsidies
  - Seperate Consumer and producer Unit Taxes and subsidies.
    - This matters once we have price floors or ceilings.
- Trade
  - World price
  - Assuming there are a number of states
    - Permit only exports (even if local price is above world price)
    - Permit only imports (even if local price is below world price)
    - Permit either
  - Permitting is different from whether we actually do import or
    export, we obviously cannot import if its not permitted but when
    it is we still obviously wont the local price is lower.
  - Import Quotas
    - Allow supply to import N units from the world and supply locally.

## The problem

All of the above is quite simple in isolation, but together it starts to
get confusing. I need to figure out the structure and order of things.
