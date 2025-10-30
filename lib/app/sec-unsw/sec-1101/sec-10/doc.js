/**
 * @import { Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import * as prelude from '../prelude.js';
import { doc } from '@app/prelude.js';

const {
  alternating, dashbox, infobox,
  crossSectionTable,
  defineTerm, readmore, todo, text,
} = prelude.components;
const { container, twoColumns, twoThree } = prelude.layout;
import * as mathml from './mathml.js';
import * as tables from './tables.js';

/**
 * @param {string} label
 * @returns {Widget<any, State, Config>}
 */
export const createPlaceholder = (label) => ({
  meta: { kind: 'document' },
  render: () => container(
    todo({}, `for "${label.trim()}" graphic`),
  ),
});

const READMORE = {
  purePublicGood: readmore({
    summary: ['Pure Public Goods'],
    details: [doc.p`
      Pure Public Goods represent goods that are
      perfectly non-rivalrous and non-excludable
    `],
  }),
  nonRivalry: readmore({
    summary: ['Non-Rivalry'],
    details: [doc.p`
      One individual's consumption of the good
      does not impede another individual from
      consuming it as well: the marginal cost
      of providing the public good to an
      additional individual is equal to zero.
    `],
  }),
  nonExcludability: readmore({
    summary: ['Non-Excludability'],
    details: [doc.p`No one can be excluded from consuming the good.`],
  }),
  impurePublicGoods: readmore({
    summary: ['Impure Public Goods'],
    details: [doc.p`
      Impure Public Goods represent goods that are
      non-rivalrous and non-excludable only up to
      a point
    `],
  }),
  marginalSocialBenefit: readmore({
    summary: ['Marginal Social Benefit'],
    details: [doc.p`
      The Marginal Social Benefit is the vertical
      sum of the individual marginal benefits.
    `],
  }),
};

const INFOBOX = {
  enclosure: infobox({ title: 'Enclosure' })(
    text.p.m`
      Another name for common pool goods is common goods. This
      name goes back to the enclosurement where there was
      "The Commons" which was a shared space for agriculture
      for commoners. The Enclosurement was about gradually
      converting this into private priority to different
      farmers.
    `,
    ['br'],
    text.p.m`
      Enclosure happened informally over time through agreements
      but eventually parliament formalised it through several
      acts of paraliament.
      The stated objective of this was to improve agriculture
      yield and effiency, While that likely occurred it also
      generally agreed that there other interests motivating
      these acts of enclosure.
    `,
  ),
  verticalSummation: infobox({ title: 'Vertical Summation' })(
    text.p.m`
      Unlike with private goods aggregating the demand
      curves of a public good is simply a matter of
      getting the sum of the different coefficients.
      It should add up to the marginal cost of the good
      or service.
    `,
    ['br'],
    ['span', { style: 'font-size: 16px' }, [
      mathml.verticalSummation()
    ]],
  ),
  lindhalPrice: infobox({ title: 'Lindhal Price' })(
    text.p.m`
      To get each consumers lindhal price, use
      the optimal quantity in each consumers
      curve.
    `,
    ['br'],
    ['span', { style: 'font-size: 16px' }, [
      mathml.lindahlPrice(),
    ]],
  ),
};

