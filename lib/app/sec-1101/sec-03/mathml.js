import { mathml, mathml2 } from '../../prelude.js';

const {
  n, text, row, frac,
  sup, sub, space, rows,
  under, table,
} = mathml;

const { mi, mo } = mathml2;

export function relativeValue() {
  const muai = sub(mi`MU`, row([mi`A`, space(2), mi`i`]));
  const mubj = sub(mi`MU`, row([mi`B`, space(2), mi`j`]));
  const pb = sub(text('p'), mi`B`);
  const ipb = sup(pb, row([mo`-`, n(1)]));

  return mathml([
    rows([
      row([
        sub(text('Reserve Price'), mi`A`),
        space(4), mo`=`, space(4),
        frac([muai], [mubj, mo`×`, ipb]),
      ]),
      row([]),
      row([muai, mo`=`, text('Marginal Utility of A, at position i')]),
      row([mubj, mo`=`, text('Marginal Utility of B, at position j')]),
      row([pb, mo`=`, text('Price of B')]),
    ]),
  ]);
}

export function reservationPrice() {
  return mathml([
    rows([
      row([
        text('Reserve Price'),
        space(4), mo`=`, space(4),
        frac([sub(mi`MU`, mi`i`)], [mi`λ`]),
      ]),
      row([mi`λ`, mo`=`, text('Marginal Utility of Income')]),
    ]),
  ]);
}

export function reservationPriceCourse() {
  const indexA = row([
    space(4), mi`A`,
    space(4), mi`i`,
  ]);

  return mathml([
    row([
      under(
        sub(text('Reserve Price'), indexA),
        row([mi`i`, mo`>`, n(0)]),
      ),
      space(4), mo`=`, space(4),
      frac([
        sub(mi`MU`, indexA)
      ], [
        sup(mi`p`, row([mo`-`, n(1)])),
        space(4),
        sub(mi`MU`, row([mi`B`, space(2), n(1)])),
      ]),
    ]),
  ]);
}

export function elasticity() {
  return mathml([
    table([
      [mi`ε`, mo`=`, row([
        frac([mi`P`], [mi`Q`]), mo`×`,
        frac([mi`ΔQ`], [mi`ΔP`])
      ])],
    ]),
  ]);
}
