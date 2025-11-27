/**
 * @import { E } from '../../prelude-type.ts';
 */

import { text } from '@prelude-uni/components.js';
import { mathml, doc } from '@app/prelude.js';
import { parensC, parensB, SPECIAL, abs, annotationOver, rows, parensA, call, table, op, sum, piecewise, neg } from '@prelude-uni/mathml.js';

const { mi, mover, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac, munderover } = mathml;
const { eqId, eq, add, minus, div, mul0, mul, gteq, lt } = op;
const { beta, mu, delta, kappa, nu, Gamma, tau, theta, sigma, rho, omega, alpha, xi, zeta, phi, pi } = SPECIAL.greek;
const { exists } = SPECIAL.rel;
const { and } = SPECIAL.operation;

const fn = {
  p: call.attr({ fn: msub(mi`p`, mi`t`) }),
  q: call.attr({ fn: msub(mi`q`, mi`t`) }),
  T: call.attr({ fn: mi`T` }),
  s: call.attr({ fn: msub(mi`s`, mi`h`) }),
  lambda: call.attr({ fn: mi`𝜆` }),
  H: call.attr({ fn: mi`H` }),
  u: call.attr({ fn: mi`u` }),
  Omega: call.attr({ fn: mi`Ω` }),
  log: call.attr({ fn: mtext`log` }),
};

// Image #1: E∑(t=0 to ∞) β^t u(c_t, h_t, l_t)
export const maximise = text.figure(
  mathml.math(
    mrow(
      mi`E`,
      sum({ inc: eq.sup(mi`t`, mn(0)), max: mi`∞` })(
        msup(beta, mi`t`),
        call.attr({ fn: mi`u` })(
          msub(mi`c`, mi`t`),
          msub(mi`h`, mi`t`),
          msub(mi`l`, mi`t`)
        ),
      ),
      mo`,`,
    )
  ),
  doc.figcaption`Maximise`
);

// Image #2: y_t = { w_t ε μ_t l_t if s_t = 0; di if s_t = 1 }
export const earnings = text.figure(
  mathml.math(
    eq(
      msub(mi`y`, mi`t`),
      piecewise(
        {
          then: mul0(
            msub(mi`w`, mi`t`),
            mi`𝜖`,
            msub(mu, mi`t`),
            msub(mi`l`, mi`t`),
          ),
          cond: eq(msub(mi`s`, mi`t`), mn(0)),
        },
        {
          then: mi`di`,
          cond: eq(msub(mi`s`, mi`t`), mn(1)),
        }
      )
    )
  ),
  doc.figcaption`Earnings`
);

// Image #3: a_{t+1} = { m_{t+1} if h_{t+1} < ẖ°; m_{t+1} + p_t(h_{t+1})h_{t+1} if h_{t+1} ≥ ẖ° }
export const assets = text.figure(
  mathml.math(
    eq(
      msub(mi`a`, add.sub(mi`t`, mn(1))),
      piecewise(
        {
          then: msub(mi`m`, add.sub(mi`t`, mn(1))),
          cond: lt(msub(mi`h`, add.sub(mi`t`, mn(1))), msup(mi`ẖ`, mi`o`)),
        },
        {
          then: add(
            msub(mi`m`, add.sub(mi`t`, mn(1))),
            mul0(
              fn.p(
                msub(mi`h`, add.sub(mi`t`, mn(1)))
              ),
              msub(mi`h`, add.sub(mi`t`, mn(1)))
            )
          ),
          cond: gteq(msub(mi`h`, add.sub(mi`t`, mn(1))), msup(mi`ẖ`, mi`o`)),
        }
      )
    )
  ),
  doc.figcaption`Assets`
);

// Image #4: { m_{t+1} ≥ 0 if h_{t+1} < ẖ°; m_{t+1} ≥ -mp_t(h_{t+1})h_{t+1} if h_{t+1} ≥ ẖ° }
export const financialAssets = text.figure(
  mathml.math(
    piecewise(
      {
        then: gteq(msub(mi`m`, add.sub(mi`t`, mn(1))), mn(0)),
        cond: lt(msub(mi`h`, add.sub(mi`t`, mn(1))), msup(mi`ẖ`, mi`o`)),
      },
      {
        then: gteq(
          msub(mi`m`, add.sub(mi`t`, mn(1))),
          neg(
            mul0(
              mi`m`,
              fn.p(msub(mi`h`, add.sub(mi`t`, mn(1)))),
              msub(mi`h`, add.sub(mi`t`, mn(1)))
            )
          )
        ),
        cond: gteq(msub(mi`h`, add.sub(mi`t`, mn(1))), msup(mi`ẖ`, mi`o`)),
      }
    )
  ),
  doc.figcaption`Financial Assets`
);

