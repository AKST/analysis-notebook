
/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';
import { vars as isCurveVars } from '../sec-05-2/doc.js';

const { responsiveGridAutoRow, twoColumns, twoThree, container } = prelude.layout;
const { text, clsRef, infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  wiki: {
    arbitrage: text.a({ href: 'https://en.wikipedia.org/wiki/Arbitrage' }),
    paulVolcker: text.a({ href: 'https://en.wikipedia.org/wiki/Paul_Volcker' }),
  },
};

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 9, page }) : undefined,
    lec: slide != null ? ({ id: [5, 'M'], slide }) : undefined,
  }, item)
);

const vars = {
  ...isCurveVars,
  v: doc.b`𝜈̄`,
  o: doc.b`𝜊̄`,
  inExT: doc.b`𝜋${doc.sup`e`}${doc.sub`t`}`,
};

export const header = createDoc(() => container(
  twoThree(
    container(
      doc.h1.of('MP Curve', ['br'], doc.small.attr({ style: 'color: #aaaaff' })`
        ECON2102, W5, Lecture 2
      `),
    ),
    infobox('Resources', [
      text.ul(
        doc.li`Chapter 12 of the textbook`,
        doc.li.of(LINKS.wiki.arbitrage`Arbitrage`),
      ),
    ]),
  ),
));


export const intro = createDoc(() => dashbox(
  ref({ page: 318 }, doc.h2`Introduction`),
  doc.p`
    The ${doc.b`IS Curve`} and the ${doc.b`MP Curve`} are
    two halves of the same whole. While the IS Curve stands
    for ${doc.b`investment`} and ${doc.b`saving`}, the MP
    in MP curve stands for ${doc.b`Monetrary Policy`}.
  `,
));

export const theMPCurve = createDoc(() => container(
  ref({ page: 319 }, doc.h2`The MP Curve Monetary Policy and interest Rates`),
  dashbox(
    doc.p`
      We use the MP Curve to understand the nature in which
      the central bank is willing and borrow to lend at
      a specific overnight rate.
    `,
  ),
  dashbox(
    ref({ page: 321 }, doc.h3`From Nominal to Real Interest Rates`),
    mathml.interestRates.relationship,
    doc.p`
      ${doc.b`Sticky Inflation Assumption`} is where we assume that
      the rate of inflation exhbits ${doc.b`inertia`} or ${doc.b`stickiness`},
      so that it adjusts slowly over time. In the very short run—say within
      6 months or so—we assume that the rate of infaltion does not respond
      directly to chagnes in monetary policy. For example we shouldn't see
      a change in inflation in response to monetrary policy for at least
      6 months.
    `,
  ),
  todo({}, 'show IS-MP diagram'),
  dashbox(
    ref({ page: 323 }, doc.h3`The IS-MP Diagram`),
    doc.p`
      When you combine the IS Curve and the MP Curve
      you get the ${doc.b`IS-MP Diagram`}
    `,
  ),
  dashbox(
    ref({ page: 324 }, doc.h3`Example: The End of a Housing Bubble`),
    doc.p`
      In theory the central bank could adjust the MP curve the moment
      the housing bubble collapsed and there would be no decline in
      output. In pracise it takes a while to determine the nature and
      servity of the shock that hit the economy. It takes times for
      changes in interest rates to affect investment and output.
    `,
  ),
));

