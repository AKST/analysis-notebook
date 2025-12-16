export type ComponentType<T, Props = undefined, Args = []> =
  T extends HTMLElement ? Args extends unknown[] ? Internal_ComponentTypeImpl<T, Props, Args> : never : never;

type Internal_ComponentTypeImpl<T extends HTMLElement, Props, Args extends unknown[]> =
    Props extends Object ? (new (props: Props, ...args: Args) => T) :
    Props extends undefined ? (new (...args: Args) => T) :
    never
