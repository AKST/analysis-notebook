import * as Dom from '../platform/dom/type.ts';

export type EventSpec = { [eventType: string]: any };

export interface ElFragment {
  children: readonly El[];
}

export type ElAttributes<O> = {
  readonly events?: EventSpec;
  readonly dataset?: E.Dataset;
  readonly styles?: E.Styles;
  readonly element: O,

  /**
   * Adds an element level attribute to the attributes.
   */
  elem<K extends keyof O>(key: K, value: O[K]): ElAttributes<O>;
  style(styles: E.Styles): ElAttributes<O>;
};

export type El =
  | HTMLElement
  | SVGElement
  | MathMLElement
  | ElFragment
  | ElSingle
  | ElNode<unknown, unknown, unknown>;

export type ElSingle =
  | string | number
  | undefined | null | false;

export type ElNode<NS, Tag, O> = {
  ns: NS,
  tagName: Tag,
  attributes?: ElAttributes<O>,
  children?: readonly El[],
}

export namespace E {
  export type Item = El;
  export type Node<NS, Tag, O> = ElNode<NS, Tag, O>;
  export type Frag = ElFragment;
  export type Atom = ElSingle;
  export type Attrs<O> = ElAttributes<O>;
  export type Events = EventSpec
  export type Styles = Partial<CSSStyleDeclaration>;
  export type Dataset = Record<string, string>;
}
