
export type FindDomElementHTML<T> =
  T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] :
  T extends 'font' ? HTMLElement :
  never;

export type FindDomElementSVG<T> =
  T extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[T] : never;

export type FindDomElement<N, T> =
  N extends 'html' ? FindDomElementHTML<T> :
  N extends 'svg'  ? FindDomElementSVG<T> :
  N extends 'mathml' ? MathMLElement :
  never;

export type WritableElementKeys =
  | "className"
  | "classList"
  | "id"
  | "role"
  | "slot";

export type WritableHTMLElementKeys =
  | "accessKey"
  | "autocapitalize"
  | "autofocus"
  | "autocorrect"
  | "contentEditable"
  | "dir"
  | "draggable"
  | "enterKeyHint"
  | "hidden"
  | "inert"
  | "inputMode"
  | "lang"
  | "nonce"
  | "popover"
  | "spellcheck"
  | "style"
  | "tabIndex"
  | "title"
  | "translate"
  | "writingSuggestions";

export type WritableMathMLElementKeys =
  | "autofocus"
  | "style"
  | "tabIndex"

export type WritableSVGElementKeys =
  | "autofocus"
  | "className"
  | "nonce"
  | "style"
  | "tabIndex"

export type ElementAttributesWriteOnly<NS, T> =
  ElementAttributesWriteOnly_Impl<NS, T, FindDomElement<NS, T>>;

type ReadonlyKeys<T> = {
  [P in keyof T]:
      (<G>() => G extends ({ [K in P]: T[P] }) ? 1 : 2) extends
      (<G>() => G extends ({ -readonly [K in P]: T[P] }) ? 1 : 2)
      ? never : P;
}[keyof T];

type ElementAttributesWriteOnly_Impl<NS, T, E> =
  NS extends 'html' ? ElementAttributesWriteOnly_Impl_HTML<NS, T, E, ReadonlyKeys<E>> :
  NS extends 'mathml' ? ElementAttributesWriteOnly_Impl_MathML<NS, T, E, ReadonlyKeys<E>> :
  NS extends 'svg' ? ElementAttributesWriteOnly_Impl_SVG<NS, T, E, ReadonlyKeys<E>> :
  never;


type ElementAttributesWriteOnly_Impl_HTML<NS, T, E, ReadonlyKeys> = {
  -readonly [P in keyof E as (
      P extends ReadonlyExceptions<E> ? P :
      P extends ReadonlyKeys ? never :
      NonNullable<E[P]> extends Function ? never :
      P extends WritableElementKeys ? P :
      P extends WritableHTMLElementKeys ? P :
      P extends keyof Node ? never :
      P extends keyof Element ? never :
      P extends keyof HTMLElement ? never :
      P
  )]: UserLandPropType<E, P, E[P]>
} & UnspecifiedAttribute<NS, T>;

type ElementAttributesWriteOnly_Impl_MathML<NS, T, E, ReadonlyKeys> = {
  -readonly [P in keyof E as (
      P extends ReadonlyExceptions<E> ? P :
      P extends ReadonlyKeys ? never :
      NonNullable<E[P]> extends Function ? never :
      P extends WritableElementKeys ? P :
      P extends WritableMathMLElementKeys ? P :
      P extends keyof Node ? never :
      P extends keyof Element ? never :
      P extends keyof MathMLElement ? never :
      P
  )]: UserLandPropType<E, P, E[P]>
} & UnspecifiedAttribute<NS, T>;

type ElementAttributesWriteOnly_Impl_SVG<NS, T, E, ReadonlyKeys> = {
  -readonly [P in keyof E as (
      P extends ReadonlyExceptions<E> ? P :
      P extends ReadonlyKeys ? never :
      NonNullable<E[P]> extends Function ? never :
      P extends WritableElementKeys ? P :
      P extends WritableSVGElementKeys ? P :
      P extends keyof Node ? never :
      P extends keyof Element ? never :
      P extends keyof SVGElement ? never :
      P
  )]: UserLandPropType<E, P, E[P]>
} & UnspecifiedAttribute<NS, T>;

/**
 * Update as needed.
 *
 * Traggically it doesn't seem like there is a reliable shorthand to
 * generate attributes settable by `setAttribute` that also readonly
 * at the element property level.
 */
type ReadonlyExceptions<E> =
  // https://developer.mozilla.org/en-US/docs/Web/API/SVGRectElement
  E extends SVGRectElement ? ('x' | 'y' | 'width' | 'height' | 'rx' | 'ry') :
  E extends SVGTextElement ? ('x' | 'y') :

  // https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement
  //   - viewBox: https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement/viewBox
  E extends SVGElement ? ('width' | 'height' | 'viewBox') :

  never;

type UserLandRect = [x: number, y: number, width: number, height: number];

/**
 * Update as needed.
 *
 * This replaces the API used in the DOM API with one used to
 * express the type in attribute in userland
 */
type UserLandPropType<E, P extends keyof E, Otherwise> =
  E[P] extends DOMTokenList ? string[] :
  E[P] extends CSSStyleDeclaration ? string :
  [E, P] extends [HTMLInputElement, 'value' | 'max' | 'min' | 'step'] ? (number | string) :
  [E, P] extends [HTMLInputElement, 'disabled'] ? ('disabled' | ''  | boolean | undefined | null) :
  P extends ReadonlyExceptions<E> ? (
    /**
      * - This includes `y` on `text`, https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/y#text
      */
    E[P] extends SVGAnimatedLengthList ? (number | string | (number | string)[]) :
    E[P] extends SVGAnimatedLength ? (number | string) :
    E[P] extends SVGAnimatedRect ? string | UserLandRect :
    Otherwise
  ) :
  Otherwise;

/**
 * There are attributes that just aren't provided by typescript
 * mostly in relation to MathML.
 */
type UnspecifiedAttribute<NS, T> =
  [NS, T] extends ['html', 'font'] ? { face?: string, color?: string, size?: string } :
  NS extends 'mathml' ? (
    T extends 'math' ? { display?: 'block' } :
    T extends 'mspace' ? { width?: number | string, height?: number | string } :
    T extends 'mtr' ? { columnalign?: string } :
    T extends 'mtd' ? {
      // TODO use 'left' | 'right' | 'center'
      columnalign?: string,
      columnspan?: number } :
    T extends 'mtable' ? { columnalign?: string } :
    {}
  ) :
  /**
   * - [fill](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill)
   *   - Is allowed as an attribute but isn't a property
   */
  NS extends 'svg' ? (
    T extends 'rect' ? { fill?: string, stroke?: string } :
    T extends 'text' ? { fill?: string } :
    {}
  ) :
  {};
