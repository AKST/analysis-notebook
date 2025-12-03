
/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { responsiveGridAutoRow, twoThree, twoColumns, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';
import { vars as isCurveVars } from '../sec-05-2/doc.js';

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

const LINKS = {
  wiki: {
    arbitrage: text.a({
      title: 'What is Arbitrage?',
      href: 'https://en.wikipedia.org/wiki/Arbitrage',
    }),
    paulVolcker: text.a({
      title: 'Who is Paul Volcker?',
      href: 'https://en.wikipedia.org/wiki/Paul_Volcker',
    }),
    classicalDichotomy: text.a({
      title: 'What is the Classical Dichotomy?',
      href: 'https://en.wikipedia.org/wiki/Classical_dichotomy',
    }),
    informationAsymmetry: text.a({
      title: 'Information Asymmetry',
      href: 'https://en.wikipedia.org/wiki/Information_asymmetry',
    }),
    moneyIllusion: text.a({
      title: 'Money Illusion',
      href: 'https://en.wikipedia.org/wiki/Money_illusion',
    }),
    velocityOfMoney: text.a({
      title: 'Velocity Of Money',
      href: 'https://en.wikipedia.org/wiki/Velocity_of_money',
    }),
    quantityTheoryOfMoney: text.a({
      title: 'Quantity Theory Of Money',
      href: 'https://en.wikipedia.org/wiki/Quantity_theory_of_money',
    }),
    nominalRigidity: text.a({
      title: 'Nominal Rigidity',
      href: 'https://en.wikipedia.org/wiki/Nominal_rigidity',
    }),
  },
  papers: {
    costlyComputation: text.a({
      title: "I don't Want to think about it now: Decision Theory with Colsty Computation",
      href: 'https://arxiv.org/pdf/1106.2657',
    }),
  },
};

const vars = {
  ...isCurveVars,
  i: doc.b`i${doc.sup`*`}`,
  v: doc.b`ν̄`,
  o: doc.b`ο̄`,
  inExT: doc.b`π${doc.sup`e`}${doc.sub`t`}`,
  Ms: doc.b`M${doc.sup`S`}`,
  Md: doc.b`M${doc.sup`d`}`,
  M: doc.b`M${doc.sup`*`}`,
};

export const header = createDoc(() => container(
  twoThree(
    container(
      doc.h1.of('MP Curve', ['br'], doc.small.attr({ style: 'color: #aaaaff' })`
        ECON2102, W5, Lecture 2
      `),
    ),
    infobox({ title: 'Resources' })(
      text.ul(
        doc.li`Chapter 12 of the textbook`,
        doc.li.of(LINKS.wiki.arbitrage`Arbitrage`),
        doc.li.of(LINKS.wiki.classicalDichotomy`Classical Dichotomy`),
      ),
    ),
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

export const theMPCurve1 = createDoc(() => container(
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
    twoColumns(
      container(
        doc.p`
          Here we establish a link between real and nominal
          inflation based on the ${doc.b`Fisher Equation`}.
          ${doc.b.of(doc.b`
            ${doc.u`Nominal Interest`} is the sum of
            ${doc.u`Real Interest`} and the
            ${doc.u`rate of inflation`}`)}.
          Given that, we arrive at the second equation
          after rearraning the first equation.
        `,
      ),
      mathml.interestRates.relationship,
    ),
    doc.p`
      ${doc.b`Sticky Inflation Assumption`} is where we assume that
      the rate of inflation exhbits ${doc.b`inertia`} or ${doc.b`stickiness`},
      so that it adjusts slowly over time. In the very short run—say within
      6 months or so—we assume that the rate of infaltion does not respond
      directly to chagnes in monetary policy. For example we shouldn't see
      a change in inflation in response to monetrary policy for at least
      6 months.
    `,
    ref({ page: 321 }, doc.h4`Ex Ante and Ex Post Real Interest Rates`),
    twoThree(
      container(
        doc.p`
          The varation of the fisher equation on the right
          is important for interpretating the behaviour of
          investment decisions. Ultimately you're not going
          know the actual rate of inflation but that won't
          stop people from forming doing some guess work. Given
          what's at stack and what can be gained, investors are
          going to use some kind of expectation, to inform their
          decisions which is why this variation exists.
        `,
      ),
      mathml.interestRates.expectedInflation,
    ),
    text.ul(
      doc.li`${doc.b`Exante`}, is the real inflation investors expect to prevail.`,
      doc.li`${doc.b`Expost`}, is the real inflation investors that actually occured.`,
    ),
  ),
));

export const theMPCurve2 = createDoc(() => container(
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
    doc.p`
      Prior to this in 1960s, this was before the phillips curve
      was developed, and there were theory that assumed there was
      a permanent trade-off between unemployment and inflation.
      It was thought that decreasing inflation could only be done
      by increasing unemployment. This was even the view of
      ${doc.b`Rober Solow`}.
    `,
    doc.p`
      At this point in time there was significantly more gaps in
      the information collected to make monetary decisions. There
      was a productivity slow down in the sense it was growing
      slower than people realised at the time. They believed the
      economy was going into recession and that ${vars.YtFluc}
      was negative when infact it was at zero. Because of this
      they lowered interest rates and then this led to higher
      inflation.
    `,
  ),
  dashbox(
    ref({ page: 336 }, doc.h3`The Short-Run Model in a Nutshell`),
    mathml.inANutShell,
  ),
));

export const microFoundations1 = createDoc(() => container(
  ref({ page: 338 }, doc.h2`Microfoundations: Understanding Sticky Inflation`),
  dashbox(
    doc.p`Firstly...`,
    text.ul({ itemSpace: 'sparse' })(
      doc.li`
        ${doc.b`sticky inflation`} is an essential assumption
        underlying the short-run model.
      `,
      doc.li`
        The ${doc.b`MP Curve`} has the ${doc.u`sticky inflation`} assumption
        builtin, where we assume that changes in nominal interest
        lead to changes in the real interest rate.
      `,
      doc.li`
        The ${doc.u`sticky inflation`} assumption is also central
        to the forumation of the ${doc.b`Philips Curve`}.
      `,
    ),
    twoThree(
      container(
        doc.p`
          The ${doc.b`Classical Dichotomy`} states that ${doc.u`the real
          side of the economy is determined solely by real forces`}.
        `,
        doc.p`
          In order for monetary policy to affect real variables, it must be
          the case that the ${doc.b`fails to hold`}. At least so in the
          short-run.
        `,
        doc.p`
          Examining this failure is one of the crucial
          requirements of a good short-run model.
        `,
      ),
      infobox({ title: 'Question...' })(
        doc.p`
          The intuition underlying the classical dichotomy is
          quite powerful: ${doc.i`if the Federal Reserve decides
          to double the money supply, then all prices can double and
          nothing real needs to change`}. This holds up in the long
          run, ${doc.i`but why isn't it the case it applies in the short
          terms`}?
        `,
      ),
    ),
  ),
  dashbox(
    ref({ page: 338 }, doc.h3`The Classical Dichotomy in the Short Run`),
    twoThree(
      container(
        doc.p`
          For the classical dichotomy to hold at all points in
          time, ${doc.i`all prices in the economy, including
          nominal wages ${doc.b`must`} ajudst in the same
          proportion immediattely`}. This of course will not
          happen, at least not in reality (such a feat would
          require no ${LINKS.wiki.informationAsymmetry`information asymmetry
          or imperfect information`}).
        `,
        doc.p`
          Additionally there's a level of ${LINKS.papers.costlyComputation`Costly
          computation`}, which is a game theory concept relating to the cost
          of making a decision.
        `,
        doc.details.of(
          doc.summary`Menu prices, and small business realities`,
          doc.br(),
          doc.p`
            Just think about any number of businesses and why their prices
            have remained as is for whatever timeframe. Larger scale
            businesses may have a means to dynamically adjust menus but
            10 small business owners in the row of shops down the road
            likely do not.
          `,
        ),
      ),
      infobox({ title: 'An Example' })(
        doc.p`
          When you're running a store, monetary policy
          likely isn't top of mind. You've got inventory
          sell, staff to run around and customers to up
          sell. There's just a lot going on. Additionally
          it's not like you got a telepathic link into the
          FED telling you need you pull back spending as
          an inflation shock is about to hit.
        `,
      ),
    ),
    doc.h4`Communicating Monetary Policy`,
    doc.p`
      Even with monetary policy itself, changes are more subtle
      and announcments are often incremental changes to the short
      term nominal interest rate. In the FED wanted to double the
      money supply over a certain period it probably explictly
      outline that if it meant people would behave erraditically.
    `,
    doc.h4`Contracts setting prices`,
    doc.p`
      In addition to imperfect information and costly
      computation, a third reason for the failure of the
      classical dichotomy in the short run is the ${doc.u`many
      ${doc.b`contracts set prices and wages in nominal`}
      rather than real terms`}.
    `,
    doc.h4`Bargaining costs`,
    doc.p`
      A 4th reason is the cost associated with negotiating
      over prices and wages. For wages this was more relevant
      in the paste with higher concerntation of unions. But
      also negotiating contracts, even for other inputs.
    `,
    doc.h4`Social Norms`,
    doc.p`
      Another reason is Social norms and
      ${LINKS.wiki.moneyIllusion`Money Illusion`} which have
      to do with a sense of fairness how people tend to focus
      on a nominal price over things like real magnitudes.
      People have strong feelings over about whether or not
      nominal wage can or should decline (even if in real terms
      it was the same thing).
    `,
  ),
));

export const microFoundations2 = createDoc(() => container(
  ref({ page: 342 }, doc.h2`Microfoundations: How Central Banks Control Nominal Interest Rates`),
  dashbox(
    doc.quote`
      The ${doc.b`nominal interest rate`} is the
      ${doc.b`opportunity cost`} of holding money.
    `,
    twoThree(
      doc.p`
        How does the bank set the nominal interest rate? Well the central
        bank ${doc.i.of(doc.u`sets it by supplying whatever money is
        demanded at that interest rate`)}. Given ${doc.u`the nominal
        interest rate is the opportunity cost of holding money`} the
        rate reflects ${doc.u`the amount you ${doc.i`give up by
        ${doc.b`holding money`}`} instead of ${doc.i`keeping it in a
        ${doc.b`savings account`}`}`}.
      `,
      infobox({ title: 'Definitions' })(
        text.ul(
          doc.li`${vars.Ms}: Money Supply`,
          doc.li`${vars.Md}: Money Demand`,
          doc.li`${vars.i}: Nominal Interest Rate`,
        ),
      ),
    ),
    doc.quote`
      The demand for money is a decreasing function of the nominal
      interest rate.
    `,
    doc.h4`Money Supply & Demand Curve`,
    twoThree(
      container(
        doc.p`
          Given Central bank supplies money at ${vars.Ms} and demand
          for money exists at ${vars.Md}, from here it doesn't take
          much imagination to visualise a Supply & Demand Diagram with
          one curve overlaping the other. Eventually the question crosses
          your mind what can we infer from the equilibrium; where ${vars.Md}
          = ${vars.Ms}?
        `,
        doc.p`
          Firstly, it's worth noting that the supply diagram here is a
          vertical line, because ultimately it is the central bank who
          decides that price. However the demand itself isn't too
          dissimilar from a typical demand curve in terms of shape.
        `,
        doc.p`Now finally, what is the equalibrium?`,
        text.ul(
          doc.li`${vars.i}: On the vertical axis we have ${doc.b`Nominal Interest`}.`,
          doc.li`${vars.M}: On the horizontal axis we have the ${doc.b`Money Supply`}.`,
        ),
      ),
      infobox({ title: 'Nominal Interest in the short run' })(
        doc.p`
          With ${LINKS.wiki.nominalRigidity`stick Inflation`} we
          can't count on tomorrows price levels immediately responding to
          changes in the money supply. Well the bank does this through
          changes to the ${LINKS.wiki.velocityOfMoney`velocity of money`}.
          But wait you say, doesn't the ${LINKS.wiki.quantityTheoryOfMoney`quantity
          theory of money`} says that velocity is constant... in the long run?
          Yes, but as you said "the long run". In the short run we turn
          this on its head. A change in the nominal interest rate will
          drive a change in the velocity of money, allowing the money
          markets to clear.
        `,
      ),
    ),
  ),
  dashbox(
    ref({ page: 343 }, doc.h3`Changing the Interest Rate`),
    text.ul(
      doc.li`${doc.b`How does the bank increase the interest rate`}? It decreases the money supply`,
      doc.li`${doc.b`How does the bank decrease the interest rate`}? It increases the money supply`,
    ),
  ),
  dashbox(
    ref({ page: 343 }, doc.h3`Why iₜ Instead of Mₜ?`),
    doc.p`
      Before the 1970s (early 1980) the focus of banks was on money supply but
      beginning in the 1980s there was a shift to focusing on interest rates.
      There are other things that shift the demand money, such as:
    `,
    text.ul(
      doc.li`The change in the price level in the economy in relation to real output.`,
      doc.li`Advances in finanical technology such as ATMs.`,
    ),
    doc.h4`Some additional definitions`,
    text.ul(
      doc.li`${doc.b`Monetary Expansion`}: a loosening of monetary policy.`,
      doc.li`${doc.b`Monetary Contraction`}: a tighening of monetary policy.`,
    ),
  ),
));

export const insideTheFed = createDoc(() => container(
  ref({ page: 346 }, doc.h2`Inside the Federal Reserve`),
  dashbox(
    doc.h3`Conventional Monetary Policy`,
    doc.p`The US FED has 3 conventional tools for exercising monetary policy:`,
    text.ol.attr({ itemSpace: 'sparse' })(
      doc.li.of(
        doc.p`
          ${doc.b`Reserve Requirements`}: this is where banks are
          required to hold a certian fraction of their deposits in
          special accounts called "${doc.b`in reserve`}",
        `,
        text.ul(
          doc.li`Historically these accounts paid no interest`,
        ),
      ),
      doc.li.of(
        doc.p`
          The second instrument, is infact the ability to update
          the fraction at which the first is enforced.
        `,
        text.ul(
          doc.li`This is seldom changed.`,
        ),
      ),
      doc.li.of(
        doc.p`
          ${doc.b`Discount Rate`}: this is the interest rate charged
          by the Federal Reseve itself on loans that it makes to
          commerical abnks and other financial institutions.
        `,
        text.ul(
          doc.li`
            When a bank finds itself short of reserves and unable
            to borrow sufficient amounts in financial markets may
            turn to the dicount window of the Fed. This is where
            the lender of last resort comes from.
          `,
        ),
      ),
    ),
  ),
  dashbox(doc.details.of(
    doc.summary`How does the RBA do all this?`,
    doc.br(),
    container(
      todo({}, 'provide more accurate descriptions'),
      doc.p`
        The RBA controls the supply money of by setting
        the othernight cashrate. It lowers it if it wants
        to increase the supply of money and it increases
        it if wants to decrease the supply.
      `,
    ),
  )),
  dashbox(
    ref({ page: 347 }, doc.h3`Open- Market Operations: How the Fed Controls the Money Supply`),
    doc.p`
      This is the the main way in which the US central banks (and
      central banks generally influence their money supply). This
      is stuff like the central bank sell bonds, in order to attract
      buyer they central bank may have to increase the inctest rate
      so that someone is willing to hold those bonds.
    `,
    doc.p`
      If the bank wants to lower interest rates, it'll offer to
      buy back government bonds in excahnge for a credit in the
      buyers reserve account.
    `,
    todo({}, 'write something about face values of bonds'),
  ),
));