// Image #5: r_t = { r_t^d if m_t ≥ 0; r_t^m if m_t < 0 }
export const rate = text.figure(
  mathml.math(
    eq(
      msub(mi`r`, mi`t`),
      piecewise(
        {
          then: msubsup(mi`r`, mi`t`, mi`d`),
          cond: gteq(msub(mi`m`, mi`t`), mn(0)),
        },
        {
          then: msubsup(mi`r`, mi`t`, mi`m`),
          cond: lt(msub(mi`m`, mi`t`), mn(0)),
        }
      )
    )
  ),
  doc.figcaption`Rate`
);

// Image #6: c_t + a_{t+1} + s_h(h_t, h_{t+1}) = y_t - T(y_t) + (1 + r_t)m_t + (1 - δ)p_t(h_t)h_t + κ_t
export const homeOwnerBudget = text.figure(
  mathml.math.attr({ className: 'wideMath' })(
    eq(
      add(
        msub(mi`c`, mi`t`),
        msub(mi`a`, add.sub(mi`t`, mn(1))),
        fn.s(
          msub(mi`h`, mi`t`),
          msub(mi`h`, add.sub(mi`t`, mn(1)))
        )
      ),
      add(
        msub(mi`y`, mi`t`),
        neg(fn.T(msub(mi`y`, mi`t`))),
        mul0(
          add.paren(mn(1), msub(mi`r`, mi`t`)),
          msub(mi`m`, mi`t`)
        ),
        mul0(
          minus.paren(mn(1), delta),
          fn.p(msub(mi`h`, mi`t`)),
          msub(mi`h`, mi`t`)
        ),
        msub(kappa, mi`t`)
      )
    )
  ),
  doc.figcaption`Home Owner Budget`
);

// Image #7: c_t ≥ κ_t
export const consumptionChoice = text.figure(
  mathml.math(
    gteq(
      msub(mi`c`, mi`t`),
      msub(kappa, mi`t`)
    )
  ),
  doc.figcaption`Consumption Choice`
);

// Image #8: c_t + a_t(h_t)h_t + a_{t+1} + s_h(h_t, h_{t+1}) = y_t - T(y_t) + (1 + r_t)m_t + κ_t
export const renterBudget = text.figure(
  mathml.math.attr({ className: 'wideMath' })(
    eq(
      add(
        msub(mi`c`, mi`t`),
        mul0(
          fn.q(msub(mi`h`, mi`t`)),
          msub(mi`h`, mi`t`)
        ),
        msub(mi`a`, add.sub(mi`t`, mn(1))),
        fn.s(
          msub(mi`h`, mi`t`),
          msub(mi`h`, add.sub(mi`t`, mn(1)))
        )
      ),
      add(
        msub(mi`y`, mi`t`),
        neg(fn.T(msub(mi`y`, mi`t`))),
        mul0(
          add.paren(mn(1), msub(mi`r`, mi`t`)),
          msub(mi`m`, mi`t`)
        ),
        msub(kappa, mi`t`)
      )
    )
  ),
  doc.figcaption`Renter Budget`
);

// Image #9: c_t + [q_t(h_t)h_t - v_t] + a_{t+1} + s_h(h_t, h_{t+1}) = y_t - T(y_t) + (1 + r_t)m_t + κ_t
export const hcvRecipientBudget = text.figure(
  mathml.math.attr({ className: 'wideMath' })(
    eq(
      add(
        msub(mi`c`, mi`t`),
        minus.square(
          mul0(
            fn.q(msub(mi`h`, mi`t`)),
            msub(mi`h`, mi`t`)
          ),
          msub(nu, mi`t`)
        ),
        msub(mi`a`, add.sub(mi`t`, mn(1))),
        fn.s(
          msub(mi`h`, mi`t`),
          msub(mi`h`, add.sub(mi`t`, mn(1)))
        )
      ),
      add(
        msub(mi`y`, mi`t`),
        neg(fn.T(msub(mi`y`, mi`t`))),
        mul0(
          add.paren(mn(1), msub(mi`r`, mi`t`)),
          msub(mi`m`, mi`t`)
        ),
        msub(kappa, mi`t`)
      )
    )
  ),
  doc.figcaption`HCV Recipient Budget`
);