const OTHER_TABLES = {
  typesOfGoods: crossSectionTable({
    rowColor: { yes: 'green', no: 'red' },
    rowHeader: { name: 'Rivalrous', color: 'blue' },
    colColor: { yes: 'green', no: 'red' },
    colHeader: { name: 'Excludable ($)', color: 'blue' },
    outcomes: {
      yes: {
        yes: alternating(['Private Good', doc.frag(['br'], 'T-Shirts')]),
        no: alternating(['Common Pool Goods', doc.frag(['br'], 'Natural Resources')]),
      },
      no: {
        yes: alternating(['Club Goods', doc.frag(['br'], 'Cable TV')]),
        no: alternating(['Pure Public', doc.frag(['br'], 'Public Radio')]),
      },
    },
    footer: ['Different types of goods'],
  }),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const header = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      dashbox(
        doc.h1`Public Goods`,
        text.p.l`
          Primarily because Public Goods break the
          "Goods are excludable and rival" assumption
          of Perfect competition, they are an example
          of an imperfect competition. For that reason
          markets for public goods are not perfectly
          competitive.
        `,
        OTHER_TABLES.typesOfGoods,
      ),
      container(
        INFOBOX.enclosure,
      ),
    ),
    ['div', { className: 'c2' }, [
      READMORE.nonRivalry,
      READMORE.nonExcludability,
      READMORE.purePublicGood,
      READMORE.impurePublicGoods,
    ]],
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const curveInformation = {
  meta: { kind: 'document' },
  render: (_ctx, state) => container(tables.curveInformation(state)),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const aggregatingDemandForPublicGoods = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      dashbox(
        doc.h2`Aggregating Demand for Public Goods`,
        doc.p`
          Unlike private goods, public goods can be used by
          multiple people at the same fime (they are
          non-rivalrous). Therefore, when we aggregegate
          the seperate demand curves, we add ${
          doc.b`vertically rather than horizontally`}
          (by units) to calculate aggregate demand.
        `,
        doc.p`
          The aggregated curve (or ${doc.b`marginal social
          benefit of a unit of a public good`} is the sum of
          the individual marginal benefits of the good, each unit
          can be enjoyed by multiple consumers, due to the non-rival
          nature of the public good.
        `,
        doc.quote`
          When the consumer curves are basic linear curves, you can
          get the aggregate curve by summing the coefficients and
          using them in a new aggregate curve. If the curve is a
          discrete series of monotonically decreasing reservation
          prices you can also just add those together as well.
        `,
        doc.h4`Samuelson Condition`,
        doc.p`
          The Samuelson Condition states that the
          efficient quantity of a public good is
          found by setting the sum of the individual
          marginal benefits equal to the marginal cost.
        `,
        doc.h4`Lidahl prices`,
        doc.p`
          Each indivisual pays for the provision of
          a public good according to their marginal
          benefit.
        `,
      ),
      container(
        INFOBOX.verticalSummation,
      ),
    ),
  ),
};

/**
 * @type {Widget<any, State, Config>}
 */
export const freeRiding = {
  meta: { kind: 'document' },
  render: () => container(
    twoThree(
      dashbox(
        doc.h2`Free Riding`,
        doc.p`
          One problem can occur with public goods is
          free riding. This occurs when different
          consumers which want different quantities
          and those who want the higher quantity end
          up paying the cost for those (who want the
          service) but who do not want the service as
          much as others. This can result in an
          under provision of the public good, which
          can translate into Dead Weight Loss.
        `,
        doc.h3`Cost of free riding`,
        doc.p`
          While those paying for the good get their
          portion they are likely unhappy with
          shoulder the cost for others. However for
          the free riders there still may be less
          output than they would like in the end.
          This would be represented as dead weight loss.
        `,
        doc.h3`Paying Lindhal Prices`,
        doc.p`
          One way around this, is everyone pays their
          Lindhal price which will end up being their
          portion of the good that they enjoy.
        `,
      ),
      INFOBOX.lindhalPrice,
    ),
  ),
};


/**
 * @type {Widget<any, State, Config>}
 */
export const marketFailure = {
  meta: { kind: 'document' },
  render: () => container(
    dashbox(
      twoThree(
        container(
          doc.h2`Public Goods and Market Failure`,
          doc.p`
            Because public goods are non-excludable, they are
            under provided in the private market, as individuals
            can benefit from their provision without paying for
            them (free-riding).
            This represents a violation of the invisible hand
            priniciple. Indivisuals seeking to maximise their
            own benefit will not result in the socially optimal
            allocaiotn of resources.
          `,
          doc.p`
            For these reasons, it is necessary for the government
            to intervene and help manage the provision of the
            public good.
          `,
        ),
        infobox({ title: 'Examples of Public Goods' })(
          text.p.m`
            Some Examples of service provided
            by the government to provide a
            better outcome than the market.
          `,
          text.ul(
            doc.li`The Military`,
            doc.li`Infrastructure`,
            doc.li`Education`,
            doc.li`Healthcare`,
          ),
        ),
      ),
      ['hr'],
      twoThree(
        container(
          doc.h3`Government Intervention Remedies`,
          doc.p`
            The government can provide these services, whilst
            funding them a number of ways ${doc.i`(which are better
            elaborated on in a text on macro economics)`}, But
            sometimes that solution is simply funding them with
            tax revenue.
          `,
          doc.p`
            Part of the challenge is freeriding is almost always better
            for the indivisual than paying their Lindahl price. Indivisuals
            have an incentive to low ball and underestimate their marginal
            benefit of a public good, hoping to free ride on others provision.
          `,
        ),
        infobox({ title: 'Fairness in Taxation' })(
          container(
            text.p.m`
              Some consideration for taxiation, should people
              pay based on...
            `,
            text.ul(
              doc.li`Their ability pay?`,
              doc.li`Their consumption of the good?`,
            ),
          ),
        ),
      ),
    ),
  ),
};
