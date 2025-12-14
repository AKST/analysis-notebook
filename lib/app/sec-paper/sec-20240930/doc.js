/**
 * @import { E, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as tables from './tables.js';
import * as mathml from './mathml.js';
import { doc } from '../../prelude.js';
import { readmore, dashbox, todo, infobox, defineTerm, text } from '@prelude-uni/components.js';
import { responsiveGridAutoRow as row, container, twoThree, twoColumns } from '@prelude-uni/layout.js';
import { createDoc } from '@prelude-uni/util.js';

const LINKS = {
  paper: text.a({ href: `https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4308222` }),
};

export const intro = createDoc(() => container(
  twoThree(
    doc.h1`
      Homelessness${doc.br()}
      ${doc.small.attr({ style: 'font-size: 14px' }).of(doc.address`
        By ${doc.a({ rel: 'author' }).t`Ayșe İmrohoroğlu`}
        and ${doc.a({ rel: 'author' }).t`Kai Zhao`}
      `)}
    `,
    infobox({ title: 'Resources' }).of(
      text.ul(
        doc.li`${LINKS.paper.t`Read paper here`}`,
      ),
    ),
  ),
));

export const definitions = createDoc(() => container(
  doc.h1`The Model`,
  twoThree(
    container(
      doc.h2`Formular`,
      dashbox(
        row([
          mathml.houseSizeSet,
          mathml.housingOnMarket,
        ], { columns: { desktop: 'auto auto' } }),
        mathml.maximise,
      ),
      doc.h4`Households`,
      dashbox(
        mathml.earnings,
        mathml.assets,
        mathml.financialAssets,
        mathml.rate,
      ),
      doc.h4`Budget Constraints`,
      dashbox(
        mathml.homeOwnerBudget,
        mathml.consumptionChoice,
        mathml.renterBudget,
        mathml.hcvRecipientBudget,
        mathml.homelessBudget,
      ),
      doc.h4`Value Function`,
      dashbox(
        mathml.stateMachine,
        mathml.individualStateValueFunction,
        mathml.individualState,
        mathml.leisureDynamics,
      ),
      doc.h3`Financial Institutions`,
      dashbox(mathml.rentalRate),
      doc.h3`Government`,
      dashbox(
        mathml.voucherPortionOfRentalPayments,
        mathml.foodStampsMeansTesting,
        mathml.taxFunction,
      ),
      doc.h3`Eqilibrium`,
      twoColumns(
        mathml.segregatedHousingMarketClearance,
        text.ul({ style: '--fontsize-body-m: 11px' }).of(
          doc.li`
            Assume economy is open and keep the factors
            prices ${doc.b`w`} and ${doc.b`r`} constant.
          `,
          doc.li`
            There are 3 segregated housing markets, ${vars.h1}
            and ${vars.h2}. The housing prices p(h) and rental
            rates q(h) are determined such that each of the
            segregated housing market clears.
          `,
          doc.li`Left hand denotes supply`,
        ),
      ),
      doc.hr(),
      doc.h4`Tax Revenue`,
      mathml.governmentBudgetConstraint,
      mathml.fractionsHomeless,
      doc.h4`Population`,
      mathml.populationDistribution,
      doc.h3`Calibration`,
      dashbox(
        doc.h4`Preferences`,
        mathml.preferences,
        doc.h4`Productivity and the Health Risk`,
        mathml.laborProductivityShocks,
        mathml.housingSupplyFunction,
        doc.p`
          The transaction cost in the housing market captures two types of costs: the real estate agent
          fees for selling an owned housing unit, and the transaction cost of finding a new housing unit
        `,
      ),
      doc.h3`Government Policy`,
      dashbox(
        doc.p`
          The maximum food stamp transfer κ is set to be
          5.8% of the average earnings based on the
          actual rules of the U.S. food stamp program
        `,
        mathml.incomeTaxFunction,
      )
    ),
    container(
      doc.h2`Defintions`,
      doc.dl(
        doc.dt`𝛽 (Subjective Discount Factor)`,
        doc.dt`${vars.ct} (Value Consumption)`,
        doc.dt`CRRA`,
        doc.dd`Constant relative risk aversion`,
        doc.dt`𝛿 (deprecation)`,
        doc.dt`di / DI (Disability insurance)`,
        doc.dt`𝜖 (permanent ability)`,
        doc.dt`𝜂 (loan-to-value constraint)`,
        doc.dt`G${doc.sub`t`}`,
        doc.dd`Governemnt Expenditure`,
        doc.dt`${vars.govtShelter} (govt shelter)`,
        doc.dt`h (house value)`,
        doc.dt`${vars.ht} (Housing Service)`,
        doc.dt`${vars.smallestH} (smallest household)`,
        doc.dt`HUD`,
        doc.dd`Department of Housing and Urban Development`,
        doc.dt`I${doc.sub`a`}`,
        doc.dd`Identicator function for financial assets`,
        doc.dt`I${doc.sub`h`}`,
        doc.dd`Identicator function for housing`,
        doc.dt`i${doc.sup`𝜈`}`,
        doc.dd`Voucher ellgibility`,
        doc.dt`𝜅${doc.sub`t`} (means tested transfer)`,
        doc.dt`𝜆(𝛤) Measure of indivisual type`,
        doc.dt`${vars.lt} (Leisure)`,
        doc.dd`
          ${vars.lt} ∈ {0, 1}.
          ${doc.br()}
          ${doc.br()}
          The amount of leisure is 1−${vars.phit}${vars.lt},
          with ${vars.phit} being the time cost of being
          employed.
        `,
        doc.dt`m${doc.sub`t`} (financial asset)`,
        doc.dt`${vars.mut} (Labor income risk)`,
        doc.dd`
          Labor income risk comes from idiosyncratic productivity shock µt, which is governed by a
          first-order Markov Chain with the transition probability matrix Ω(µ, µ′)
          Also productivity shock.
        `,
        doc.dt`ν̄ (stock of HCV lottery winners)`,
        doc.dt`${vars.upsilont}`,
        doc.dd`voucher used in rental payment`,
        doc.dt`p${doc.sub`t`}(h) (house price of h)`,
        doc.dt`${vars.phit} (employment)`,
        doc.dd`time cost of being employed`,
        doc.dt`q${doc.sub`t`}(h) (rental rate of h)`,
        doc.dt`r${doc.sub`t`} (interest rate)`,
        doc.dt`r${doc.sub`t`}${doc.sup`d`} (deposit rate)`,
        doc.dt`r${doc.sub`t`}${doc.sup`m`} (mortgage rate)`,
        doc.dt`s${doc.sub`h`}(h${doc.sub`t`},h${doc.sub`t+1`})`,
        doc.dd`Transaction cost of deciding to move for a period`,
        doc.dt`s${doc.sub`t`}`,
        doc.dd`DI status`,
        doc.dt`SSI`,
        doc.dd`Supplemental Security Income`,
        doc.dt`𝜎`,
        doc.dd`Degreses of relative risk aversion, 3 is the middle of the range`,
        doc.dt`𝜏₁`,
        doc.dd`progressivity of the tax function`,
        doc.dt`𝜏₂`,
        doc.dd`controls level of income taxation`,
        doc.dt`𝜃₁ and 𝜃₂`,
        doc.dd`
          Govern the relative importance of the utility flow
          from housing services an dleisure in the the
          utility function.
        `,
        doc.dt`${vars.wt} (wage rate)`,
        doc.dd`Economy wide wage rate`,
        doc.dt`${vars.wt}𝜖${vars.mut} (indivisual labour income)`,
        doc.dt`${vars.yt} (income before tax)`,
        doc.dt`${vars.zt} (Health related risk)`,
        doc.dd`
          health-related risk is from a stochastic shock
        `,
        doc.dt`z`,
        doc.dd`health status`,
        doc.dt`ζ${doc.sub`di`}`,
        doc.dd`Unhealthy indivisual elligible for DI`,
        doc.dt`ζ${doc.sub`𝜈`} (HCV lottery probability)`,
        doc.dt`ζ${doc.sub`1`}`,
        doc.dd`Elasticity of housing supply`,
        doc.dt`ζ${doc.sub`2`}`,
        doc.dd`Portion of people whose rent is higher than 30% of their income`,
      ),
    ),
  ),
));

export const calibrationTable = createDoc(() => container(
  doc.h2`Calibration Table`,
  dashbox(
    doc.table.attr({ className: 'calibration' }).of(
      doc.tr(
        doc.th`Parameter`,
        doc.th`Description`,
        doc.th`Value`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-style: italic' }).t`Preferences`,
      ),
      doc.tr(
        doc.td`β`,
        doc.td`discount factor`,
        doc.td`0.98`,
      ),
      doc.tr(
        doc.td`θ${doc.sub`1`}`,
        doc.td`utility weight on h`,
        doc.td`0.149`,
      ),
      doc.tr(
        doc.td`θ${doc.sub`2`}`,
        doc.td`utility weight on leisure`,
        doc.td`0.53`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-style: italic' }).t`Gov policy parameters`,
      ),
      doc.tr(
        doc.td`ζ${doc.sub`di`}`,
        doc.td`fraction of the unhealthy on DI`,
        doc.td`65%`,
      ),
      doc.tr(
        doc.td`${vars.govtShelter}`,
        doc.td`homeless shelter`,
        doc.td`0.04`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-style: italic' }).t`Others`,
      ),
      doc.tr(
        doc.td`ζ${doc.sub`2`}(h${doc.sub`1`}), ζ${doc.sub`2`}(h${doc.sub`2`}), ζ${doc.sub`2`}(h${doc.sub`i`}) ∀i ≥ 3`,
        doc.td`housing supply scale parameters`,
        doc.td`{0.0026, 0.027, 0.335}`,
      ),
      doc.tr(
        doc.td`s${doc.sub`h`}(${vars.govtShelter}, h${doc.sub`t+1`}) if h${doc.sub`t+1`} ≠ ${vars.govtShelter}`,
        doc.td`search cost for the homeless`,
        doc.td`0.011`,
      ),
      doc.tr(
        doc.th.attr({ style: 'text-align: left' }).t`Targeted moments →associated parameters`,
        doc.th`Data`,
        doc.th`Model`,
      ),
      doc.tr(
        doc.td`Homeless rate →${vars.govtShelter}`,
        doc.td`0.4 − 0.6%`,
        doc.td`0.5%`,
      ),
      doc.tr(
        doc.td`Wealth-earnings ratio (annual)→β`,
        doc.td`3.2`,
        doc.td`3.2`,
      ),
      doc.tr(
        doc.td`Employment rate→θ${doc.sub`2`}`,
        doc.td`88%`,
        doc.td`88%`,
      ),
      doc.tr(
        doc.td`Median rent-income ratio→θ${doc.sub`1`}`,
        doc.td`30%`,
        doc.td`31%`,
      ),
      doc.tr(
        doc.td`Frac. of the homeless with health shock→ζ${doc.sub`di`}`,
        doc.td`25 − 30%`,
        doc.td`25%`,
      ),
      doc.tr(
        doc.td`Frac of rent-burdened individuals → ζ${doc.sub`2`}(h${doc.sub`i`}), w/ i = 1, 2, or ≥ 3`,
        doc.td`see Figure 1`,
        doc.td``,
      ),
      doc.tr(
        doc.td`Frac of the homeless with duration ≤ 1qtr →s${doc.sub`h`}(${vars.govtShelter}, h′ > ${vars.govtShelter})`,
        doc.td`44%`,
        doc.td`43%`,
      ),
    ),
  ),
));

export const table2 = createDoc(() => container(
  doc.h2`Table 2: Contribution of Various Factors to Homelessness`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`△ Homeless Share`,
        doc.th`△ Chronic Homeless Share`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Counterfactual: Shocks`,
      ),
      doc.tr(
        doc.td`No productivity shock`,
        doc.td`−58%`,
        doc.td`−48%`,
      ),
      doc.tr(
        doc.td`No health shock`,
        doc.td`−37%`,
        doc.td`−86%`,
      ),
    ),
  ),
));

export const table3 = createDoc(() => container(
  doc.h2`Table 3: Key Elasticities of Housing Demand`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th.attr({ colSpan: 2 }).t`Housing demand`,
      ),
      doc.tr(
        doc.th``,
        doc.th`Income elasticity`,
        doc.th`Price elasticity`,
      ),
      doc.tr(
        doc.td`Model`,
        doc.td`0.47`,
        doc.td`-0.57`,
      ),
      doc.tr(
        doc.td`Existing empirical estimates`,
        doc.td`0.4 to 1.0`,
        doc.td`-1 to -0.3`,
      ),
      doc.tr(
        doc.td`Ex: Pollinsky and Ellwood (1979)`,
        doc.td``,
        doc.td`-0.7`,
      ),
      doc.tr(
        doc.td.attr({ style: 'padding-left: 2em' }).t`Hanushek and Quigley (1980)`,
        doc.td``,
        doc.td`-0.64; -0.45`,
      ),
      doc.tr(
        doc.td.attr({ style: 'padding-left: 2em' }).t`Albouy et al (2016)`,
        doc.td`2/3`,
        doc.td`-2/3`,
      ),
    ),
  ),
));

export const table4 = createDoc(() => container(
  doc.h2`Table 4: Effects of Receiving Vouchers: RCTs vs. Model`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th.attr({ colSpan: 2 }).t`Homelessness`,
        doc.th`Housing size`,
        doc.th`Employment rate`,
      ),
      doc.tr(
        doc.th``,
        doc.th`welfare eligible`,
        doc.th`in shelter`,
        doc.th``,
        doc.th``,
      ),
      doc.tr(
        doc.td`Model (winning lottery)`,
        doc.td`−32%`,
        doc.td`−31%`,
        doc.td`+32%`,
        doc.td`−12.9% to −1%`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 5, style: 'text-align: left; font-weight: bold' }).t`RCT Studies`,
      ),
      doc.tr(
        doc.td`Mills et al. (2006)`,
        doc.td`−30%`,
        doc.td``,
        doc.td``,
        doc.td``,
      ),
      doc.tr(
        doc.td`Gubits et al. (2016)`,
        doc.td``,
        doc.td`−50%`,
        doc.td`+33%`,
        doc.td``,
      ),
      doc.tr(
        doc.td`Jacob and Ludwig (2012)`,
        doc.td``,
        doc.td``,
        doc.td``,
        doc.td`−6%`,
      ),
    ),
  ),
));

export const table5 = createDoc(() => container(
  doc.h2`Table 5: Policy Experiments: Removal of Housing Vouchers`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`Homeless rate (△)`,
        doc.th`Welfare (in CEV)`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Removing housing voucher`,
      ),
      doc.tr(
        doc.td`PE`,
        doc.td`+36%`,
        doc.td`−1.8%`,
      ),
      doc.tr(
        doc.td`GE (Baseline)`,
        doc.td`+50%`,
        doc.td`−2.2%`,
      ),
    ),
  ),
));

export const table6 = createDoc(() => container(
  doc.h2`Table 6: Expanding the Voucher Program`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`Homeless rate (△)`,
        doc.th`Welfare (in CEV)`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Increase the frac of voucher recipients`,
      ),
      doc.tr(
        doc.td`PE`,
        doc.td`−7%`,
        doc.td`+0.17%`,
      ),
      doc.tr(
        doc.td`GE`,
        doc.td`−15%`,
        doc.td`+0.25%`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Increase voucher amount`,
      ),
      doc.tr(
        doc.td`PE`,
        doc.td`-1%`,
        doc.td`+0.11`,
      ),
      doc.tr(
        doc.td`GE`,
        doc.td`-1%`,
        doc.td`+0.08`,
      ),
    ),
  ),
));

export const table7 = createDoc(() => container(
  doc.h2`Table 7: Reforms Financed by Additional Budget`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`Homeless rate (△)`,
        doc.th`Welfare (in CEV)`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Increase the frac of voucher recipients`,
      ),
      doc.tr(
        doc.td`PE`,
        doc.td`−7%`,
        doc.td`+0.17%`,
      ),
      doc.tr(
        doc.td`GE`,
        doc.td`−15%`,
        doc.td`+0.25%`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Rent Subsidy on ${vars.h1}`,
      ),
      doc.tr(
        doc.td`PE`,
        doc.td`−41%`,
        doc.td`+0.52%`,
      ),
      doc.tr(
        doc.td`GE`,
        doc.td`−11%`,
        doc.td`+0.04%`,
      ),
    ),
  ),
));

export const table8 = createDoc(() => container(
  doc.h2`Table 8: Reforms Financed by Additional Budget`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`Homeless rate (△)`,
        doc.th`Welfare (in CEV)`,
      ),
      doc.tr(
        doc.td`Increase the frac of voucher recipients`,
        doc.td`−15%`,
        doc.td`+0.25%`,
      ),
      doc.tr(
        doc.td`Means-tested cash transfer`,
        doc.td`−9%`,
        doc.td`+0.91%`,
      ),
      doc.tr(
        doc.td`Means-tested cash transfer to renters`,
        doc.td`−13%`,
        doc.td`+0.13%`,
      ),
    ),
  ),
));

export const table9 = createDoc(() => container(
  doc.h2`Table 9: Additional Experiments`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`Homeless rate (△)`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 2, style: 'text-align: left; font-weight: bold' }).t`Increased housing supply`,
      ),
      doc.tr(
        doc.td`${vars.h1}`,
        doc.td`−16%`,
      ),
      doc.tr(
        doc.td`${vars.h2}`,
        doc.td`−1%`,
      ),
      doc.tr(
        doc.td`Introducing smaller units (h̃ = 0.5 × ${vars.h1})`,
        doc.td`−66%`,
      ),
      doc.tr(
        doc.td`No search cost`,
        doc.td`−3%`,
      ),
      doc.tr(
        doc.td`Increased DI coverage (ζ${doc.sub`di`} : 65% → 72%)`,
        doc.td`−6%`,
      ),
    ),
  ),
));

export const table10 = createDoc(() => container(
  doc.h2`Table 10: Better Treatment for Mental Health Problems`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`△ Homeless Share`,
        doc.th`△ Chronic Homeless Share`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Counterfactual: faster recovery`,
      ),
      doc.tr(
        doc.td`2x benchmark recovery rate`,
        doc.td`−14%`,
        doc.td`−17%`,
      ),
      doc.tr(
        doc.td`4x benchmark recovery rate`,
        doc.td`−19%`,
        doc.td`−25%`,
      ),
    ),
  ),
));

export const table11 = createDoc(() => container(
  doc.h2`Table 11: Robustness Check for Different Supply Elasticity for ${vars.h1}`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`Homeless rate (△)`,
        doc.th`Welfare (in CEV)`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold ' }).t`Reforms in the Benchmark`,
      ),
      doc.tr(
        doc.td`Increase the frac of voucher recipients`,
        doc.td`−15%`,
        doc.td`+0.25%`,
      ),
      doc.tr(
        doc.td`Rent Subsidy on ${vars.h1}`,
        doc.td`−11%`,
        doc.td`+0.04%`,
      ),
      doc.tr(
        doc.td`Means-tested cash transfer`,
        doc.td`−9%`,
        doc.td`+0.91%`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`With low supply elasticity of ${vars.h1}(×0.5)`,
      ),
      doc.tr(
        doc.td`Increase the frac of voucher recipients`,
        doc.td`−15%`,
        doc.td`+0.24%`,
      ),
      doc.tr(
        doc.td`Rent Subsidy on ${vars.h1}`,
        doc.td`−4%`,
        doc.td`−0.02%`,
      ),
      doc.tr(
        doc.td`Means-tested cash transfer`,
        doc.td`−9%`,
        doc.td`+0.92%`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`High supply elasticity of ${vars.h1}(×2)`,
      ),
      doc.tr(
        doc.td`Increase the frac of voucher recipients`,
        doc.td`−13%`,
        doc.td`+0.21%`,
      ),
      doc.tr(
        doc.td`Rent Subsidy on ${vars.h1}`,
        doc.td`−16%`,
        doc.td`+0.17%`,
      ),
      doc.tr(
        doc.td`Means-tested cash transfer`,
        doc.td`−7%`,
        doc.td`+0.89%`,
      ),
    ),
  ),
));

export const table12 = createDoc(() => container(
  doc.h2`Table 12: Robustness Check for More Housing Grids`,
  dashbox(
    doc.table.attr({ className: 'results' }).of(
      doc.tr(
        doc.th``,
        doc.th`Homeless rate (△)`,
        doc.th`Welfare (in CEV)`,
      ),
      doc.tr(
        doc.th.attr({ colSpan: 3, style: 'text-align: left; font-weight: bold' }).t`Reforms in the model with finer housing grids`,
      ),
      doc.tr(
        doc.td`Increase the frac of voucher recipients`,
        doc.td`−13%`,
        doc.td`+0.18%`,
      ),
      doc.tr(
        doc.td`Rent Subsidy on ${vars.h1}`,
        doc.td`−9%`,
        doc.td`−0.02%`,
      ),
      doc.tr(
        doc.td`Means-tested cash transfer`,
        doc.td`−7%`,
        doc.td`+1.06%`,
      ),
    ),
  ),
));

const vars = {
  h1: doc.b`h${doc.sub`1`}`,
  h2: doc.b`h${doc.sub`2`}`,
  ct: doc.b`c${doc.sub`t`}`,
  ht: doc.b`h${doc.sub`t`}`,
  lt: doc.b`l${doc.sub`t`}`,
  wt: doc.b`w${doc.sub`t`}`,
  yt: doc.b`y${doc.sub`t`}`,
  zt: doc.b`z${doc.sub`t`}`,
  mut: doc.b`𝜇${doc.sub`t`}`,
  upsilont: doc.b`ν${doc.sub`t`}`,
  phit: doc.b`𝜙${doc.sub`l`}`,
  smallestH: doc.b`ẖ${doc.sup`o`}`,
  govtShelter: doc.b`ẖ`,
};
