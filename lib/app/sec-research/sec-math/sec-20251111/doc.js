/**
 * @import { E, Widget } from '@app/prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import { readmore, dashbox, todo, infobox, defineTerm, text } from '@prelude-uni/components.js';
import { container, twoThree, twoColumns } from '@prelude-uni/layout.js';
import { createDoc } from '@prelude-uni/util.js';
import { doc } from '@app/prelude.js';
import * as mathml from './mathml.js';

const LINKS = {
  yt: {
    groupA: text.a({ href: 'https://youtu.be/QudbrUcVPxk' }),
    groupB: text.a({ href: 'https://youtu.be/yHq_yzYZV6U' }),
    groupC: text.a({ href: 'https://youtu.be/g7L_r6zw4-c' }),
    ring: text.a({ href: 'https://youtu.be/_RTHvweHlhE' }),
    fieldA: text.a({ href: 'https://youtu.be/bjp4nF8TW7s' }),
    fieldB: text.a({ href: 'https://youtu.be/KCSZ4QhOw0I' }),
    vectorSpace: text.a({ href: 'https://youtu.be/ozwodzD5bJM' }),
    modules: text.a({ href: 'https://youtu.be/IvukAijXgLE' }),
    iIsASetOfPolyNomials: text.a({ href: 'https://youtu.be/t5iYCJOXD0A' }),
  },
};

export const intro = createDoc(() => container(
  doc.h1`Abstract Algebra`,
  dashbox(
    twoThree(
      container(
        doc.p`
          I am documenting what I learnt when looking into what it would
          take to encorporate arbitrary polynomials into Ordinary Least
          Squares. It started with the question ${doc.b`Can I use complex
          numbers in OLS?`} As this would have a nice property of producing
          multiple values from a regression. I learn the answer is yes, but
          ${doc.b`I also learnt complex numbers are polynomials`}. The
          polynomial part was ultimately what I was more interested in, as
          complex numbers prescribe a specific relation when it comes to
          multiplication. So then I wondered ${doc.b`Can we use arbirarary
          polynomials in the place of complex numbers`}? As of writing this
          I don't have an answer, I have a feeling is probalby yes but it is
          mostly a guess. But in the process of exploring the answer I
          stumbled upon the topic of Abstract Algebra.
        `,
      ),
      container(
        infobox({ title: 'sources' }).of(
          text.ul(
            doc.li`Groups:${text.ul(
              doc.li.of(LINKS.yt.groupA.t`Part 1`),
              doc.li.of(LINKS.yt.groupB.t`Part 2`),
              doc.li.of(LINKS.yt.groupC.t`Part 3`),
            )}`,
            doc.li.of('Rings: ', LINKS.yt.ring.t`watch`),
            doc.li`Fields:${text.ul(
              doc.li.of(LINKS.yt.fieldA.t`Part 1`),
              doc.li.of(LINKS.yt.fieldA.t`Part 2`),
            )}`,
            doc.li.of('Vector Spaces: ', LINKS.yt.vectorSpace.t`watch`),
            doc.li.of('Modules: ', LINKS.yt.modules.t`watch`),
          ),
        ),
        doc.dl(
        ),
      ),
    ),
  ),
));

export const generalisedComplexNumbers = createDoc(() => container(
  doc.h2`Generalised Complex Numbers`,
  dashbox(
    twoThree(
      container(
        doc.p`
          I saw ${LINKS.yt.iIsASetOfPolyNomials.t`this video`} it lead to me
          looking further into abstract algebra as it demostrates that
          complex numbers are just polynomials.
        `,
        mathml.generalisedComplex.def,
      ),
      container(
        doc.dl(
          doc.dt`Modulus syntax`,
          doc.dd`
            This is how we express polynomials with
            real coeffients (with the determinants
            of ${doc.b`i`}).
            ${doc.br()}
            ${doc.br()}
            ${mathml.generalisedComplex.mod}
          `,
        ),
      ),
    ),
  ),
));

export const groups = createDoc(() => container(
  doc.h2`Groups`,
  dashbox(
    todo({}, ''),
  ),
));

export const rings = createDoc(() => container(
  doc.h2`Rings`,
  dashbox(
    todo({}, ''),
  ),
));

export const fields = createDoc(() => container(
  doc.h2`Fields`,
  dashbox(
    todo({}, ''),
  ),
));

export const vectorSpace = createDoc(() => container(
  doc.h2`Vector Space`,
  dashbox(
    todo({}, ''),
  ),
));

export const modules = createDoc(() => container(
  doc.h2`Modules`,
  dashbox(
    todo({}, ''),
  ),
));
