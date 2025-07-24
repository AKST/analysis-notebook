export type EventSpec = { [eventType: string]: any };

export interface ElFragment {
  children: El[];
}

export type ElAttributes = {
  ns?: string;
  className?: string;
  classList?: string[];
  class?: never;
  style?: string;
  events?: EventSpec;

  title?: string;
  alt?: string;
  src?: string;
  href?: string;
  display?: string;
  width?: string;
  colSpan?: string;
  rowSpan?: string;
  height?: string,
  color?: string;
};

export type El =
  | HTMLElement
  | ElFragment
  | ElSingle
  | ElNode

export type ElSingle =
  | undefined
  | null
  | false
  | string
  | number

export type ElNode =
  | [tagName: string]
  | [tagName: string, attributes: ElAttributes]

  | [tagName: string,
     attributes: ElAttributes | null,
     children: ElSingle | El[]]

  | [tagName: string,
     children: ElSingle | El[]]

export namespace E {
  export type Item = El;
  export type Node = ElNode;
  export type Frag = ElFragment;
  export type Atom = ElSingle;
  export type Attrs = ElAttributes;
}
