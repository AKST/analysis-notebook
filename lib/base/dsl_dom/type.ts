export type EventSpec = { [eventType: string]: any };

export interface ElFragment {
  children: readonly El[];
}

export type ElMeta<O> = {
  readonly events?: EventSpec;
  readonly dataset?: E.Dataset;
  readonly styles?: E.Styles;
  readonly attributes: O;
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
  meta?: ElMeta<O>,
  children?: readonly El[],
}

/**
 * This is for already initialised elements, in which
 * you wish to put in your render tree.
 */
export type ElInsert<Elem> = {
  kind: 'insert',
  elem: Elem,

  /**
   * TODO refine the behaviour of this type, as there are a
   * few open questions. Like what is the expected behaviour
   * should it override all attributes? probably not. Can that
   * be clearer? or should this be expressed in a way that is
   * more apparent?
   */
  meta?: ElMeta<Partial<Elem>>,
  children?: readonly El[],
};

export namespace E {
  export type Item = El;
  export type Node<NS, Tag, O> = ElNode<NS, Tag, O>;
  export type Insert<Elem> = ElInsert<Elem>;
  export type Frag = ElFragment;
  export type Atom = ElSingle;
  export type Meta<O> = ElMeta<O>;
  export type Events = EventSpec
  export type Styles = Partial<CSSStyleDeclaration>;
  export type Dataset = Record<string, string>;
}
