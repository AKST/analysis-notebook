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
    book: page != null ? ({ chapter: 18, page }) : undefined,
    lec: slide != null ? ({ id: [8, 'W'], slide }) : undefined,
  }, item)
);

const LINKS = {
  cbo2002: text.a({ href: 'https://www.cbo.gov/sites/default/files/107th-congress-2001-2002/reports/125revisedjuly3.pdf' }),
  papers: {
    newhouse1992: text.a({ href: 'https://www.aeaweb.org/articles?id=10.1257%2Fjep.6.3.3' }),
  },
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
        'Government Spending', ['br'],
        ['small', { style: 'color: #aaaaff' }, ['ECON2102, W8, Lecture 1']],
      ]],
    ),
    infobox({ title: 'Resources' }).of(
      doc.p`See here for resources relating to the lesson`,
    ),
  ),
));

export const dummy = createDoc(() => dashbox(
  doc.h2`blah`,
  todo({}, 'content'),
));

export const introduction = createDoc(() => container(
  ref({ page: 509 }, doc.h2`Introduction`),
  dashbox(
    doc.p`
      Government spending plays no small role in the wider discussion of
      macroeconomics. This writeup but largely focuses on the government
      budget constraint, which is more a relation between todays debt
      repayments, taxes, and government spending with future debt.
    `,
    mathml.bondValue,
  ),
));

export const governmentSpendingRevenue = createDoc(() => container(
  ref({ page: 509 }, doc.h2`U.S. Government Spending and Revenue`),
  dashbox(
    twoThree(
      container(
        tables.usFederalBudget2018,
        ref({ page: 511 }, doc.h4`The Debt-GDP Ratio`),
        doc.p`
          When the government runs a defiicit to continue
          spending it borrows, and this is typically done
          by issuing government bonds to finance its
          spending. The US government itself own a large
          number of their own bonds, mostly in a social
          security trust fund for retirees.
        `,
        doc.p`
          However most analysises of government debt is
          typically analysises of government debt held
          outside the government, by foreigners in
          particular.
        `,
      ),
      container(
        mathml.debtToGdpRatio,
        mathml.primaryBudgetBalance,
        todo({}, 'Government debt ratio'),
        doc.dl(
          doc.dt`The Budget Balance`,
          doc.dd`The difference between tax revenues and spending.`,
          doc.dt`Budget Defict`,
          doc.dd`The difference when spending exceeds tax.`,
          doc.dt`Balanced Budget`,
          doc.dd`When spending and taxes are equal.`,
        ),
      ),
    ),
  ),
));

export const internationalEvidence = createDoc(() => container(
  ref({ page: 513 }, doc.h2`International Evidence on Spending and Debt`),
  dashbox(
    doc.p`
      Despite all the fuss the US doesn't compare that badly
      to other developed nations in terms of their debt to
      GDP ratio (at least in 2017). Then again I looked and
      it's mostly italy and japan from what I could tell.
    `,
  ),
));

export const budgetConstraint = createDoc(() => container(
  ref({ page: 514 }, doc.h2`The Government Budget Constraint`),
  dashbox(
    twoThree(
      container(
        doc.p`
          Below is the flow version of the government budget
          constraint, it says the sources of funds to the
          government must equal the uses of funds by the
          government.
        `,
        mathml.govtBudgetConstraint,
        doc.p`
          The government budget constraint is typically called
          a constraint, but personally I view it as an accounting
          identity or measure of expected debt in the subsequent
          period.
        `,
        mathml.bondsEvolution,
      ),
      doc.dl(
        doc.dt`𝛥Mₜ₊₁`,
        doc.dd`
          Source of funds from printing money
        `,
        doc.dt`TR`,
        doc.dd`
          Government transfers.
        `,
      ),
    ),
    container(
      ref({ page: 515 }, doc.h4`The Intertemporal Budget Constraint`),
      mathml.intertemporalBudgetConstraint,
      doc.p`
        The intertemporal budget constraint says that the present
        discounted value of government spending must equal the
        present discounted value of tax revenues. Additionally,
        the government’s budget must balance—not period by period,
        but rather in a present discounted value sense.
      `,
    ),
  ),
));

export const governmentBorrowing = createDoc(() => container(
  ref({ page: 517 }, doc.h2`How Much Can the Government Borrow?`),
  dashbox(
    twoThree(
      container(
        ref({ page: 517 }, doc.h4`Economic Growth and the Debt-GDP Ratio`),
        doc.p`
          ${doc.b`Generally`}: If your future prospects look good, lenders may
          be willing to lend you a lot today even though your current income
          may be low. A high and growing stock of debt, however, would set off
          alarms. Lenders would worry about your ability to pay in the future,
          unless they had some independent evidence that your future prospects
          looked much better than your current ones. Countries operate in much
          the same way.
        `,
        doc.p`The GDP to debt ratio is typically is how this assessed.`,
        ref({ page: 518 }, doc.h4`High Inflation and Default`),
        doc.p`
          When a countries debt-GDP ratio gets too higher lends begin to doubt
          a governments ability to repay its outstanding debt. When this happens
          there's a temptation to start the money printers.
        `,
        ref({ page: 519 }, doc.h4`Generational Accounting`),
        doc.p`
          By its very nature, a debt involves borrowing for the present and
          repaying in the future. You could say that existing generations
          are borrowing from future generations.
        `,
      ),
      container(
        mathml.privateSectorSavings,
        doc.dl(
          doc.dt`Disposable Income`,
          doc.dd`Income net Taxes`,
        ),
        infobox({ title: 'On Crowding out' }).of(
          doc.p`
            This is my own take, while I am sure there is a macro
            effect when the government subsidises a particular
            industry over other industries (redirecting investment
            to that industry). During 2024 in Australia there was
            a bit of commentary around the infrastructure spending
            crowing out residential development.
          `,
        ),
      ),
    ),
    container(
      ref({ page: 519 }, doc.h4`Deficits and Investment`),
      mathml.nationalIncomeIdentity,
      mathml.savingIdentity,
      doc.p`
        One source of concern about budget deficits is that if the
        government’s savings are negative, this may reduce investment.
        Some of the savings by the private sector or by foreigners must
        then go to fund the government’s borrowing, and these funds cannot
        be used for investment. Economists call this phenomenon crowding out:
        budget deficits may soak up saving in the economy and crowd out
        investment.
      `,
      doc.p`
        The crowding-out interpretation does not take into
        account the possibility that private or foreign saving might
        increase in response to the additional demand for funds by the
        government. Whether government borrowing crowds out investment
        has been the subject of much research in economics, and the
        issue is still debated. The extent to which budget deficits crowd
        out investment is unclear, and there no consensus on the answer
        in the economics literature
      `,
    ),
  ),
));

