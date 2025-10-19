/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2, doc } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { n, space, sub, frac } = mathml;

const { mi, mo, mtext, mrow } = mathml2;

const { annotationUnder } = mathmlHelper_2;

const {
	eq, add3, add, mul2, eqId, minus,
	minusP, mul3,
} = mathmlHelper;

export const moneyTransmission = doc.figure(
  mathml2.math(
    mrow(
      mo`↑`,
      space(4), mtext`interest rate`,
      space(12), mathml.SPECIAL.arrow, space(12),
      mo`↓`, space(4), mtext`investment`,
      space(12), mathml.SPECIAL.arrow, space(12),
      mo`↓`, space(4), mtext`output`,
    )
  ),
  doc.figcaption`Monetary transmission: higher interest rate reduces investment and output`
);

export const gdpExpenditure = {
  output: doc.figure(
    mathml2.math(
      mrow(
        sub(mi`Y`, mi`t`),
        space(4), mo`=`, space(4),
        add3(
          sub(mi`C`, mi`t`),
          sub(mi`I`, mi`t`),
          add(
            sub(mi`G`, mi`t`),
            minus(
              sub(mi`EX`, mi`t`),
              sub(mi`IM`, mi`t`)
            )
          )
        ),
      )
    ),
    doc.figcaption`Output in Expenditure Accounting identities.`
  ),
  consumption: doc.figure(
    mathml2.math(
      eq(
        sub(mi`C`, mi`t`),
        mul2(
          sub(mi`ā`, mi`c`),
          sub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Consumption`
  ),
  government: doc.figure(
    mathml2.math(
      eq(
        sub(mi`G`, mi`t`),
        mul2(
          sub(mi`ā`, mi`g`),
          sub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Government`
  ),
  exports: doc.figure(
    mathml2.math(
      eq(
        sub(mi`EX`, mi`t`),
        mul2(
          sub(mi`ā`, mi`ex`),
          sub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Exports`
  ),
  imports: doc.figure(
    mathml2.math(
      eq(
        sub(mi`IM`, mi`t`),
        mul2(
          sub(mi`ā`, mi`im`),
          sub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Imports`
  ),
  investment: doc.figure(
    mathml2.math(
      eq(
        frac([sub(mi`I`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
        minus(
          sub(mi`ā`, mi`i`),
          mul2(
            mi`b̄`,
            minusP(sub(mi`R`, mi`t`), mi`r̄`)
          )
        )
      ),
    ),
    doc.figcaption`Investment`
  ),
};

export const outputDecomposition = {
  a: doc.figure(
    mathml2.math(
      eq(
        frac([sub(mi`Y`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
        add3(
          frac([sub(mi`C`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
          frac([sub(mi`I`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
          add(
            frac([sub(mi`G`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
            minus(
              frac([sub(mi`EX`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
              frac([sub(mi`IM`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
            ),
          )
        )
      ),
    ),
    doc.figcaption`Output identity in ratio form`
  ),
  b: doc.figure(
    mathml2.math(
      eq(
        frac([sub(mi`Y`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
        add3(
          sub(mi`ā`, mi`c`),
          sub(mi`ā`, mi`i`),
          add3(
            sub(mi`ā`, mi`g`),
            sub(mi`ā`, mi`ex`),
            minus(
              sub(mi`ā`, mi`im`),
              mul2(mi`b̄`, minusP(sub(mi`R`, mi`t`), mi`r̄`))
            )
          )
        )
      ),
    ),
    doc.figcaption`Equilibrium output as a function of behavioural parameters`
  ),
  c: doc.figure(
    mathml2.math(
      eqId(
        sub(mi`Ỹ`, mi`t`),
        frac(
          [
            minus(sub(mi`Y`, mi`t`), sub(mi`Ȳ`, mi`t`))
          ],
          [sub(mi`Ȳ`, mi`t`)]
        )
      ),
    ),
    doc.figcaption`Definition of the output gap`
  ),
  d: doc.figure(
    mathml2.math(
      eq(
        mrow(
          annotationUnder.attr({ label: mi`Ỹₜ` })(
            frac([sub(mi`Y`, mi`t`)], [sub(mi`Ȳ`, mi`t`)]),
          ),
          space(4), mo`-`, space(4), n(1)
        ),
        mrow(
          annotationUnder.attr({ label: mi`ā` })(
            sub(mi`ā`, mi`c`), space(4),
            mo`+`, space(4), sub(mi`ā`, mi`i`), space(4),
            mo`+`, space(4), sub(mi`ā`, mi`g`), space(4),
            mo`+`, space(4), sub(mi`ā`, mi`ex`), space(4),
            mo`-`, space(4), sub(mi`ā`, mi`im`), space(4),
            mo`-`, space(4), n(1),
          ),
          space(4), mo`-`, space(4),
          mul2(mi`b̄`, minusP(sub(mi`R`, mi`t`), mi`r̄`))
        )
      ),
    ),
    doc.figcaption`Output gap decomposition with parameter grouping`
  ),
};

export const outputGap = doc.figure(
  mathml2.math(
    eq(
      sub(mi`Ỹ`, mi`t`),
      minus(
        mi`ā`,
        mul2(
          mi`b̄`,
          minusP(sub(mi`R`, mi`t`), mi`r̄`)
        )
      )
    ),
  ),
  doc.figcaption`Output gap`
);

export const consumptionShare = doc.figure(
  mathml2.math(
    eq(
      frac([sub(mi`C`, mi`t`)], [sub(mi`Y`, mi`t`)]),
      add(
        sub(mi`ā`, mi`c`),
        mul2(mi`x̄`, sub(mi`Ỹ`, mi`t`))
      )
    ),
  ),
  doc.figcaption`Consumption share`
);

export const ISCurve = doc.figure(
  mathml2.math(
    eq(
      sub(mi`Ỹ`, mi`t`),
      mul2(
        annotationUnder.attr({ label: mtext`multiplier` })(
          frac([n(1)], [minus(n(1), mi`x̄`)]),
        ),
        annotationUnder.attr({ label: mtext`original IS curve` })(
          mo`[`,
          minus(
            mi`ā`,
            mul2(mi`b̄`, minusP(sub(mi`R`, mi`t`), mi`r̄`))
          ),
          mo`]`,
        )
      )
    ),
  ),
  doc.figcaption`IS curve with consumption response`
);

export const investmentLevel = doc.figure(
  mathml2.math(
    eq(
      sub(mi`I`, mi`t`),
      minus(
        mul2(sub(mi`ā`, mi`i`), sub(mi`Ȳ`, mi`t`)),
        mul3(mi`b̄`, minusP(sub(mi`R`, mi`t`), mi`r̄`), sub(mi`Ȳ`, mi`t`))
      )
    ),
  ),
  doc.figcaption`Investment level: Iₜ = ā_iȲₜ − b̄(Rₜ − r̄)Ȳₜ`
);



