/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import { twoColumns, twoThree, container } from '@prelude-uni/layout.js';
import { text, clsRef, infobox, dashbox, note, todo } from '@prelude-uni/components.js';
import { createDoc } from '@prelude-uni/util.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

/**
 * @param {{
 *   page?: number,
 *   slide?: number,
 * }} cfg
 * @param {E.Item} item
 */
const ref = ({ page, slide }, item) => (
  clsRef({
    book: page != null ? ({ chapter: 19, page }) : undefined,
    lec: slide != null ? ({ id: [9, 'M'], slide }) : undefined,
  }, item)
);

const LINKS = {
  wtoPaul: text.a({ href: 'https://www.wto.org/english/res_e/reser_e/cadv_e.htm' }),
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

export const intro = createDoc(() => container(
  twoThree(
    container(
      ['h1', [
        'International Trade', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W9, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' }).of(
      doc.p`Chapter 19 of the textbook`,
    ),
  ),
));

export const introduction = createDoc(() => container(
  ref({ page: 533 }, doc.h2`Introduction`),
  dashbox(
    container(
      doc.p`Generally the following write up will explore the following:`,
      text.ol(
        doc.li`Trade across countries is quite similar to trade across people within a country.`,
        doc.li`While trade deficits are seen issues they can improve welfare.`,
        doc.li`One of the most important concepts in trade theory is comparitive advantage.`,
        doc.li`There's a relationship between trade and free migrations`,
      ),
    ),
    twoColumns(
      container(
        ref({ page: 534 }, doc.h3`Basic Facts on Trade`),
        doc.p`
          In the decades since WW2 trade has dramatically
          increased, this can be measured as changes in the
          portion of GDP. In the US it has gone from 5% of
          GDP in the 1950s to 12-15% in recent times (up to
          2020).
        `,
        doc.h4({ className: 'transport-animation' })`Transport costs`,
        doc.p`
          This is in part due to a ${doc.b`reduction in
          transportation and shipping costs`}. Such as
        `,
        text.ul({ itemSpace: 'sparse' }).of(
          doc.li`
            The average charge per ton in the 1920s was $95
            and in the 1990s became $29.
          `,
          doc.li`
            Revenue per passenger mile fell from 112 cents in
            1930 to 11 cents by 2008.
          `,
          doc.li`
            A three minute phone call from new york to london
            in the 1930s costed $250 to now (2025) costs zero point
            nothing.
          `,
        ),
        doc.h4`Trade Barriers`,
        doc.p`
          Another significant reason for this increase is
          a ${doc.b`reduction of trade barriers`}. Trade
          tariffs and quotas are far less common (as of
          2025)${doc.sup`[1]`}. We can observe this in:
        `,
        text.ul({ itemSpace: 'sparse' }).of(
          doc.li`
            A reduction in the worldwide average for
            manufacturing tariffs from 14% in the 1960s
            to 4% by the 2000s.
          `,
          doc.li`
            For many countries the import and export share
            of GDP is greater than 20%, such countries include:
            Canada 🇨🇦, Russia 🇷🇺, Germany 🇩🇪, China 🇨🇳,
            France 🇫🇷, etc.
          `,
        ),
        doc.h4`Changes in US trade trends`,
        doc.p`
          In the US you can see a widening of the gap between
          import and exports, or net exports as share of GDP
          (this is called the ${doc.b`the trade balance`}).
          This is actually relatively new compared to what was
          observed between 1950 and 1975 where the US had a
          trade surplus. It exported more goods and imported
          more services. That trends has since reversed as of 1975.
        `,
      ),
      container(
        infobox({ title: 'Trade Balance, closed world economy' }).of(
          doc.p`
            In thinking about trade and trade deficits, is that
            trade has a balance. When they are being exported
            someone is importing them. While indivisual countries
            are open economies it is helpful to consider the world
            as a closed economy (even if its unclear where it would
            open up trade too).
          `,
          doc.p`A surplus somewhere is a deficit elsewhere.`,
        ),
        ref({ page: 536 }, doc.h3`Reasons for Trade`),
        doc.p`
          When we can think of the world as a closed economy where
          trade may occur between parts of it depending whether thye
          are open or closed, it begins to become more clear why
          earlier trade between many nations is similiar to trade
          within a single nation.
        `,
        doc.p`
          Some parts may consume a lot of a certain good while producing
          very little and vice versa.
        `,
        infobox({ title: 'Trade within Sydney' }).of(
          doc.p`
            Putting the reasons why this is so aside, there are
            concentrations of certain professions in different
            parts of sydney. In places like Woolahra there is
            an abundance of lawyers while who who consume any
            goods not produced by their residents.
          `,
        ),
        doc.h4`Why do people trade?`,
        doc.p`
          The basic motivation for international trade is the same
          as the motivation for trade within a country: ${doc.b`people
          trade because ${doc.b`they value goods that other people
          produce more at the margin`} than ${doc.i`they value what
          they themselves own`}`}.
        `,
        doc.p`
          International trade is really no different from trade within
          a country, and gains from trade lie at the heart of economics.
        `,
      ),
    ),
  ),
  doc.div({ className: 'footnotes dashbox container' }).of(
    doc.h6`${doc.span({ className: 'icon' })`⚠️`} Footnotes`,
    text.ol(
      doc.li`
        Obviously within the year of 2025 (when I'm writing this), since the
        election of Donald Trump there is a lot of uncertainty in this space.
      `,
    ),
  ),
));

export const tradeAcrossTime = createDoc(() => container(
  ref({ page: 537 }, doc.h2({ className: 'hour-glass-animation' })` Trade across Time`),
  dashbox(
    twoThree(
      container(
        doc.p`
          The nature in which the ability to produce flucuates
          overtime is another way to show motivations for trade.
          Take food production for example, nations have seasonal
          wealth patterns which dictate when a crop can be grown
          and planted, and the periods in which a country can do
          this varies in the different hemispheres. Food also can't
          be stored indefiniately.
        `,
        doc.h4({ className: 'globe-animation' })`An example!`,
        doc.p`
          For example sake ${doc.b`lets consider two wheat producing
          countries in a reality in which wheat perishes`} ${doc.i`(it
          doesn't really which is why wheat houses exist, but it can be
          spoiled)`}. If these two countries want to smooth their
          consumption — ${doc.b`as in maintain the rate at which they consume
          wheat at any given time`} — they would need to trade to accomplish
          this (This is shown below).
        `,
        tables.wheatHarvests,
        doc.p`
          This is an example of international trade smooth ou their
          consumption. In a sceneario where both countries can produce
          the same product year around even then trade helps smooth out
          any risk associated with a bad harvest (we can think of this
          as a ${doc.b.of(doc.b`intertemporal trade function`)}. In this
          case we can think ${doc.b.of(doc.i`International trade as perfect
          risk-sharing`)}.
        `,
        doc.figure(
          doc.b`In the long run, trade must be balanced`,
          doc.figcaption`${doc.small`An imporant prinipal`}`,
        ),
        doc.p`
          While at different points in time we'll see different
          countries experince trade surpluses and deficits in
          the long run we'll see roles reverse over and over,
          over time and it'll balance out. Consumption (importing)
          is eventually paid for and it has to be paid somehow
          (with exports of some form). When its not paid for by
          exporting it is paid for lending but eventually lending
          constratints will push a country to produce pay those
          debts back.
        `,
        mathml.nationalAccountingImplications,
      ),
      container(
        doc.dl(
          doc.dt`The Trade Balance`,
          doc.dd`
            Net Exports (Exports net imports) as share of GDP. Exports net imports
            can also be thought of as the gap between exports and imports.
          `,
          doc.dt`Robinson Crusoe economy`,
          doc.dd`An economy where each person produces what they consume`,
          doc.dt`Balanced Trade`,
          doc.dd`When partipants in trade are neither running a deficit or surplus`,
          doc.dt`Intertemporal Trade function`,
          doc.dd`A function modelling trade overtime.`,
        ),
        mathml.intertemporalTradeBalanceConstraint,
        infobox({ title: 'Trade MUST balance in the long run' }).of(
          doc.p`
            When you hear this ${doc.b.of(doc.b`MUST`)}, think in
            an ${doc.b.of(doc.i`economic equilibrium logic`)} sense.
            It assumes a ${doc.b`no-Ponzi condition`} where no country
            can borrow indefinitely and roll over debt forever without
            eventually repaying their debt. In reality there are exceptions
            to this:
          `,
          text.ul(
            doc.li`Being the worlds reserve currency.`,
            doc.li`Defaulting on debt`,
            doc.li`A failed nation without any successor state taking on its debts`,
          ),
          doc.p`
            I personally hate this kind of way of describing it because
            when people evenutally hear being said without the context to
            know this Must is in an abstract sense within a model making
            certain assumptions sound clueless. I imagine this is said this
            way in education material order to keep the introduction of the
            idea simple.
          `,
          doc.quote`
            The USA is the most obvious glaring exception to this
            as its currency is the reserve currency and that changing
            would take alot. It is entirely possible trump may seek
            to change that but I don't think he'd seek to this intentionally
            more so it being an outcome of overplaying his hand.
          `,
        ),
        infobox({ title: 'Is running a deficit bad?' }).of(
          doc.p`
            No. Is taking out a home loan you're able to pay back bad?
          `,
        ),
      ),
    ),
  ),
));

export const tradeWithProduction = createDoc(() => container(
  ref({ page: 539 }, doc.h2`Trade with Production`),
  dashbox(
    twoThree(
      container(
        doc.p`
          Below is an initial setup for an example for 2 countries
          on the same content called North and South. They consume
          two different goods, however one of these countries is
          more capable of preducing either good. (Continue after
          table).
        `,
        tables.northSouthSetup,
        doc.p`
          The north is more capable at producing either good so
          they have a ${doc.b`absolute advantage`}. Despite
          north will still benefit from engaging in trade.
        `,
        doc.p`
          How does the North gain from trade here? Generally
          speaking it allows the north to free up resources
          to allocate to more valuable trade such as shifting
          workers to the produciton of computers. ${doc.b`This
          point will be made clearer by comparing the autarky
          scenario and trade example`}.
        `,
        ref({ page: 540 }, doc.h4`Autarky`),
        doc.table({ className: 'legend' }).of(
          doc.thead(doc.tr(doc.th`Symbol`, doc.th`Meaning`)),
          doc.tbody(doc.tr(doc.th`ω`, doc.td`Wage`)),
          doc.tbody(doc.tr(doc.th`P`, doc.td`Price`)),
          doc.tbody(doc.tr(doc.th`C`, doc.td`Consumption`)),
          doc.caption`Legend`,
        ),
        doc.p`
          The below equation can be used to solve for consumption.
        `,
        mathml.autarkyConsumpution,
        text.ul(
          doc.li`
            Wage for producing apples is equal to the number of apples a worker
            can produce
          `,
          doc.li`
            Wage for producing computers is effectively the opportunity cost of
            producing apples for computers (in the north thats 10 apples, in the
            south a computer is 50 apples).
          `,
        ),
        doc.p`
          And below is the resulting solved consumption for
          consumption under autarky.
        `,
        tables.northSouthAutarky,
        ref({ page: 542 }, doc.h4`Free Trade`),
        doc.p`
          When trade is allowed, something interesting that happens is
          now computers be bought where they are cheaper and sold where
          they are more expensive (this is called ${doc.b`arbitrage`}).
          In our scenario the north has an compartaive advantage in
          producing computers and the south has a comparitive advantage
          in producing apples.
        `,
        doc.p`
          More work is required to solve for the world price but below is
          a summary of the solved outcome. But both parties benefit from
          this arrangement and can now consume more, apples are now cheaper
          in the north and computers are now cheaper in the south.
        `,
        tables.northSouthFreeTrade,
      ),
      container(
        doc.dl(
          doc.dt`Absolute Advantage`,
          doc.dd`When an economy is more productive at all acts of production`,
          doc.dt`Comparative Advantage`,
          doc.dd`This is ones relative efficency at producing a good.`,
          doc.dt`Autarky`,
          doc.dd`A closed economy.`,
        ),
        infobox({ title: 'Paul Samuelson: on trade' }).of(
          doc.p.of(LINKS.wtoPaul`[From here]`),
          doc.quote`
            Nobel laureate Paul Samuelson (1969) was once challenged by
            the mathematician Stanislaw Ulam to "name me one proposition in
            all of the social sciences which is both true and non-trivial."
            It was several years later than he thought of the correct response:
            comparative advantage. "That it is logically true need not be argued
            before a mathematician; that is is not trivial is attested by the
            thousands of important and intelligent men who have never been able
            to grasp the doctrine for themselves or to believe it after it was
            explained to them."
          `,
          doc.quote`
            What did David Ricardo mean when he coined the term comparative
            advantage? According to the principle of comparative advantage, the
            gains from trade follow from allowing an economy to specialise. If a
            country is relatively better at making wine than wool, it makes
            sense to put more resources into wine, and to export some of the
            wine to pay for imports of wool. This is even true if that country
            is the world's best wool producer, since the country will have more
            of both wool and wine than it would have without trade. A country
            does not have to be best at anything to gain from trade. The gains
            follow from specializing in those activities which, at world prices,
            the country is relatively better at, even though it may not have an
            absolute advantage in them. Because it is relative advantage that
            matters, it is meaningless to say a country has a comparative
            advantage in nothing. The term is one of the most misunderdstood
            ideas in economics, and is often wrongly assumed to mean an absolute
            advantage compared with other countries.
          `
        ),
        doc.dl(
          doc.dt`Free labor mobility`,
          doc.dd`Another name for free migration`,
        ),
      ),
    ),
  ),
));

export const tradeInInputs = createDoc(() => container(
  ref({ page: 544 }, doc.h2`Trade in Inputs`),
  dashbox(
    twoColumns(
      container(
        doc.p`An important difference between free trade and free migration`,
        text.ul(
          doc.li`While tree trade is about comparative advantage.`,
          doc.li`Free Migration is about absolute advantage.`,
        ),
        doc.p`
          When people have the opportunity to work in the North for
          a higher wage than they receive in the South, the end result
          is everyone moving there and it ends up looking like the North
          under Autarky with more labourers.
        `,
        doc.p`
          Welfare of the residents of the North remains in unchanged
          (assuming no supply shocks to planned sectors such as infra),
          but the welfare of all the southern workers improves after
          gaining access to superior northern technology and productivity.
        `,
        tables.northSouthFreeMigration,
        doc.p`When comparing the two scenarios:`,
        text.ul(
          doc.li`Northern workers would prefer free trade`,
          doc.li`Southern workers would prefer free migration`,
        ),
      ),
      container(
        doc.p`
          Even so the world is more efficient under migration. Even
          moving from tree trade to free migration, the net welfare
          change is greater, and welfare losses experinced by the
          north are outsized by welfare gains experinced by the South.
          ${doc.b`In theory, the south could even negotiate with the
          North by providing some form of compensation to faciliate a
          transition from free trade to free migration and still be
          better off`}, a reasonable example of this might be some
          kind of entry fee.
        `,
        doc.p`
          There are other gains from migration that are harder to
          quantify. Large populations have agglomeration effects
          and a higher rate of idea inception and transfer. It's
          why you might learn working the city over a small town
          for white collar job.
        `,
        ref({ page: 545 }, doc.h4`Moving Capital vs Moving Labor`),
        doc.p`
          While it wasn't expressed this way, in our study of the
          Solow Swan model, gains from capital mobility were
          relatively small. Poor countries remained poor not
          because they possessed insufficent capital but often
          because their TFP was too low. This is consistent with
          our findings with the efficency gains from allowing more
          people to move the more productive country.
        `,
        doc.p`
          It is much easier to let someone in a developing country
          move to a developing country than reproduce identical
          institutions, infrastructure and technology.
        `,
        doc.p`
          This is
          also true in city planning, it is cleaper to let people
          to live next to the infrastructure that already exists.
        `,
        doc.p`
          If you're wondering what is meant by allow and why they
          may not already be allowed to do so, juristictions like
          New South Wales and all the other states in Australia,
          and the USA, and countries like Canada and the UK have
          planning system do place a limit on the number of homes
          allowed in a given area and these limits are very much
          a thing in Sydney.
        `,
      ),
    ),
  ),
));

export const costsOfTrade = createDoc(() => container(
  ref({ page: 546 }, doc.h2`The Costs of Trade`),
  dashbox(
    twoColumns(
      container(
        doc.p`
          In the earlier example of free trade, computer
          makers in the south become apple pickers, and
          apple pickers become computer makers in the
          north. In reality this doesn't happen.
        `,
        doc.p`
          The experince of a high skilled computer maker
          in the south becoming an apple picking is likely
          incredibly degrading and humiliating. And it would
          be very difficult for apple pickers in the north to
          become proficient at computer assembling, there is a
          nontrivial chance they'll remain unemployed for the
          rest of their life and the computer maker in the
          south to experince to undergo a fairly painful life
          transition. ${doc.b`There is some level of structural
          unemployment here`}.
        `,
      ),
      container(
        doc.p`
          How large are the job losess and reallocation costs (such
          as retraining). It is difficult to measure, but even with
          those who undergo retraining mant don't. Take Australia
          after globalisation for example, after liberalising trade
          and allowing the import of manufactured goods many men who
          worked in manufacturing never returned to work and permanently
          remained unemployed.
        `,
        doc.p`
          There are richer models that factor in these reallocation costs,
          which emphasis who exactly is a winner and loser to free trade.
          Losses tend to be concentrated in on particular groups or regions
          while the benefit is spread thinly across the entire population.
        `,
      ),
    ),
    doc.p`
      It's important for economists to consider how to redistribute
      the gain of trade with those dispropotionately disadvantaged.
    `,
  ),
));

export const tradeDeficitForeignDebt = createDoc(() => container(
  ref({ page: 549 }, doc.h2`The Trade Deficit and Foreign Debt`),
  dashbox(
    twoColumns(
      container(
        doc.p`
          Earlier we talked about trade deficits, typically this occurs
          because this country is expected to grow faster than the world
          as a whole. So what happens when that is not the case? Do we
          think the US is likely to grow faster than the rest of the
          world. Probably not, and definately not alot more than
          developing nations.
        `,
        ref({ page: 549 }, doc.h4`Trade & Growth around the World`),
        doc.quote`
          Cases where the ${doc.b`permanent-income hypothesis`} does not hold
        `,
        doc.p`
          The general idea that countries need a large trade deficit
          in order to grow also isn't the case and many countries
          opening up to trade in the 1990s to the late 2010s show
          this isn't always the case. However in the case of the
          fast growing exporters during this period, these countries
          were opening themselves up to trade and forcing firms to
          compete with the rest of the world, and borrowing was used
          to reward their best performing exporters.
        `,
        ref({ page: 550 }, doc.h4`The Twin Deficits`),
        doc.p`Below implies ${doc.b`private investment`} equals ${doc.b`total saving`}.`,
        mathml.savingIdentity,
        doc.p`
          If we rearrange it we can get a version of the national accounting
          identity that captures difference between domestic savings and
          investment, as well as showing the relation bewteen international
          flow of goods and the trade balance.
        `,
        mathml.nationalIncomeIdentity,
      ),
      container(
        doc.p`
          It also implies that the trade deficit is the additional borrowing
          that the united states does to finance the gap between investment
          and savings. If the United States (or any other country) runs a
          trade deficit, the rest of the world sends more goods to the United
          States than the United States sends back
        `,
        doc.p`
          Thre reason the rest of the world agrees to this arrangement because
          what it gets in return is some kind of financial promise that in the
          future the United states will send more goods back the other way.
          Either way it doesn't provide these goods for free, because dollars
          don't pay interest these sellers may choose to invest in US bonds or
          stocks.
        `,
        doc.p`
          The net flow of goods is often associated with a net flow of financial
          assets in the opposite direction (for reasons described above). In
          recent years there has been a combined decrease in savings and decline
          in investment coinciding with a trade deficit, this is called
          the ${doc.b`twin deficits`}.
        `,
        doc.h4`Net Foreign Assets & Foreign Debt`,
        doc.p`
          The US's trade deficit represents borrowing by U.S. residents
          from the rest of the world. Up until 1986 the United States was
          a net creditor to the rest of the world: foreign assets held by
          the US entities exceeded US assets held aboard. The difference
          between these two is called the ${doc.b`net international
          investment position`}. Now the opposite is true and the USA is
          a net debtor to the rest of the world.
        `,
        doc.p`
          How the USA will repay this is an open question, but as long
          as they are world reserve currency, maybe it doesn't matter and
          this is a contridiction we've arrived at due to a short coming we
          have yet to grasp in our model.
        `,
      ),
    ),
  ),
));
