/**
 * @import { E } from '@app/prelude-type.ts';
 */

import { mathml, doc } from '@app/prelude.js';
import { sum, parensA, abs, neg, table, rows, call, op } from '@prelude-uni/mathml.js';

const { aprox, minus, mul0, eq, add, comma } = op;
const {
  msqrt, mtr, mtd, mspace, math, mi, mo, mtext,
  mrow, mn, msup, msub, msubsup, mover,
  mfrac, munderover, mtable, munder,
} = mathml;

const Log = call({ fn: mtext`Log` });
const Expect = call({ fn: mi`𝔼` });
const Variance = call({ fn: mi`𝕍` });
const Corr_ = call({ fn: mi`Corr` });

/** @param {E.Item} a @param {E.Item} b */
const Corr = (a, b) => msub(mi`𝜌`, op.comma(a, b));

const subscript = {
  /**
   * @param {'t' |  E.Item} t
   */
  tInner: t => typeof t === 'string' ? mi.of(t) : t,
  /**
   * @param {number | string} index
   */
  idx: index => typeof index === 'number' ? mn(index) : mi.of(index),

  /**
   * @param {number | string | undefined} index
   * @param {'t' |  E.Item} t
   */
  t: (index, t) => index != null
    ? comma.sub(subscript.tInner(t), subscript.idx(index))
    : subscript.tInner(t),
};

const $ = {
  /**
   * @param {string} label
   * @param {number | string | undefined} index
   */
  var: (label, index) => (
    index != null
      ? msub(mi.of(label), subscript.idx(index))
      : mi.of(label)
  ),
  /**
   * @param {string} label
   * @param {number | string | undefined} [index]
   * @param {'t' |  E.Item} [t]
   */
  varT: (label, index = undefined, t = 't') => (
     msub(mi.of(label), subscript.t(index, t))
  ),
  /**
   * @param {string} label
   * @param {number | string | undefined} index
   * @param {number} lag
   */
  varLag: (label, index, lag) => (
     $.varT(label, index, minus.sub(mi`t`, mn(lag)))
  ),
  /**
   * @param {number | string | undefined} index
   * @param {string} [label]
   */
  coeff: (index, label = '𝛽') => $.var(label, index),
};

export const staticModels = {
  example: doc.figure(
    math(
      eq($.varT('y'), add(
        $.coeff(0),
        mul0($.coeff(1), $.varT('x', 1)),
        mo`⋯`,
        mul0($.coeff('k'), $.varT('x', 'k')),
        $.varT('u'),
      )),
    ),
    doc.figcaption`Example of a static model`,
  ),
};

export const lagModels = {
  example: doc.figure(
    math(
      eq($.varT('y'), add(
        $.coeff(0, '𝛼'),
        mul0($.coeff(0, '𝛿'), $.varT('x', 1)),
        mul0($.coeff(1, '𝛿'), $.varLag('x', 1, 1)),
        mul0($.coeff(2, '𝛿'), $.varLag('x', 1, 2)),
        $.varT('u'),
      )),
    ),
    doc.figcaption`Example of a static model`,
  ),
};

export const assumption = {
  ts1: doc.figure(
    math({ style: '--fontsize-math-m: 14px' })(
      table({ columnalign: 'right center left' })(
        [
          mrow(
            mo`{`,
            op.comma.paren(
              $.varT('x', 1),
              $.varT('x', 2),
              mo`⋯`,
              $.varT('x', 'k'),
              $.varT('y'),
            ),
            mo`:`,
            mspace(8),
            mi`t`
          ),
          mo`=`,
          mrow(
            op.comma(mn(1), mn(2), mo`⋯`, mi`n`),
            mo`}`,
          ),
        ],
        [
          $.varT('y'),
          mo`=`,
          add(
            $.coeff(0, '𝛽'),
            mul0($.coeff(1, '𝛽'), $.varT('x', 1)),
            mul0($.coeff(2, '𝛽'), $.varT('x', 2)),
            mo`⋯`,
            mul0($.coeff('k', '𝛽'), $.varT('x', 'k')),
            $.varT('u'),
          ),
        ],
      ),
    ),
    doc.figcaption`TS1: Linear in parameters`,
  ),
  ts3: {
    contemporaneouslyExogenous: doc.figure(
      math(
        eq(
          Expect(
            op.cond(
              $.varT('u'),
              comma($.varT('x', 1), mo`…`, $.varT('x', 'k'))
            )
          ),
          Expect(op.cond(msub(mi`u`, mi`t`), msub(mi`x`, mi`t`))),
          mn(0)
        )
      ),
      doc.figcaption`Contemporaneously exogenous`,
    ),
    strictlyExogenous: doc.figure(
      math(
        table({ columnalign: 'right right center left' })(
          [mtext`Let`, ...eq.array(
            Expect(op.cond($.varT('u'), mi`X`)),
            mn(0)
          )],
          [mtext`Where`, ...op.member.array(
            mi`t`,
            comma.brace(mn(1), mn(2), mo`…`, mi`n`)
          )]
        )
      ),
      doc.figcaption`TS.3: Strictly exogenous`,
    ),
  },
  ts4: {
    def: doc.figure(
      math(
        table({ columnalign: 'right right center left' })(
          [mtext`Let`, ...eq.array(
            Variance(op.cond($.varT('u'), mi`X`)),
            eq(Variance($.varT('u')), msup(mi`σ`, mn(2))),
          )],
          [mtext`Where`, ...op.member.array(
            mi`t`,
            comma.brace(mn(1), mn(2), mo`…`, mi`n`)
          )]
        )
      ),
      doc.figcaption`TS.4: Homoskedasticity`,
    ),
  },
  ts5: {
    def: doc.figure(
      math(
        table({ columnalign: 'right right left' })(
          [
            mtext`Let`,
            Corr_($.varT('u'), op.cond($.varT('u', undefined, 's'), mi`X`)),
            mrow(mo`=`, mspace(4), mn(0)),
          ],
          [
            mtext`Where`,
            mrow(mo`∀`, mi`t`, mo`.`, mspace(8), mi`t`),
            mrow(mo`≠`, mi`s`),
          ]
        )
      ),
      doc.figcaption`TS.4: Homoskedasticity`,
    ),
  },
  theorum: {
    samplingVariance: doc.figure(
      math(
        table({ columnalign: 'right right center left' })(
          [mtext`Let`, ...eq.array(
            Variance(op.cond($.coeff('j', '𝛽̂'), mi`X`)),
            mfrac(
              msup(mi`σ`, mn(2)),
              mul0.square(
                $.var('SST', 'j'),
                minus.paren(mn(1), msubsup(mi`R`, mi`j`, mn(2)))
              )
            )
          )],
          [mtext`Where`, ...op.member.array(
            mi`j`,
            comma.brace(mn(1), mo`…`, mi`k`)
          )]
        )
      ),
      doc.figcaption`OLS Sampling Variance`,
    ),
  },
};

export const growthRate = doc.figure(
  math(
    aprox(
      mrow(mi`𝛥`, $.varT('y')),
      mfrac(
        minus($.varT('y'), $.varLag('y', undefined, 1)),
        $.varLag('y', undefined, 1),
      ),
    ),
  ),
  doc.figcaption`Growth Rate`,
);