// Image #10: c_t + a_{t+1} + s_h(h_t, h_{t+1}) = y_t - T(y_t) + (1 + r_t)m_t + κ_t
export const homelessBudget = text.figure(
  mathml.math.attr({ className: 'wideMath' })(
    eq(
      add(
        msub(mi`c`, mi`t`),
        msub(mi`a`, add.sub(mi`t`, mn(1))),
        fn.s(
          msub(mi`h`, mi`t`),
          msub(mi`h`, add.sub(mi`t`, mn(1)))
        )
      ),
      add(
        msub(mi`y`, mi`t`),
        neg(fn.T(msub(mi`y`, mi`t`))),
        mul0(
          add.paren(mn(1), msub(mi`r`, mi`t`)),
          msub(mi`m`, mi`t`)
        ),
        msub(kappa, mi`t`)
      )
    )
  ),
  doc.figcaption`Homeless Budget`
);

// Image #11: V_t(Γ) = max_{c_t, h_{t+1}, l_t, a_{t+1}} u(c_t, h_t, l_t) + β E_t V_{t+1}(Γ')
export const individualStateValueFunction = text.figure(
  mathml.math(
    eq(
      call.attr({ fn: msub(mi`V`, mi`t`) })(Gamma),
      mul0(
        munder(
          mtext`max`,
          mrow(
            msub(mi`c`, mi`t`),
            mo`,`,
            msub(mi`h`, add.sub(mi`t`, mn(1))),
            mo`,`,
            msub(mi`l`, mi`t`),
            mo`,`,
            msub(mi`a`, add.sub(mi`t`, mn(1)))
          )
        ),
        add(
          call.attr({ fn: mi`u` })(
            msub(mi`c`, mi`t`),
            msub(mi`h`, mi`t`),
            msub(mi`l`, mi`t`)
          ),
          mul0(
            beta,
            msub(mi`E`, mi`t`),
            call.attr({ fn: msub(mi`V`, add.sub(mi`t`, mn(1))) })(
              msup(Gamma, mo`′`)
            )
          )
        ),
      )
    )
  ),
  doc.figcaption`Individual State Value Function`
);

// Image #12: Γ = (m_t, h_t, μ_t, ε, z_t, s_t, i_t^v)
export const individualState = text.figure(
  mathml.math(
    eq(
      Gamma,
      call.attr({ fn: mrow() })(
        msub(mi`m`, mi`t`),
        msub(mi`h`, mi`t`),
        msub(mu, mi`t`),
        mi`𝜖`,
        msub(mi`z`, mi`t`),
        msub(mi`s`, mi`t`),
        msubsup(mi`i`, mi`t`, mi`v`)
      )
    )
  ),
  doc.figcaption`Individual State`
);

// Image #13: State machine with equation references
export const stateMachine = text.figure(
  mathml.math(
    piecewise(
      {
        then: mtext`Home Owner Budget`,
        cond: gteq(msub(mi`h`, mi`t`), msup(mi`ẖ`, mi`o`)),
      },
      {
        then: mtext`Renter Budget`,
        cond: mrow(
          lt(mi`ẖ`, msub(mi`h`, mi`t`)),
          mo`<`,
          msup(mi`ẖ`, mi`o`),
          and,
          eq(msub(mi`i`, mi`v`), mn(0))
        ),
      },
      {
        then: mtext`HCV Budget`,
        cond: eq(msub(mi`i`, mi`v`), mn(1)),
      },
      {
        then: mtext`Homeless Budget`,
        cond: eq(msub(mi`h`, mi`t`), mi`ẖ`),
      }
    )
  ),
  doc.figcaption`State Machine`
);

// Image #14: l_t ∈ {0, 1} if z_t = 0; l_t ∈ {0} if z_t = 1
export const leisureDynamics = text.figure(
  mathml.math(
    mrow(msub(mi`l`, mi`t`), exists, piecewise(
      {
        then: parensC(mn(0), mo`,`, mn(1)),
        cond: eq(msub(mi`z`, mi`t`), mn(0)),
      },
      {
        then: parensC(mn(0)),
        cond: eq(msub(mi`z`, mi`t`), mn(1)),
      }
    )),
  ),
  doc.figcaption`Leisure Dynamics`
);

// Image #15: q_t(h_t) = (r_t + δ)p_t(h_t)
export const rentalRate = text.figure(
  mathml.math(
    eq(
      fn.q(msub(mi`h`, mi`t`)),
      mul0(
        add.paren(msub(mi`r`, mi`t`), delta),
        fn.p(msub(mi`h`, mi`t`))
      )
    )
  ),
  doc.figcaption`Rental Rate`
);

