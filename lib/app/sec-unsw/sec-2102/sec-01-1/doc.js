/**
 * @import { E, DocumentWidget, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */
import { doc } from '@app/prelude.js';
import * as prelude from '../prelude.js';
import * as mathml from './mathml.js';
import * as tables from './tables.js';

const { twoColumns, twoThree, container } = prelude.layout;
const { text, infobox, dashbox, note, todo } = prelude.components;
const { createDoc } = prelude.util;

const LINKS = {
  tradingEconomics: text.a({ href: 'https://tradingeconomics.com' })`Trading Economics`,
  tutorialNotes: text.a({ href: 'https://www.desmos.com/calculator/epl08s8qwm' })`Desmos`,
  fred: text.a({ href: 'https://fred.stlouisfed.org' })`FRED`,
};

const INFOBOXES = {
  returnsToScale: infobox({ title: 'Returns To Scale' })(
    doc.p`${doc.b`Constant returns to scale`}:
      Is when the exponent coeffecients for labour
      and capital sum to 1, as they have done so
      far. When you increase labour and captial
      you will double output.
    `,
    doc.p`${doc.b`Increasing returns to scale`}:
      This is when the sum of the exponent coeffients
      is greater than 1. When you increase labour
      and captial you the increase in output will be
      more than double.
    `,
    doc.p`${doc.b`Decreasing returns to scale`}:
      This is when the sum of the exponent coeffients
      is less than 1 output will increase by less
      than double.
    `,
  ),
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
      doc.h1`Macroeconomics 2${doc.br()}${['small', { style: 'color: #aaaaff' }, ['ECON2102, W1, Lecture 1']]}`,
    ),
    infobox({ title: 'Resources' })(
      doc.p`See here for resources relating to the lesson`,
      doc.br(),
      text.ul(
        doc.li`${LINKS.tutorialNotes}: Working out for tutorial`,
        doc.li`${LINKS.tradingEconomics}: Data on economics`,
        doc.li`${LINKS.fred}: Federal Reserve Bank of St. Louis`,
        doc.li`Chapter 4 of the Textbook`,
      ),
    ),
  ),
));

export const modelOfProduction = createDoc(() => dashbox(
  doc.h2`A Model of Production`,
  doc.p`
    The goal of this chapter/lesson is to revise the model
    production introduced in previous subjects and to do
    revision on the Cobb Douglas production function, in
    addition to a model we can use to ${doc.i`model`}
    macro economic problems. This model will help us address
    questions like, why are Americans X times richer than
    ${doc.i`[insert other nation]`}.
  `,
  doc.h3`Production Function`,
  mathml.production.generalForm,
  doc.p`This is the general form of the production function.`,
  text.ul(
    doc.li`${doc.b`Y`}: output or ${doc.b`GDP`}`,
    doc.li`${doc.b`K`}: phyisical capital, machines, equipment, structures, tools`,
    doc.li`${doc.b`L`}: labour (number of workers or hours or work)`,
    doc.li`${doc.b`A`}: technology (a scale of factor)`,
  ),
  doc.h4`Cobb Douglas`,
  mathml.production.cobbDouglas,
  doc.quote`
    The Australia Government has a special name for Ā,
    being ${doc.b`total factor productivity`}.
  `,
  doc.p`
    'F' can be defined a number of ways, one such way (and the way
    we are focusing on), is the Cobb Douglas model. In most
    industrialised countries Alpha is roughly 2 thirds (2/3),
    suggesting Labor is more important to economic rough in these
    economies.
  `,
  doc.quote.of(
    doc.p`Note that letters with bar are assumed to be exogenous`,
  ),
  doc.h4`Some properties`,
  text.ul(
    doc.li`An increase in K or L produces an increase in Y but with diminishing returns`,
    doc.li`There are constant returns to scale in K and L. (Expotents sum to 1)`,
  ),
));

