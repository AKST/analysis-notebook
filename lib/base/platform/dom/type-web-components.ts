/**
 * This type exists to abstract referencing constructors without
 * over exposing implementation details and risk coupling to those
 * impl details, as well as allowing providing wrapped instances
 * which largely exist to handle dependency mapping.
 */
export type ComponentType<T, Props = undefined, Args = []> =
  T extends HTMLElement ? Args extends unknown[] ? Internal_ComponentTypeImpl<T, Props, Args> : never : never;

type Internal_ComponentTypeImpl<T extends HTMLElement, Props, Args extends unknown[]> =
    Props extends Object ? (new (props: Props, ...args: Args) => T) :
    Props extends undefined ? (new (...args: Args) => T) :
    never