// Image #16: v_t = min{v̄, max{0, q_t(h_t)h_t - 0.3y_t}}
export const voucherPortionOfRentalPayments = text.figure(
  mathml.math(
    eq(
      msub(nu, mi`t`),
      mrow(
        mtext`min`,
        parensC(
          mi`ν̄`,
          mo`,`,
          mtext`max`,
          parensC(
            mn(0),
            mo`,`,
            minus(
              mul0(
                fn.q(msub(mi`h`, mi`t`)),
                msub(mi`h`, mi`t`)
              ),
              mul0(mn(0.3), msub(mi`y`, mi`t`))
            )
          )
        )
      )
    )
  ),
  doc.figcaption`Voucher Portion of Rental Payments`
);

// Image #17: h ∈ ({h_i}_{i=1}^n, h̲)
export const houseSizeSet = text.figure(
  mathml.math(
    mrow(
      mi`h`,
      exists,
      parensA(
        parensC(
          msubsup(mi`h`, mi`i`, mrow())
        ),
        msubsup(mrow(), eq.sup(mi`i`, mn(1)), mi`n`),
        mo`,`,
        mi`ẖ`
      )
    )
  ),
  doc.figcaption`House Size Set`
);

// Image #18: {h_i}_{i=1}^n
export const housingOnMarket = text.figure(
  mathml.math(
    mrow(
      parensC(
        msubsup(mi`h`, mi`i`, mrow())
      ),
      msubsup(mrow(), eq.sup(mi`i`, mn(1)), mi`n`)
    )
  ),
  doc.figcaption`Housing on Market`
);

// Image #19: κ_t = κ̄ - [y_t - T(y_t) + (1 + r_t)m_t]
export const foodStampsMeansTesting = text.figure(
  mathml.math(
    eq(
      msub(kappa, mi`t`),
      minus(
        mi`κ̄`,
        minus.square(
          add(
            msub(mi`y`, mi`t`),
            neg(fn.T(msub(mi`y`, mi`t`))),
            mul0(
              add.paren(mn(1), msub(mi`r`, mi`t`)),
              msub(mi`m`, mi`t`)
            )
          )
        )
      )
    )
  ),
  doc.figcaption`Food Stamps Means Testing Criteria`
);

// Image #20: T(y_t) = {0, if on DI; y_t - τ_2y_t^{1-τ_1}, if otherwise}
export const taxFunction = text.figure(
  mathml.math(
    eq(
      fn.T(msub(mi`y`, mi`t`)),
      piecewise(
        {
          then: mn(0),
          cond: mtext`on DI`,
        },
        {
          then: minus(
            msub(mi`y`, mi`t`),
            mul0(
              msub(tau, mn(2)),
              msup(
                msub(mi`y`, mi`t`),
                minus.paren(mn(1), msub(tau, mn(1)))
              )
            )
          ),
        }
      )
    )
  ),
  doc.figcaption`Tax Function`
);

// Image #21-23: Segregated housing market clearance (3 rows)
export const segregatedHousingMarketClearance = text.figure(
  mathml.math(
    rows(
      mrow(
        munder(
          mi`∑`,
          mrow(Gamma, mo`,`, mi`h`, mo`=`, msub(mi`h`, mn(1)))
        ),
        mul0(
          mi`h`,
          fn.lambda(Gamma)
        ),
        mo`=`,
        call.attr({ fn: msub(mi`H`, mi`i`) })(
          fn.p(msub(mi`h`, mi`i`))
        ),
        mo`,`
      ),
      mrow(
        munder(
          mi`∑`,
          mrow(Gamma, mo`,`, mi`h`, mo`=`, msub(mi`h`, mn(2)))
        ),
        mul0(
          mi`h`,
          fn.lambda(Gamma)
        ),
        mo`=`,
        call.attr({ fn: msub(mi`H`, mi`i`) })(
          fn.p(msub(mi`h`, mi`i`))
        ),
        mo`,`
      ),
      mrow(
        munder(
          mi`∑`,
          mrow(Gamma, mo`,`, mi`h`, mo`≥`, msub(mi`h`, mn(3)))
        ),
        mul0(
          mi`h`,
          fn.lambda(Gamma)
        ),
        mo`=`,
        call.attr({ fn: msub(mi`H`, mi`i`) })(
          fn.p(msub(mi`h`, mi`i`))
        ),
        mo`,`
      )
    )
  ),
  doc.figcaption`Segregated Housing Market Clearance`
);