export const deminishingReturns = createDoc(() =>
  twoThree(
    dashbox(
      doc.h3`Diminishing Returns`,
      doc.p`
        If you observe the above 3d plot, say if you fixed all
        variables except labour or capital, as you increase
        that specific variable there will be a point where
        growth just slows down without an increase in the other.
      `,
      doc.p`
        For example if capitial was fixed but labour continued
        to grow, the growth you get with each labourer will be
        less than previous labour. While growth won't necesssarily
        stop growth will slow. Once you reach this point
        the moment you start adding captial, growth will speed up
        again. These rates will vary with the value of
        ${doc.b`𝛼`}.
      `,
    ),
    INFOBOXES.returnsToScale,
  ),
);

export const marginalProducts = createDoc(() => dashbox(
  doc.h2`Marginal Products of Labour and Capital`,
  text.ul(
    doc.li`${doc.b`MPK`}: Marginal Product of Capital`,
    doc.li`${doc.b`MPL`}: Marginal Product of Labour`,
  ),
  doc.p`Below we'll compute the marginal products, note that:`,
  mathml.marginalProduct.preamble,
  twoColumns(
    container(
      doc.h4`Marginal Product of Capital`,
      mathml.marginalProduct.ofCapital,
    ),
    container(
      doc.h4`Marginal Product of Labour`,
      mathml.marginalProduct.ofLabour,
    ),
  ),
));

export const modelOfFirmsBehaviour = createDoc(() => dashbox(
  doc.h2`Model of Firms Behaviour`,
  doc.p`
    To model a firm, we need understand how much they
    are willing to pay for labour and capital? For the
    time being, lets assume the supplies of labour and
    capital are exogenously given by L̄ and K̄ respectively,
    and they are fixed. How much of the fixed suppy do
    firms desire to use?
  `,
  doc.quote`
    Note when these are fixed, you may as well use them all. Or
    at least lets assume this for the sake of the model for now.
    In reality this isn't always true, there frequently people
    who are unemployed and captial unutilised (such as empty
    buildings).
  `,
  doc.h4`Define some Variables`,
  text.ul(
    doc.li`${doc.b`w`}: real wage paid to labour`,
    doc.li`${doc.b`r`}: real rental paid to capital`,
    doc.li`${doc.b`Π`}: real profits of a typical firm`,
  ),
  doc.h4`Profits for typical firm`,
  mathml.firms.profits,
  text.ul(
    doc.li`${doc.b`Assume`} firms will profit maximise`,
    doc.li`${doc.b`Assume`} firms act in competitive manner, take w & r as given.`,
    doc.li`${doc.b`Assume`} firms are perfectly competitive.`,
    doc.li`
      The only thing firms get to choose are the amounts of K and L to employ.
    `,
  ),
  doc.p`All other things being equal`,
  twoColumns(
    container(
      doc.p`Adding a unit of labour`,
      text.ul(
        doc.li`Has a cost of ${doc.b`w`}.`,
        doc.li`Has a benefit of ${doc.b`MPL`}.`,
      ),
    ),
    container(
      doc.p`Adding a unit of Capital`,
      text.ul(
        doc.li`Has a cost of ${doc.b`r`}.`,
        doc.li`Has a benefit of ${doc.b`MPK`}.`,
      ),
    ),
  ),
  doc.p`Therefore...`,
  text.ul(
    doc.li`Firms will hire more more workers if MPL > w`,
    doc.li`Firms will rent more capital if MPK > r`,
  ),
  doc.h4`Profit maximisation conditions`,
  twoColumns(
    mathml.firms.profitMaximisingCapital,
    mathml.firms.profitMaximisingLabour,
  ),
));

