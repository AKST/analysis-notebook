
export type ElNode<TagName extends string> =
  | [tagName: TagName,
     attrs: ElAttrs | null | undefined,
     children: El[] | undefined]

  | [tagName: TagName,
     attrs: ElAttrs | null | undefined];

export type ElDispatch<T> =
  | [el: T,
     attrs: ElAttrs | null | undefined,
     children: El[] | undefined]

  | [el: T,
     attrs: ElAttrs | null | undefined];

export type El =
  | Node
  | ElDispatch<HTMLElement>
  | ElTopLevel
  | ElNode<string>;

export type ElTopLevel =
  | string
  | false
  | undefined
  | null

export type ElAttrs = {
  events?: never
  styles?: Record<string, string>,
  dataset?: Record<string, string>,
  [otherAttr: string]: any,
}

export type ComponentType<T, Props = undefined, Args = []> =
  T extends HTMLElement
    ? Args extends unknown[]
      ? Props extends Object
        ? (new (props: Props, ...args: Args) => T)
        : Props extends undefined
          ? (new (...args: Args) => T)
          : never
        : never
      : never;
