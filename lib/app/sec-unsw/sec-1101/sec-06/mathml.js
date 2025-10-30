import { mathml } from '@app/prelude.js';
import { table } from '@prelude-uni/mathml.js';

const { mi, mo, mtext, mrow, msub, msup } = mathml;

export const definitions = () => mathml.math(
  table.attr({ columnalign: 'right center left' })(
    [msup(mi`P`, mo`*`), mo`=`, mtext`Domestic price`],
    [msub(mi`P`, mi`d`), mo`=`, mtext`Domestic price`],
    [msub(mi`P`, mi`w`), mo`=`, mtext`World price`],
    [
      msub(mi`P`, mrow(mi`w`, mo`+`, mi`t`)),
      mo`=`,
      mtext`World price + Tariff`
    ],
  ),
);

export const importingCondition = () => mathml.math(
  mrow(msub(mi`P`, mi`d`), mo`>`, msub(mi`P`, mi`w`)),
);

export const exportingCondition = () => mathml.math(
  mrow(msub(mi`P`, mi`w`), mo`>`, msub(mi`P`, mi`d`)),
);