// Image #24: Government budget constraint
export const governmentBudgetConstraint = text.figure(
  mathml.math.attr({ className: 'wideMath' })(
    eq(
      mul0(
        munder(mi`∑`, Gamma),
        mul0(
          fn.T(mi`y`),
          fn.lambda(Gamma)
        ),
      ),
      add.sub(
        mi`G`,
        mul0(
          munder(mi`∑`, Gamma),
          parensB(add.sub(
            call.attr({ fn: mi`κ` })(Gamma),
            call.attr({ fn: mi`di` })(Gamma)
          )),
          fn.lambda(Gamma)
        ),
        mul0(
          fn.q(msub(mi`h`, mn(1))),
          mi`ẖ`,
          pi
        ),
        munder(mi`∑`, mrow(Gamma, mo`,`, eq(msubsup(mi`i`, mrow(), mi`v`), mn(1)))),
        mul0(
          call.attr({ fn: nu })(Gamma),
          fn.lambda(Gamma)
        ),
      )
    )
  ),
  doc.figcaption`Government Budget Constraint`
);

// Image #25: Fractions of individuals who are homeless
export const fractionsHomeless = text.figure(
  mathml.math(
    eq(
      pi,
      mrow(
        munder(mi`∑`, mrow(Gamma, mo`,`, mi`h`, mo`=`, mi`ẖ`)),
        fn.lambda(Gamma)
      ),
    )
  ),
  doc.figcaption`Fractions of Individuals Who Are Homeless`
);

// Image #26-27: Population distribution (2 rows)
export const populationDistribution = text.figure(
  mathml.math(
    rows(
      eq(
        call.attr({ fn: msup(mi`λ`, mo`′`) })(msup(Gamma, mo`′`)),
        mul0(
          munder(mi`∑`, Gamma),
          fn.Omega(mu, msup(mu, mo`′`)),
          call.attr({ fn: msub(mi`Ω`, mi`z`) })(mi`z`, msup(mi`z`, mo`′`)),
          call.attr({ fn: msub(mi`Ω`, mi`v`) })(msubsup(mi`i`, mrow(), mi`v`), msup(msubsup(mi`i`, mrow(), mi`v`), mo`′`)),
          msub(mi`I`, msup(mi`a`, mo`′`)),
          msub(mi`I`, msup(mi`h`, mo`′`)),
          fn.lambda(Gamma),
        )
      ),
      eq(
        msup(mi`λ`, mo`′`),
        mi`λ`,
        msup(mi`λ`, mo`*`)
      )
    )
  ),
  doc.figcaption`Population Distribution`
);

// Image #28: Preferences
export const preferences = text.figure(
  mathml.math(
    eq(
      fn.u(mi`c`, mi`h`, mi`l`),
      mfrac(
        msup(
          minus.square(
            mul0(
              msup(mi`c`, minus.sub(mn(1), msub(theta, mn(1)), msub(theta, mn(2)))),
              msup(mi`h`, msub(theta, mn(1))),
              msup(
                minus.paren(mn(1), mul0(msub(phi, mi`l`), mi`l`)),
                msub(theta, mn(2))
              )
            )
          ),
          minus.paren(mn(1), sigma)
        ),
        minus(mn(1), sigma)
      )
    )
  ),
  doc.figcaption`Utility Function`
);

// Image #29: Labor productivity shocks (2 rows)
export const laborProductivityShocks = text.figure(
  mathml.math(
    rows(
      eq(
        fn.log(msub(mu, mi`t`)),
        add(xi, msub(alpha, mi`t`), msub(nu, mi`t`))
      ),
      eq(
        msub(alpha, mi`t`),
        add(
          mul0(rho, msub(alpha, minus.sub(mi`t`, mn(1)))),
          msub(omega, mi`t`)
        ),
      )
    )
  ),
  doc.figcaption`Idiosyncratic Labor Productivity (1st row), Persistent Shock (2nd row)`
);

// Image #30: Housing supply function
export const housingSupplyFunction = text.figure(
  mathml.math(
    eq(
      call.attr({ space: false, fn: mo`H` })(call.attr({ space: false, fn: mo`p` })(mi`h`)),
      mul0(
        msub(zeta, mn(2)),
        msup(fn.p(mi`h`), msub(zeta, mn(1)))
      )
    )
  ),
  doc.figcaption`Housing Supply Function`
);

// Image #31: Income tax function
export const incomeTaxFunction = text.figure(
  mathml.math(
    eq(
      fn.T(msub(mi`y`, mi`t`)),
      minus(
        msub(mi`y`, mi`t`),
        mul0(
          msub(tau, mn(2)),
          msubsup(
            mi`y`,
            mi`t`,
            minus.sup(mn(1), msub(tau, mn(1)))
          )
        )
      )
    )
  ),
  doc.figcaption`Income Tax Function`
);