export const solvingModelEquilibrium = createDoc(() => dashbox(
  doc.h2`Solving the Model General Equilibrium`,
  twoColumns(
    container(
      doc.h4`Because...`,
      doc.p`Collect the equations of the model`,
      text.ul(
        doc.li`Production Function Y = Ā * K^(1 - 𝛼) * L^𝛼`,
        doc.li`Rule for hiring labour 𝛼 * (Y/L) = w`,
        doc.li`Rule for hiring capital (1-𝛼) * (Y/K) = r`,
        doc.li`Demand = Supply of Labour L = L̄`,
        doc.li`Demand = Supply of captial K = K̄`,
      ),
      doc.p`Variable classification`,
      text.ul(
        doc.li`Endogenous variables, Y, K, L, w, r`,
        doc.li`Exogenous variables, Ā, K̄, L̄`,
        doc.li`Constants 𝛼`,
      ),
    ),
    container(
      doc.h4`Therefore...`,
      doc.p`We can solve everything to be...`,
      text.ul(
        doc.li`Labour L${['sup', '*']} = L̄`,
        doc.li`Capital K${['sup', '*']} = K̄`,
        doc.li`Output Y${['sup', '*']} = Ā K̄${['sup', '1 - 𝛼']} L̄${['sup', '𝛼']}`,
        doc.li`Real Wage w${['sup', '*']} = 𝛼(Y${['sup', '*']}/L${['sup', '*']})`,
        doc.li`Real rental rate r${['sup', '*']} = (1-𝛼)(Y${['sup', '*']}/K${['sup', '*']})`,
      ),
      doc.quote`Would be nice if the world was this simple`,
    ),
  ),
  doc.h4`Demand and supply in Labour and Capital Markets`,
  doc.p`
    Note that a change in the supply of labour (capital) will
    spill-over into the market for capital (labour) through a
    change in the MPK (MPL).
  `,
));

export const nationalAccounting = createDoc(() => dashbox(
  doc.h3`National Accounting`,
  twoColumns(
    container(
      doc.p`
        Given the right hand side, you could claim
        the country and all firms are making zero
        economic profit. Which of course is rediculous,
        however this isn't to say this isn't useful as
        it is infact a benchmark.
      `,
      doc.p`
        You can see where issues in the ecconomy are when
        irregularities crop up when comparing this against
        these benchmarks.
      `,
    ),
    mathml.nationalAccounting.identities,
  ),
  doc.h3`Into percapita terms`,
  twoThree(
    container(
      doc.p`
        Per-capita mertics is sometimes used for comparing which
        countries are poorer and which are richer. The per capita
        output can depend on two thing.
      `,
      text.ul(
        doc.li`Its technology level`,
        doc.li`Its capital per person (or capital to labour ratio)`,
      ),
    ),
    container(
      mathml.perCapita.output,
    ),
  ),
));

export const experiments = createDoc(() => dashbox(
  doc.h2`Experiments with model`,
  doc.h4`Can captial per person explain difference in capital per Capita?`,
  doc.p`
    Assume all countries have the same technology. Then reduce
    the output per capita to the capita per person ratio, can
    this explain differences in per capita per person? Well no.
    In reality this just isn't the case models that do this to
    predict output per capita frequently overshoot. This difference
    is infact an estimate for Technology (total factor productivity),
    so in a way you can use this incorrect model to measure this difference.
  `,
  todo({}, 'insert table from 59:46'),
  doc.h4`The role of TFP in national wealth`,
  text.ul(
    doc.li`Rich (Poor) countries tend to have relatively high (low) levels of TFP`,
    doc.li`There are big cross-country differences in TFP`,
    doc.li`Differences in capital per person explain roughly 1/4 of difference in output per person, between rich and poor countries.`,
    doc.li`Differences in TFP explain roughly the remaining 3/4 of the difference.`,
  )
));

export const whatFactorsMightCauseDiffInTFP = createDoc(() => dashbox(
  doc.h2`What factors might cause differences in TFP?`,
  twoColumns(
    container(
      doc.h4`Human Capital`,
      doc.p`
        Defined as the stock of skills that humans
        accumulate to make themselves more
        productive. In lay man terms, education,
        qualitification, and skills.
      `,
      doc.h4`Technology`,
      doc.p`
        Rich and poor countries may be using different
        production technologies.
      `,
    ),
    container(
      doc.h4`Institutions`,
      doc.p`
        Institutions are things like rules (formal or
        informal, as long as they are adhered), regulations,
        and government policies for economic activity.
        Institutions greatly influence the incentitives
        and opportunities workers, investors and firms
        pursue and their economic success.
      `,
      doc.h4`Misallocation`,
      doc.p`
        If inputs to production (labour, capital) are
        misallocated across industries or firms then
        production is less than it would be otherwise.
      `,
    ),
  ),
));
