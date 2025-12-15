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
  size?: string;

  alt?: string;
  align?: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
  colSpan?: number | string;
  columnspan?: number | string;
  display?: string;
  fontsize?: string;
  height?: string | number;
  href?: string;
  name?: string;
  open?: true | false;
  rel?: string;
  rowSpan?: number | string;
  src?: string;
  target?: string;
  type?: string;
  title?: string;
  value?: string;
  width?: string | number;

  fill?: string;
  ['font-size']?: number;
  stroke?: string;
  ['stroke-width']?: string | number;
  ['text-anchor']?: string;
  viewBox?: string;
  x?: string | number,
  y?: string | number,
  columnalign?: string,
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
