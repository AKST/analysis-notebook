/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { text } from '@prelude-uni/components.js';
import { SPECIAL, annotationUnder, op } from '@prelude-uni/mathml.js';

const { mi, mo, mtext, mrow, mn, msub, mspace, mfrac } = mathml;
const { eq, mul0, mul, add, eqId, minus } = op;
const { rel } = SPECIAL;

export const moneyTransmission = text.figure(
  mathml.math(
    mrow(
      mo`↑`,
      mspace(4), mtext`interest rate`,
      mspace(12), rel.imply, mspace(12),
      mo`↓`, mspace(4), mtext`investment`,
      mspace(12), rel.imply, mspace(12),
      mo`↓`, mspace(4), mtext`output`,
    )
  ),
  doc.figcaption`Monetary transmission: higher interest rate reduces investment and output`
);

export const gdpExpenditure = {
  output: text.figure(
    mathml.math(
      mrow(
        msub(mi`Y`, mi`t`),
        mspace(4), mo`=`, mspace(4),
        add(
          msub(mi`C`, mi`t`),
          msub(mi`I`, mi`t`),
          msub(mi`G`, mi`t`),
          minus(
            msub(mi`EX`, mi`t`),
            msub(mi`IM`, mi`t`)
          ),
        ),
      )
    ),
    doc.figcaption`Output in Expenditure Accounting identities.`
  ),
  consumption: text.figure(
    mathml.math(
      eq(
        msub(mi`C`, mi`t`),
        mul(
          msub(mi`ā`, mi`c`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Consumption`
  ),
  government: text.figure(
    mathml.math(
      eq(
        msub(mi`G`, mi`t`),
        mul(
          msub(mi`ā`, mi`g`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Government`
  ),
  exports: text.figure(
    mathml.math(
      eq(
        msub(mi`EX`, mi`t`),
        mul(
          msub(mi`ā`, mi`ex`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Exports`
  ),
  imports: text.figure(
    mathml.math(
      eq(
        msub(mi`IM`, mi`t`),
        mul(
          msub(mi`ā`, mi`im`),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Imports`
  ),
  investment: text.figure(
    mathml.math(
      eq(
        mfrac(msub(mi`I`, mi`t`), msub(mi`Ȳ`, mi`t`)),
        minus(
          msub(mi`ā`, mi`i`),
          mul(
            mi`b̄`,
            minus.paren(msub(mi`R`, mi`t`), mi`r̄`)
          )
        )
      ),
    ),
    doc.figcaption`Investment`
  ),
};

export const outputDecomposition = {
  a: text.figure(
    mathml.math(
      eq(
        mfrac(msub(mi`Y`, mi`t`), msub(mi`Ȳ`, mi`t`)),
        add(
          mfrac(msub(mi`C`, mi`t`), msub(mi`Ȳ`, mi`t`)),
          mfrac(msub(mi`I`, mi`t`), msub(mi`Ȳ`, mi`t`)),
          mfrac(msub(mi`G`, mi`t`), msub(mi`Ȳ`, mi`t`)),
          minus(
            mfrac(msub(mi`EX`, mi`t`), msub(mi`Ȳ`, mi`t`)),
            mfrac(msub(mi`IM`, mi`t`), msub(mi`Ȳ`, mi`t`)),
          ),
        )
      ),
    ),
    doc.figcaption`Output identity in ratio form`
  ),
  b: text.figure(
    mathml.math(
      eq(
        mfrac(msub(mi`Y`, mi`t`), msub(mi`Ȳ`, mi`t`)),
        add(
          msub(mi`ā`, mi`c`),
          msub(mi`ā`, mi`i`),
          msub(mi`ā`, mi`g`),
          msub(mi`ā`, mi`ex`),
          minus(
            msub(mi`ā`, mi`im`),
            mul0(mi`b̄`, minus.paren(msub(mi`R`, mi`t`), mi`r̄`))
          )
        )
      ),
    ),
    doc.figcaption`Equilibrium output as a function of behavioural parameters`
  ),
  c: text.figure(
    mathml.math(
      eqId(
        msub(mi`Ỹ`, mi`t`),
        mfrac(
          minus(msub(mi`Y`, mi`t`), msub(mi`Ȳ`, mi`t`)),
          msub(mi`Ȳ`, mi`t`)
        )
      ),
    ),
    doc.figcaption`Definition of the output gap`
  ),
  d: text.figure(
    mathml.math(
      eq(
        minus(
          annotationUnder.attr({ label: mi`Ỹₜ` })(
            mfrac(msub(mi`Y`, mi`t`), msub(mi`Ȳ`, mi`t`)),
          ),
          mn(1)
        ),
        mrow(
          annotationUnder.attr({ label: mi`ā` })(
            add(
              msub(mi`ā`, mi`c`),
              msub(mi`ā`, mi`i`),
              msub(mi`ā`, mi`g`),
              minus(
                msub(mi`ā`, mi`ex`),
                msub(mi`ā`, mi`im`),
                mn(1),
              ),
            ),
          ),
          mspace(4), mo`-`, mspace(4),
          mul0(mi`b̄`, minus.paren(msub(mi`R`, mi`t`), mi`r̄`))
        )
      ),
    ),
    doc.figcaption`Output gap decomposition with parameter grouping`
  ),
};

export const outputGap = text.figure(
  mathml.math(
    eq(
      msub(mi`Ỹ`, mi`t`),
      minus(
        mi`ā`,
        mul0(
          mi`b̄`,
          minus.paren(msub(mi`R`, mi`t`), mi`r̄`)
        )
      )
    ),
  ),
  doc.figcaption`Output gap`
);

export const consumptionShare = text.figure(
  mathml.math(
    eq(
      mfrac(msub(mi`C`, mi`t`), msub(mi`Y`, mi`t`)),
      add(
        msub(mi`ā`, mi`c`),
        mul0(mi`x̄`, msub(mi`Ỹ`, mi`t`))
      )
    ),
  ),
  doc.figcaption`Consumption share`
);

export const ISCurve = text.figure(
  mathml.math(
    eq(
      msub(mi`Ỹ`, mi`t`),
      mul0(
        annotationUnder.attr({ label: mtext`multiplier` })(
          mfrac(mn(1), minus(mn(1), mi`x̄`)),
        ),
        annotationUnder.attr({ label: mtext`original IS curve` })(
          minus.square(
            mi`ā`,
            mul0(mi`b̄`, minus.paren(msub(mi`R`, mi`t`), mi`r̄`))
          ),
        )
      )
    ),
  ),
  doc.figcaption`IS curve with consumption response`
);

export const investmentLevel = text.figure(
  mathml.math(
    eq(
      msub(mi`I`, mi`t`),
      minus(
        mul0(msub(mi`ā`, mi`i`), msub(mi`Ȳ`, mi`t`)),
        mul0(
          mi`b̄`,
          minus.paren(msub(mi`R`, mi`t`), mi`r̄`),
          msub(mi`Ȳ`, mi`t`),
        )
      )
    ),
  ),
  doc.figcaption`Investment level: Iₜ = ā_iȲₜ − b̄(Rₜ − r̄)Ȳₜ`
);



