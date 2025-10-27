/**
 * @import { E, DocumentWidget, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { frag, doc } from '../../prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { responsiveGridAutoRow, twoColumns, twoThree, container } = prelude.layout;
const { text, noteOn, clsRef, infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;


/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 8, page }) : undefined,
    lec: slide != null ? ({ id: [4, 'W'], slide }) : undefined,
  }, item)
);

const LINKS = {
  ytMonsterOfInflation: doc.a.attr({ href: 'https://www.youtube.com/watch?v=pbgY0dYoBvA' }),
  ytMoneyInTheEconomy: doc.a.attr({ href: 'https://www.rba.gov.au/publications/bulletin/2018/sep/money-in-the-australian-economy.html' }),
  wikiVelocityOfMoney: doc.a.attr({ target: '_blank', href: 'https://en.wikipedia.org/wiki/Velocity_of_money' }),
};

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => (
  createDoc(() => container(
    todo({}, `for "${label.trim()}"`),
  ))
);

export const header = createDoc(() => container(
  twoThree(
    container(
      doc.h1.of('Inflation', ['br'], (
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W4, Lecture 1']]
      )),
    ),
    infobox({ title: 'Resources' })(
      text.ul(
        doc.li`Chapter 8 of the text book`,
        doc.li.of(LINKS.ytMonsterOfInflation`The monster of Inflation`),
        doc.li.of(LINKS.ytMoneyInTheEconomy`Money in the Economy`),
      ),
    ),
  ),
));

export const intro = createDoc(() => dashbox(
  ref({ page: 212, slide: 3 }, doc.h2`Intro`),
  container(
    doc.p`
      Some might say, inflation is not a vibe. Between
      1919 and 1923 bread in Germany went from a ¼ of
      a mark and rose by a factor of a trillion. This
      obviously for Germany and probably no better for
      the world at large. There are countless other
      examples through out history.
    `,
    container(
      doc.h4`How is inflation measured?`,
      doc.p`
        The Inflation rate is generally measured as
        annual propotional changes in the price level.
      `,
    ),
  ),
));

const PYt = frag([doc.b`P${doc.sub`t`}`, doc.b`Y${doc.sub`t`}`]);

export const quantityTheoryOfMoney = createDoc(() => container(
  ref({ page: 216, slide: 14 }, doc.h2`Quantity Theory of Money`),
  dashbox(
    ref({ page: 216 }, doc.h3`Measures of money supply`),
    container(
      doc.p`
        The value of money and inflation is closely
        related in the way we model inflation, one
        such model is the quantity theory of money.
        Historically money use to be valued by the
        value of various rare materials and a governments
        pledge to exchange money for those resources one
        such standard is as the gold standard. Nowadays
        money has value mostly because others value it,
        some say because they need to pay their taxes in
        money but this is neither here nor there. By all
        means how we got here is an interesting question,
        but irrelevant to our current exercise.
      `,
    ),
    note(
      doc.li`Todays money is fiat money${text.ul(
        doc.li`The main danger is risk of people losing faith the money has value.`,
      )}`,
      'Money has value because we expect others will value it',
      doc.li`Dollarsiation${text.ul(
        doc.li`Some countries with high inflation have ditched their currency for the USD`,
      )}`,
    ),
    container(
      doc.h3`Measures of money`,
      twoColumns(
        container(
          doc.h4`Currency`,
          doc.p`
            Paper the government has decided has a nominal value, and is
            worth a certain price.
          `,
          doc.h4`M1`,
          doc.p`Takes the money base and adds demand deposits.`,
        ),
        container(
          doc.h4`Money Base`,
          doc.p`
            The accounts private banks hold with an economy's central
            bank, which they pay no interest.
          `,
          doc.h4`M2`,
          doc.p`
            Adds savings accounts and money market account
            balanaces to M1. Australia doesn't have this
            it has M3 (unclear what the difference is).
          `,
        ),
      ),
    ),
  ),
  tables.moneyTerms,
  dashbox(
    ref({ page: 218 }, doc.h3`Quantity Equation`),
    container(
      twoThree(
        container(
          doc.p`
            The quantity theory of money can be expressed in terms
            of this this relation. Here's what these terms means:
          `,
          text.ul(
            doc.li`${doc.b`M${doc.sub`t`}`}: the supply of money`,
            doc.li`${doc.b`P${doc.sub`t`}`}: price level`,
            doc.li`${doc.b`Y${doc.sub`t`}`}: real GDP`,
            doc.li`${doc.b`V${doc.sub`t`}`}: the velocity of money`,
          ),
        ),
        mathml.model.quantity,
      ),
      doc.p`
        The Theory sugggests that the terms on either side is nominal GDP,
        or at least because ${PYt} is equal to nominal GDP, the
        other side should. ${PYt} equals nominal GDP because the price
        level is the value of goods in the economy and real GDP is the
        quantity of goods. You multiply the quantity of goods and
        the value of goods and you get nominal GDP.
      `,
    ),
    twoColumns(
      container(
        doc.h4`The Classical Dichotomy`,
        doc.p`
          This equation largely states that ${doc.b`in the
          long run, the real and nominal sides of the economy
          are completely seperately`} in that:
        `,
        text.ul(
          doc.li`
            Real GDP doesn't depend on things such as the value of
            money, but instead on real variables such as Total
            Factor Productivity or the investment rate.
            For that real it is treated as an exogenous variable,
            by the very nature of it being determined by forces
            beyond the model.
          `,
        ),
      ),
      container(
        doc.h4`The Velocity of money`,
        doc.quote`Read ${
          LINKS.wikiVelocityOfMoney`here about the velocity of money`
        }`,
        doc.p`
          For the sake our explaination here, it is assumed the
          velocity of money is constant and so the exogenous
          source of money without a time subscript. Although
          apparently in reality the ${doc.b`velocity of M2`}
          is approximately constant, so it's not an entirely
          unreasonable assumption for us to work within.
        `,
        todo({}, 'what is the velocity of money'),
        doc.h4`Money Supply`,
        doc.p`
          The last equation of the theory is the money supply
          itself. This is largely controlled by the central
          bank. For now we'll largely just treat it as an
          exogenous variable.
        `,
      ),
    ),
    doc.h4`Solving the model`,
    twoColumns(
      container(
        doc.p`
          After establishing the various exogenous variables
          we can then solve for price level.
        `,
      ),
      mathml.model.priceLevel,
    ),
    ref({ slide: 20 }, doc.h3`Our Model`),
    responsiveGridAutoRow([
      mathml.model.quantity,
      mathml.model.velocity,
      mathml.model.supplyOfMoney,
      mathml.model.realGDP,
    ], {
      columns: { desktop: 'auto auto auto auto' },
    }),
    doc.p`
      The essence of the quantity theory of money is: ${doc.b`in the long run`}
      a key determinant of the price level is the level of the money supply.
    `,
    todo({}, 'explain why it velocity and real GDP can\'t be a source of inflation'),
  ),
));

export const theoryOfInflation = createDoc(() => dashbox(
  ref({ slide: 26 }, doc.h3`Theory Of Inflation`),
  twoThree(
    container(
      doc.p`
        Given inflation is the rate of change in the price level,
        we can translate the quantity theory money from stocks to
        flows, growth rates and  rates of change of those same
        stocks in order to work towards a measure of inflation.
      `,
      doc.p`
        Given we assume the velocity of money is constant the
        growth in of velocity is zero, (∆V = 0). Given the right
        hand of the quantity of money theory is nominal GPD and
        the rate of change in that is inflation, we've demostrate
        that ${doc.b`∆P = 𝜋`}.
      `,
    ),
    mathml.quantityTheoryOfInflation,
  ),
  twoThree(
    doc.p`
      With Velocity constant the rate of change in the level of
      prices ends up being the rate of inflation.
      The quantity theory implies that in the long run, changes in the
      growth rate of money lead one-for-one to changes in the inflation
      rate.
    `,
    mathml.inflationRate,
  ),
  text.ul(
    doc.li`${doc.b`inflation`}: When money growth is faster than the growth of real GDP`,
    doc.li`${doc.b`deflation`}: When money growth is slower than the growth of real GDP`,
  ),
  doc.h4`The neutrality of money`,
  doc.p`
    There's a proposition that goes changes in the money supply
    have no real effect on the economy and only affect prices.
    This position is called the neutrality of money. In the long
    run this seems to be a compelling proposition but in the
    short run this doesn't seem to be the case.
  `,
));

export const realAndNominalInterest = createDoc(() => dashbox(
  ref({ slide: 33, page: 223 }, doc.h2`Real And Nominal Interest Rate`),
  twoColumns(
    container(
      doc.p`
        While the real interest is equal to the marginal
        product of capital. That is the real interest rate
        is the real rate at which you reap a return in
        purchasing a unit of capital, investing it, and
        the reaping the returns of the investment.
      `,
      doc.p`
        However that isn't same interest rate in which you
        earn a return on your savings account. That rate is
        the ${doc.b`nominal interest rate`}.,
      `,
    ),
    mathml.fisherEquation,
  ),
));

export const costOfInflation = createDoc(() => dashbox(
  ref({ slide: 40, page: 225 }, doc.h2`Cost of Inflation`),
  doc.p`
    An immediate example of the cost of inflation is how someones
    pension of $10'000 in 1970 can devalue to the equilivant of
    $4000 by the year 1983. This can happen with fixed
    incomes like a pension when they aren't adjusted for inflation.
  `,
));

export const fiscalCausesOfHighInflation = createDoc(() => container(
  ref({ slide: 46, page: 228 }, doc.h2`Fiscal Causes Of High Inflation`),
  dashbox(
    twoColumns(
      container(
        doc.p`
          The quantity theory of money tells us when inflation
          follows a central bank printing a ton of money it is
          the increase in money supply that is underlying reason
          for the inflation.
        `,
        doc.p`
           One reason this can happen is a governmnent spending too much
           money all at once, either in paying its bills or with government
           spending in the form of infrastructure or services.
           Infrastructure spending in the long run has a productivity return
           so increased is a bit more excusable than for increasing the amount
           of services offered by government but all things in moderation.
        `,
      ),
      container(
        mathml.governmentBudgetConstraint,
        text.ul(
          doc.li`${doc.b`G`}: Govt use of money`,
          doc.li`${doc.b`T`}: Tax revenue`,
          doc.li`${doc.b`∆B`}: change in outstanding debt`,
          doc.li`${doc.b`∆M`}: change in money supply`,
        ),
      ),
    ),
    ref({ slide: 47, page: 228 }, doc.h4`Inflation Tax`),
    doc.p`
      The revenue the government obtains by issuing new money
      (∆M) is called ${doc.b`seignorage`} or the
      ${doc.b`inflation tax`}. Inflation tax is paid by who
      ever is holding currency, while this sounds like everyone
      in practise different people hold different portions of
      their wealth in different assets. Those holding their
      wealth in land for example will not end up paying this
      so called tax. This ends up being a transfer from those
      holding cash to those holding assets.
    `,
    doc.p`
      In the case of debts, there are cases where a government
      runs a large debt and its spending is greater than the
      rate at which it collects tax, but it still has an
      obligation to pay its debts. If they don't lenders will
      stop lending, so there's a temptation for them to pay
      those debts by printing money. This typically leads to
      ${doc.b`Hyperinflation`}.
    `,
    todo({}, 'quote Sargent'),
    ref({ slide: 48, page: 229 }, doc.h4`Central Bank Independence`),
    doc.p`
      In an effort to rule out this temptation most countries
      have arrived at the decision to establish a level of
      independence for their central banks.
    `,
  ),
));

export const tutorialNotes = createDoc(() => dashbox(
  doc.h2`Tutorial Notes`,
  noteOn('inflation')(
    doc.li`to the central bank expected inflation is more important than actual inflation`,
    doc.li`who is Paul Volker, ${text.ul(
      doc.li`Read the wikipedia on him`,
      doc.li`He made everyone unemployed`,
      doc.li`Why did he do this? To eliminate inflation`,
    )}`,
    doc.li`Something about stagflation${text.ul(
      doc.li`Politically hard to fix`,
      doc.li`Need to put more people out work`,
    )}`,
    doc.li`What is worse, deflation or inflation${text.ul(
      doc.li`Is one easier to manage by a central bank?`,
    )}`,
    doc.li`yield curve${text.ul(
      doc.li`Increase cash rate, and yield curve will go up`,
    )}`,
    doc.li`risk free rate, government bond rate`,
  ),
));