export const fiscalProblem = createDoc(() => container(
  ref({ page: 521 }, doc.h2`The (USA's) Fiscal Problem of the Twenty-First Century`),
  dashbox(
    twoThree(
      container(
        container(
          ref({ page: 522 }, doc.h4`The Problem`),
          doc.p`
            In the US the debt ceiling gets a lot attention as
            does their government debt. A lot of focus is placed
            on spending from business as usual which are difficult
            to wind back without affect quality of life such as
            social security, medicare and medicaid. For context:
          `,
          text.ul(
            doc.li`In ${doc.b`1950`} entitlement spending was 0.3% of GDP`,
            doc.li`In ${doc.b`2000`} this percent has risen to 7.6% of GDP`,
          ),
          doc.p`Some of the reasons for this change include:`,
          text.ul(
            doc.li`Increased generosity of entitlement programs`,
            doc.li`Increased eligiblity of population to programs`,
          ),
          doc.p`
            By and large the health expenditures are actually some
            of the larger contributors to the government deficit.
            Health expenditure is projected to rise from 3.4 percent
            of GDP in 2000 to 7.7 percent in 2030 and 14.9 percent
            by 2075 (this is all assuming existing trends hold).
          `,
        ),
        container(
          ref({ page: 525 }, doc.h4`Possible Solutions`),
          doc.p`
            As always, the solutions are rather in term of implementation
            are actually very simple, ensure spending is inline with
            taxisation (so a combination of decreasing expenditure and
            increasing taxisation). However as you can imagine politically
            it is a different matter.
          `,
          doc.p`
            It is also worth asking why Medicare and Medicaid spending are
            growing so rapidly. In part, people are living longer and the
            population is aging, the portion of the population with greater
            health needs are a more significant portion of the population now.
            ${doc.b`However`}, this is hardly unique to the USA, Japans much
            older population spends less on health (as share of GDP) than the
            USA. Research from ${LINKS.papers.newhouse1992`Joseph Newhouse`}
            from 1992 suggests doctors are incentativised to induce patients
            to spend more on medical care than they really need. This is often
            associated with newer more expensive medical technologies such as
            MRIs or CT scans (think about how often your dentist recommends a
            scan of your teeth just in case).
          `,
          doc.p`
            Newhouses research raises other questions, people don't have to buy
            these newer technologies, nor do people have to invent them if they
            don't want to. But they do, which suggests something about peoples
            preferences.
          `,
        ),
      ),
      container(
        infobox({ title: 'Note' }).of(
          doc.p`This section is very US centric.`,
        ),
        infobox({ title: 'CBO 2002 report' }).of(
          doc.p`
            The CBO in the USA released a report titled
            ${LINKS.cbo2002`A 125-Year Picture of the Federal
            Government’s Share of the Economy, 1950 to 2075`}.
          `,
        ),
        doc.dl(
          doc.dt`CBO`,
          doc.dd`Congressional Budget Office`,
          doc.dt`PBO`,
          doc.dd`Paralimentary Budget Office`,
        ),
        infobox({ title: 'Moral case for a Sustainable budget' }).of(
          doc.p`
            By all means the impact of the lives of indivisual people
            from these programs is a wonderful thing, and nothing here
            is a value judgement on this. So the concern is more one
            of the nature of the ability to continuing providing these
            services into the future. If it's not immediately obvious but
            for the same reason we care about climate change and the
            sustainability of our planet we ought to consider the
            sustainabilty of our institutions for the welfare of those
            who come after us.
          `,
          doc.p`
            To disregard their welbeing is hedonism at expense of those
            who come after us. ${doc.b`At the same time`}, we should be
            on guard for those who wish to use such motivation in bad
            faith to dispropotionately disregard the welbeing of our
            most vunerable today. It is not an easy decision and we
            should avoid any temptation to dismiss engaging with this
            question as too hard.
          `,
        ),
      ),
    ),
    container(
      doc.h4`Returns to life`,
      doc.p`
        Unlike consumption of a specific good, the length of
        ones life does not face diminishing returns. When you
        spend your time one something spending additional time
        on it becomes less desirable, inversely as you increase
        your available the value of you spending time on those
        things increases. With consumption being such a large
        contributor to GDP, it might be ill advised to reduce
        spending on it (indepently of effiency).
      `,
    ),
  ),
));

export const extras = createDoc(() => container(
  ref({ page: 527 }, doc.h2`Conclusion`),
  dashbox(
    twoColumns(
      todo({}, 'explain monetary ways to decrease debt'),
      todo({}, 'explain fiscal ways to decrease debt'),
    ),
    doc.h4`Government Budget Constraint at period t`,
    mathml.intertemporalDebtEvolution,
  ),
));
