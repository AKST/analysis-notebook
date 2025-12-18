export {
  clearCanvas,
  renderPlaceholder,
  Grid,
  PointRenderer,
  LineRenderer,
  PolygonRenderer,
  TextRenderer,
  VectorRenderer,
} from '../base/canvas_2d/index.js';
export { COLOR, colorHex } from '../base/util/color/index.js';
export * as objects from '../base/util/object.js';
export {
  complex as c,
  vector as v,
  vector,
} from '../base/math/value.js';
export * as math from '../base/math/value.js';
export { v2, convexHull, shoelaceArea } from '../base/geom_2d/index.js';

// legacy
// export { mathml, frag, html as doc } from '../base/dom_app/index.js';
// export * as svg from '../base/dom_app/helper/svg.js';

// future
export { frag } from '../base/dsl_dom/render.js';
export * as doc from '../base/dsl_dom/helper/html.js';
export * as svg from '../base/dsl_dom/helper/svg.js';
export * as mathml from '../base/dsl_dom/helper/mathml.js';

// transition
export { frag as frag2 } from '../base/dsl_dom/render.js';
export * as doc2 from '../base/dsl_dom/helper/html.js';
export * as svg2 from '../base/dsl_dom/helper/svg.js';
export * as mathml2 from '../base/dsl_dom/helper/mathml.js';

export * as arrays from '../base/util/array.js';
export { enumerate }  from '../base/util/enumerate.js';
export * as numbers from '../base/util/number.js';
export * as strings from '../base/util/strings.js';
export { Unreachable, isNotNull } from '../base/util/type.js';
