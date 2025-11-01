/**
 * @import { KnobConfigVariant } from '@base/runtime/config/type.ts'
 * @import { KnobElement } from './type.ts'
 */
import { Unreachable } from '@base/util/type.js';
import { ConfigKnobLabel } from './common/label.js';
import { BooleanKnob } from './knobs/boolean.js';
import { ColorKnob } from './knobs/color.js';
import { ComplexKnob } from './knobs/complex.js';
import { CurveKnob } from './knobs/curve.js';
import { GroupKnob } from './knobs/group.js';
import { ManyKnob } from './knobs/many.js';
import { NumberKnob } from './knobs/number.js';
import { OptionalKnob } from './knobs/optional.js';
import { SequenceKnob } from './knobs/sequence.js';
import { VariantKnob } from './knobs/variant.js';
import { evaluateKnob } from './knobs/types.js';

/**
 * @param {KnobConfigVariant} cfg
 * @param {string | undefined} key
 * @param {boolean} [topLevel=false]
 * @returns {KnobElement}
 */
export function createKnob(cfg, key, topLevel = false) {
  const lSize = topLevel && cfg.kind === 'group' ? 'large' : 'normal';
  const value = cfg.of ?? evaluateKnob(cfg);
  const label = 'label' in cfg ? cfg.label : key;
  const labelElement = label ? new ConfigKnobLabel(label, lSize) : undefined;

  switch (cfg.kind) {
    case 'optional':
      return new OptionalKnob(cfg, value);

    case 'group':
      return new GroupKnob(cfg, labelElement, value);

    case 'complex':
      return new ComplexKnob(cfg, labelElement, value);

    case 'curve':
      return new CurveKnob(cfg, labelElement, value);

    case 'number':
      return new NumberKnob(cfg, labelElement, value);

    case 'boolean':
      return new BooleanKnob(cfg, labelElement, value);

    case 'sequence':
      return new SequenceKnob(cfg, labelElement, value);

    case 'color':
      return new ColorKnob(cfg, labelElement, value);

    case 'many':
      return new ManyKnob(cfg, labelElement, value);

    case 'variant':
      return VariantKnob.create(cfg, labelElement, value);

    default:
      console.error(cfg);
      throw new Unreachable(cfg);
  }
}