export const philipCurve = createDoc(() => container(
  ref({ page: 327 }, doc.h2`The Phillips Curve`),
  dashbox(
    responsiveGridAutoRow([
      mathml.inflation.identity,
      mathml.inflation.decomposition,
      mathml.inflation.dynamics,
    ], { columns: { desktop: 'auto auto auto' } }),
    doc.p`
      Firms set their prices to the amount to which they expect
      they'll need to charge (based on their expectation of
      inflation) so that by the time they sell their goods the
      amount they receive is still enough to cover their costs.
      The difference in price can be observed by the ${doc.b`Inflation
      Identity`} below. We can break this down further into subcomponents:
    `,
    text.ol.attr({ itemSpace: 'sparse' })(
      doc.li.of(
        doc.p`One component is the expectations we just discussed ${vars.inExT}.`,
        text.ul.attr({ blockMargin: 1 })(
          doc.li`This is called ${doc.b`expected inflation`}.`,
          doc.li`
            This captures information relating to the fact that they
            may not be able to sell as much this period.
          `,
        ),
      ),
      doc.li.of(
        doc.p`
          Two there is also the demand conditions which impact inflation
          based on output output fluctucation (${vars.YtFluc}), we use the
          coefficent ${vars.v} to control the extent to which this impacts
          inflation.
        `,
        text.ul.attr({ blockMargin: 1 })(
          doc.li`This is called the ${doc.b`demand condition`}.`,
          doc.li`
            This is defined to capture the effect slackness in the
            economy has on actual inflation.
          `,
          doc.li.of(
            doc.p`
              ${vars.v} measures how sensitive inflation is to
              demand conditions. If it's high then price-setting
              behaviour is more pronounced, when it's lower it takes
              inflation is less sensitive
            `,
            text.ul.attr({ blockMargin: 1 })(
              doc.li`
                For example if it's low, a larger recession is necessary
                to reduce inflation.
              `,
            ),
          ),
        ),
      ),
    ),
    twoThree(
      doc.p`
        The top portion of the inflation dynamics captures something
        called ${doc.b`adaptive expceations`}, which is when firms
        expect the rate of inflation in the coming period to equal the
        the rate of inflation prevailing in the previous period. This
        eases the rate at which inflation adjusts, reflecting the fact
        firms tend to adjust their focrecasts of inflation slowly.
      `,
      mathml.inflation.dynamics,
    ),
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 329 }, doc.h3`Price Shocks and the Phillips Curve`),
    mathml.inflationChange2,
    doc.p`
      While most of the time inflation dynamics flow the dynamics
      already specified, there is one additional determinant. That
      being shocks. Such as an oil price shock (${doc.i`denoted by
      ${vars.o}`}).
    `,
    text.ul(
      doc.li`Most of the time ${vars.o} is zero.`,
      doc.li`
        However when a shock occurs, ${vars.o} has a positive value
        if the shock raises inflation temporarily.
      `,
    ),
    doc.p`
      Such shocks have a highly visible impact on prices, often
      occuring immediately. For example a shock to the price of
      oil will be immediately reflected in the price of airline
      tickets, home heating, car fuel, etc. ${doc.b`For producers`},
      when the costs of their inputs goes up they will pass that
      cost directly on to consumers as it's often a marginal cost
      associated with the production of each good.
    `,
  ),
  dashbox(
    ref({ page: 329 }, doc.h3`Cost-Push and Demand-Pull Inflation`),
    doc.p`
      Shocks due to sudden changes to inputs of production are
      generally called ${doc.b`cost-push inflation`} given they
      push up the inflation rate. The term ${vars.v}${vars.YtFluc}
      is called ${doc.b`demand-pull inflation`}, incases in
      aggregate demand in the economy raise the inflation rate.
    `,
    doc.p`
      ${vars.o} can also increase when union bargain for a
      particurally large increase in wage, and a sudden large
      increase in population may have the opposite effect and
      decrease the wages having the opposite effect on ${vars.o}.
    `,
  ),
));

export const usingShortRunModel = createDoc(() => container(
  ref({ page: 332 }, doc.h2`Using the Short-Run Model`),
  dashbox(
    doc.p`
      In order to illustrate the be behaviour of the model,
      we'll take a look at 2 extreme cases of inflation and
      deflation in the USA.
    `,
  ),
  dashbox(
    ref({ page: 333 }, doc.h3`The Volcker Disinflation`),
    doc.p`
      In 1979 ${LINKS.wiki.paulVolcker`Paul Volcker`} was appointed
      to the US FEDs board of governors, during this period
      inflation was exceeding 10% and there was no reason to think
      that would change. This was in part due to oil shocks in the
      previous periods as well as monetary policy decisions from
      previous periods. So it was Volckers job to address all this
      and bring inflation down to reasonable levels.
    `,
    doc.p`
      Wasting no time, he cranked up the inflation rate and inflation
      went down along with the level of employment. This went on for
      some time.
    `,
    doc.p`
      Within the model this can largely be observed by lifting the
      MP curve along the IS curve, in which we'll see the the new
      equalibrium production drop to the point of intersection. This
      lead to a massive recession in the US.
    `,
  ),
  todo({}, 'show Volcker deflation'),
  dashbox(
    ref({ page: 336 }, doc.h3`The Great Inflation of the 1970s`),
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 336 }, doc.h3`The Short-Run Model in a Nutshell`),
    mathml.inANutShell,
    todo({}, 'content'),
  ),
));

export const microFoundations = createDoc(() => container(
  ref({ page: 338 }, doc.h2`Microfoundations: Understanding Sticky Inflation`),
  dashbox(
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 338 }, doc.h3`The Classical Dichotomy in the Short Run`),
    todo({}, 'content'),
  ),
  ref({ page: 342 }, doc.h3`Microfoundations: How Central Banks Control Nominal Interest Rates`),
  dashbox(
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 343 }, doc.h3`Changing the Interest Rate`),
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 343 }, doc.h3`Why iₜ Instead of Mₜ?`),
    todo({}, 'content'),
  ),
));

export const insideTheFed = createDoc(() => container(
  ref({ page: 346 }, doc.h2`Inside the Federal Reserve`),
  dashbox(
    doc.h3`Conventional Monetary Policy`,
    todo({}, 'content'),
  ),
  dashbox(
    ref({ page: 347 }, doc.h3`Open- Market Operations: How the Fed Controls the Money Supply`),
    todo({}, 'content'),
  ),
));

export const conclusions = createDoc(() => container(
  ref({ page: 348 }, doc.h2`Conclusions`),
  dashbox(
    todo({}, 'content'),
  ),
));
