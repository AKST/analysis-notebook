export type EventSpec = { [eventType: string]: any };

export interface ElFragment {
  children: readonly El[];
}

export type ElAttributes<O> = {
  readonly events?: EventSpec;
  readonly dataset?: E.Dataset;
  readonly styles?: E.Styles;
  readonly element: O,

  // TODO add these to a helper module instead of members, keep this as pure data
  elem<K extends keyof O>(key: K, value: O[K]): ElAttributes<O>;
  style(styles: E.Styles): ElAttributes<O>;
  data(key: string, val: string): ElAttributes<O>;
};

export type El =
  | Node
  | HTMLElement
  | SVGElement
  | MathMLElement
  | ElFragment
  | ElSingle
  | ElNode<unknown, unknown, unknown>
  | ElInsert<unknown>;

export type ElSingle =
  | string | number
  | undefined | null | false;

export type ElNode<NS, Tag, O> = {
  kind: 'node',
  ns: NS,
  tagName: Tag,
  attributes?: ElAttributes<O>,
  children?: readonly El[],
}

/**
 * This is for already initialised elements, in which
 * you wish to put in your render tree.
 */
export type ElInsert<Elem> = {
  kind: 'insert',
  elem: Elem,
  // todo refine this type.
  attributes?: ElAttributes<Partial<Elem>>,
  children?: readonly El[],
};

export namespace E {
  export type Item = El;
  export type Node<NS, Tag, O> = ElNode<NS, Tag, O>;
  export type Insert<Elem> = ElInsert<Elem>;
  export type Frag = ElFragment;
  export type Atom = ElSingle;
  export type Attrs<O> = ElAttributes<O>;
  export type Events = EventSpec
  export type Styles = Partial<CSSStyleDeclaration>;
  export type Dataset = Record<string, string>;
}
