import { mathml } from '../../prelude.js';

const {
  i, o, n, text, row, frac,
  sup, sub, space, rows,
  under, table,
} = mathml;

export function relativeValue() {
  const muai = sub(i('MU'), row([i('A'), space(2), i('i')]));
  const mubj = sub(i('MU'), row([i('B'), space(2), i('j')]));
  const pb = sub(text('p'), i('B'));
  const ipb = sup(pb, row([o('-'), n(1)]));

  return mathml([
    rows([
      row([
        sub(text('Reserve Price'), i('A')),
        space(4), o('='), space(4),
        frac([muai], [mubj, o('×'), ipb]),
      ]),
      row([]),
      row([muai, o('='), text('Marginal Utility of A, at position i')]),
      row([mubj, o('='), text('Marginal Utility of B, at position j')]),
      row([pb, o('='), text('Price of B')]),
    ]),
  ]);
}

export function reservationPrice() {
  return mathml([
    rows([
      row([
        text('Reserve Price'),
        space(4), o('='), space(4),
        frac([sub(i('MU'), i('i'))], [i('λ')]),
      ]),
      row([i('λ'), o('='), text('Marginal Utility of Income')]),
    ]),
  ]);
}

export function reservationPriceCourse() {
  const indexA = row([
    space(4), i('A'),
    space(4), i('i'),
  ]);

  return mathml([
    row([
      under(
        sub(text('Reserve Price'), indexA),
        row([i('i'), o('>'), n(0)]),
      ),
      space(4), o('='), space(4),
      frac([
        sub(i('MU'), indexA)
      ], [
        sup(i('p'), row([o('-'), n(1)])),
        space(4),
        sub(i('MU'), row([i('B'), space(2), n(1)])),
      ]),
    ]),
  ]);
}

export function elasticity() {
  return mathml([
    table([
      [i('ε'), o('='), row([
        frac([i('P')], [i('Q')]), o('×'),
        frac([i('ΔQ')], [i('ΔP')])
      ])],
    ]),
  ]);
}
