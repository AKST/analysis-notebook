/**
 * @import { E } from '../../prelude-type.ts';
 */

import { mathml, mathml2, doc } from '../../prelude.js';
import { mathmlHelper, mathmlHelper_2 } from '../prelude.js';

const { frac } = mathml;

const { mi, mo, mtext, mrow, mn, msub, mspace } = mathml2;

const { annotationUnder } = mathmlHelper_2;

const {
	eq, add3, add, mul2, eqId, minus,
	minusP, mul3,
} = mathmlHelper;

export const moneyTransmission = doc.figure(
  mathml2.math(
    mrow(
      mo`↑`,
      mspace(4), mtext`interest rate`,
      mspace(12), mathml.SPECIAL.arrow, mspace(12),
      mo`↓`, mspace(4), mtext`investment`,
      mspace(12), mathml.SPECIAL.arrow, mspace(12),
      mo`↓`, mspace(4), mtext`output`,
    )
  ),
  doc.figcaption`Monetary transmission: higher interest rate reduces investment and output`
);

export const gdpExpenditure = {
  output: doc.figure(
    mathml2.math(
      mrow(
        msub(mi`Y`, mi`t`),
        mspace(4), mo`=`, mspace(4),
        add3(
          msub(mi`C`, mi`t`),
          msub(mi`I`, mi`t`),
          add(
            msub(mi`G`, mi`t`),
            minus(
              msub(mi`EX`, mi`t`),
              msub(mi`IM`, mi`t`)
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
        msub(mi`C`, mi`t`),
        mul2(
          msub(mi`ā`, mi`c`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Consumption`
  ),
  government: doc.figure(
    mathml2.math(
      eq(
        msub(mi`G`, mi`t`),
        mul2(
          msub(mi`ā`, mi`g`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Government`
  ),
  exports: doc.figure(
    mathml2.math(
      eq(
        msub(mi`EX`, mi`t`),
        mul2(
          msub(mi`ā`, mi`ex`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Exports`
  ),
  imports: doc.figure(
    mathml2.math(
      eq(
        msub(mi`IM`, mi`t`),
        mul2(
          msub(mi`ā`, mi`im`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Imports`
  ),
  investment: doc.figure(
    mathml2.math(
      eq(
        frac([msub(mi`I`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
        minus(
          msub(mi`ā`, mi`i`),
          mul2(
            mi`b̄`,
            minusP(msub(mi`R`, mi`t`), mi`r̄`)
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
        frac([msub(mi`Y`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
        add3(
          frac([msub(mi`C`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
          frac([msub(mi`I`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
          add(
            frac([msub(mi`G`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
            minus(
              frac([msub(mi`EX`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
              frac([msub(mi`IM`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
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
        frac([msub(mi`Y`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
        add3(
          msub(mi`ā`, mi`c`),
          msub(mi`ā`, mi`i`),
          add3(
            msub(mi`ā`, mi`g`),
            msub(mi`ā`, mi`ex`),
            minus(
              msub(mi`ā`, mi`im`),
              mul2(mi`b̄`, minusP(msub(mi`R`, mi`t`), mi`r̄`))
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
        msub(mi`Ỹ`, mi`t`),
        frac(
          [
            minus(msub(mi`Y`, mi`t`), msub(mi`Ȳ`, mi`t`))
          ],
          [msub(mi`Ȳ`, mi`t`)]
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
            frac([msub(mi`Y`, mi`t`)], [msub(mi`Ȳ`, mi`t`)]),
          ),
          mspace(4), mo`-`, mspace(4), mn(1)
        ),
        mrow(
          annotationUnder.attr({ label: mi`ā` })(
            msub(mi`ā`, mi`c`), mspace(4),
            mo`+`, mspace(4), msub(mi`ā`, mi`i`), mspace(4),
            mo`+`, mspace(4), msub(mi`ā`, mi`g`), mspace(4),
            mo`+`, mspace(4), msub(mi`ā`, mi`ex`), mspace(4),
            mo`-`, mspace(4), msub(mi`ā`, mi`im`), mspace(4),
            mo`-`, mspace(4), mn(1),
          ),
          mspace(4), mo`-`, mspace(4),
          mul2(mi`b̄`, minusP(msub(mi`R`, mi`t`), mi`r̄`))
        )
      ),
    ),
    doc.figcaption`Output gap decomposition with parameter grouping`
  ),
};

export const outputGap = doc.figure(
  mathml2.math(
    eq(
      msub(mi`Ỹ`, mi`t`),
      minus(
        mi`ā`,
        mul2(
          mi`b̄`,
          minusP(msub(mi`R`, mi`t`), mi`r̄`)
        )
      )
    ),
  ),
  doc.figcaption`Output gap`
);

export const consumptionShare = doc.figure(
  mathml2.math(
    eq(
      frac([msub(mi`C`, mi`t`)], [msub(mi`Y`, mi`t`)]),
      add(
        msub(mi`ā`, mi`c`),
        mul2(mi`x̄`, msub(mi`Ỹ`, mi`t`))
      )
    ),
  ),
  doc.figcaption`Consumption share`
);

export const ISCurve = doc.figure(
  mathml2.math(
    eq(
      msub(mi`Ỹ`, mi`t`),
      mul2(
        annotationUnder.attr({ label: mtext`multiplier` })(
          frac([mn(1)], [minus(mn(1), mi`x̄`)]),
        ),
        annotationUnder.attr({ label: mtext`original IS curve` })(
          mo`[`,
          minus(
            mi`ā`,
            mul2(mi`b̄`, minusP(msub(mi`R`, mi`t`), mi`r̄`))
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
      msub(mi`I`, mi`t`),
      minus(
        mul2(msub(mi`ā`, mi`i`), msub(mi`Ȳ`, mi`t`)),
        mul3(mi`b̄`, minusP(msub(mi`R`, mi`t`), mi`r̄`), msub(mi`Ȳ`, mi`t`))
      )
    ),
  ),
  doc.figcaption`Investment level: Iₜ = ā_iȲₜ − b̄(Rₜ − r̄)Ȳₜ`
);



