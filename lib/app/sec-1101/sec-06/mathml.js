import { mathml2 } from '../../prelude.js';
import { mathmlHelper2 } from '../prelude.js';

const { mi, mo, mtext, mrow, msub, msup } = mathml2;
const { table } = mathmlHelper2;

export const definitions = () => mathml2.math(
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

export const importingCondition = () => mathml2.math(
  mrow(msub(mi`P`, mi`d`), mo`>`, msub(mi`P`, mi`w`)),
);

export const exportingCondition = () => mathml2.math(
  mrow(msub(mi`P`, mi`w`), mo`>`, msub(mi`P`, mi`d`)),
);
