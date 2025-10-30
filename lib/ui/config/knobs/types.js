/**
 * @import { KnobConfig, KnobConfigVariant } from '@base/runtime/config/type.ts';
 */
import { Unreachable } from '@base/util/type.js';
import { mapEntries } from '@base/util/object.js';

class NoDefaultValue extends Error {
  /** @param {KnobConfigVariant} knob */
  constructor(knob) {
    super('No default value specified for knob');
    this.knob = knob
  }
}

/**
 * @template {KnobConfigVariant} V
 * @param {V} knob - The knob configuration
 * @param {string | undefined} label
 * @returns {V} The evaluated value
 */
export function setCfgLabel(knob, label) {
  return { ...knob, label };
}


/**
 * @param {KnobConfigVariant} knob - The knob configuration
 * @returns {any} The evaluated value
 */
export function evaluateKnob(knob) {
  if (knob.of != null) return knob.of;

  switch (knob.kind) {
    case 'number':
    case 'color':
    case 'boolean':
    case 'complex':
    case 'sequence':
    case 'curve':
    case 'many':
      throw new NoDefaultValue(knob);

    case 'variant': {
      const first = Object.keys(knob.variants)[0]
      return mapEntries(knob.variants, evaluateKnob)[first]
    }

    case 'optional':
      return knob.enabled ? evaluateKnob(knob.some) : undefined;

    case 'group':
      return mapEntries(knob.group, evaluateKnob);

    default:
      console.error(knob);
      throw new Unreachable(knob);
  }
}

/**
 * Evaluates an entire config object to resolved values
 * @param {KnobConfig} config - Configuration object
 * @returns {Record<string, any>} Evaluated configuration
 */
export function evaluateConfig(config) {
  const result = {};
  let key, knob;
  try {
    for ([key, knob] of Object.entries(config)) {
      // @ts-ignore - its okay
      result[key] = evaluateKnob(knob);
    }
  } catch (e) {
    if (e instanceof NoDefaultValue) {
      console.error(key, knob, config);
      console.error(e.knob);
    }
    throw e;
  }
  return result;
}
