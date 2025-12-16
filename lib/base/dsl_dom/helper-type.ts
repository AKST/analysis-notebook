import * as Dom from '../platform/dom/type.ts';
import { E } from './type.ts'

export type DefaultHelperAttrs<NS, T> = Partial<Dom.ElementAttributesWriteOnly<NS, T>>;
export type HelperNode<NS, T> = E.Node<NS, T, DefaultHelperAttrs<NS, T>>;

export type ChildOf<L> = L extends (infer I)[] ? I : never;
export type ChildOfIfEl<L> = L extends E.Item[] ? E.Item : never;


export type VoidConstructor<NS, T, O> = (attrs: E.Attrs<O>) => E.Node<NS, T, DefaultHelperAttrs<NS, T>>;
export interface VoidBuilderAbstract<NS, T, Attrs> {
  css(style: E.Styles): VoidBuilderAbstract<NS, T, Attrs>;
  data(data: E.Dataset): VoidBuilderAbstract<NS, T, Attrs>;
  attr(attr: Attrs): HelperNode<NS, T>;
  attrAdd(attr: Attrs): VoidBuilderAbstract<NS, T, Attrs>;
}

export type HelperConstructor<NS, T, O, I> =
  (attrs: E.Attrs<O>, items: I) => HelperNode<NS, T>;

type OverloadBuilderAbstract<NS, T, Attrs, I> =
  I extends E.Item[]
    ? TextBuilderAbstract<NS, T, Attrs, I>
    : BuilderAbstract<NS, T, Attrs, I>;

export type BuilderAbstract<NS, T, Attrs, I> = {
  css: (style: E.Styles) => OverloadBuilderAbstract<NS, T, Attrs, I>;
  data: (data: E.Dataset) => OverloadBuilderAbstract<NS, T, Attrs, I>;
  attr: (attr: Attrs) => OverloadBuilderAbstract<NS, T, Attrs, I>;
  of: (...elements: ChildOf<I>[]) => HelperNode<NS, T>;
  pre: (element: ChildOf<I>) => OverloadBuilderAbstract<NS, T, Attrs, I>;
  app: (element: ChildOf<I>) => OverloadBuilderAbstract<NS, T, Attrs, I>;
  post: (element: ChildOf<I>) => OverloadBuilderAbstract<NS, T, Attrs, I>;
};

export type TextBuilderAbstract<NS, T, Attrs, I> = BuilderAbstract<NS, T, Attrs, I> & {
  t: (text: TemplateStringsArray, ...items: E.Item[]) => HelperNode<NS, T>;
  preT: (text: TemplateStringsArray, ...items: E.Item[]) => OverloadBuilderAbstract<NS, T, Attrs, I>;
  appT: (text: TemplateStringsArray, ...items: E.Item[]) => OverloadBuilderAbstract<NS, T, Attrs, I>;
  postT: (text: TemplateStringsArray, ...items: E.Item[]) => OverloadBuilderAbstract<NS, T, Attrs, I>;
};

/*
 * These types are intermedirary types to generate the the appropiate factory
 * type. The factories are proxies which provide an apply handler which allow
 * them to act as functions.
 */

type GeneralVoidHelper<NS, T, Attrs> = VoidBuilderAbstract<NS, T, Attrs> & {
  (attr?: Attrs): HelperNode<NS, T>;
};

type GeneralTemplateHelper<NS, T, Attrs, Items> = Items extends any[] ? (OverloadBuilderAbstract<NS, T, Attrs, Items> & {
  (text: TemplateStringsArray, ...items: Items): HelperNode<NS, T>;
  (attr: Attrs): OverloadBuilderAbstract<NS, T, Attrs, Items>;
}) : never;

type GeneralHelper<NS, T, Attrs, Items> = Items extends any[] ? (OverloadBuilderAbstract<NS, T, Attrs, Items> & {
  (...items: Items): HelperNode<NS, T>;
  (attr: Attrs): OverloadBuilderAbstract<NS, T, Attrs, Items>;
}) : never;


export type VoidHelper<NS, T, O = DefaultHelperAttrs<NS, T>> =
  GeneralVoidHelper<NS, T, O>;

export type TemplateHelper<NS, T, O = DefaultHelperAttrs<NS, T>, Items = E.Item[]> =
  GeneralTemplateHelper<NS, T, O, Items>;

export type Helper<NS, T, O = DefaultHelperAttrs<NS, T>, Items = E.Item[]> =
  GeneralHelper<NS, T, O, Items>;

export type VoidHelperFactory = {
  /**
   * Known element with default attributes
   */
  <NS extends string, T extends string>(ns: NS, t: T): (
    f?: (attrs: E.Attrs<DefaultHelperAttrs<NS, T>>) => HelperNode<NS, T>,
  ) => VoidHelper<NS, T, DefaultHelperAttrs<NS, T>>;
  /**
   * Known element with overriden attributes
   */
  <NS extends string, T extends string, O extends Object>(ns: NS, t: T): (
    f: (attrs: E.Attrs<O>) => HelperNode<NS, T>,
    defaultArgs: O,
  ) => VoidHelper<NS, T, O>;
  /**
   * Anonymous element custom Attributes
   */
  <O extends Object>(): (
    f: (attrs: E.Attrs<O>) => E.Node<unknown, unknown, O>,
    defaultArgs: O
  ) => VoidHelper<unknown, unknown, O>;
}

export type TemplateHelperFactory = {
  /**
   * Known element with default attributes
   */
  <NS extends string, T extends string, Items extends any[] = E.Item[]>(ns: NS, t: T): (
    f?: (
      attrs: E.Attrs<DefaultHelperAttrs<NS, T>>,
      items: Items,
    ) => HelperNode<NS, T>,
  ) => TemplateHelper<NS, T, DefaultHelperAttrs<NS, T>, Items>;
  /**
   * Known element with overriden attributes
   */
  <NS extends string, T extends string, O extends Object, Items extends any[] = E.Item[]>(ns: NS, t: T): (
    f: (attrs: E.Attrs<O>, items: Items) => HelperNode<NS, T>,
    defaultArgs: O,
  ) => TemplateHelper<NS, T, O, Items>;
  /**
   * Anonymous element custom Attributes
   */
  <O extends Object, Items extends any[] = E.Item[]>(): (
    f: (attrs: E.Attrs<O>, items: Items) => E.Node<unknown, unknown, O>,
    defaultArgs: O
  ) => TemplateHelper<unknown, unknown, O, Items>;
}

export type HelperFactory = {
  /**
   * Known element with default attributes
   */
  <NS extends string, T extends string, Items extends any[] = E.Item[]>(ns: NS, t: T): (
    f?: (
      attrs: E.Attrs<DefaultHelperAttrs<NS, T>>,
      items: Items,
    ) => HelperNode<NS, T>,
  ) => Helper<NS, T, DefaultHelperAttrs<NS, T>, Items>;
  /**
   * Known element with overriden attributes
   */
  <NS extends string, T extends string, O extends Object, Items extends any[] = E.Item[]>(
    ns: NS,
    t: T,
  ): (
    f: (attrs: E.Attrs<O>, items: Items) => HelperNode<NS, T>,
    defaultArgs: O,
  ) => Helper<NS, T, O, Items>;
  /**
   * Anonymous element custom Attributes
   */
  <O extends Object, Items extends any[] = E.Item[]>(): (
    f: (attrs: E.Attrs<O>, items: Items) => E.Node<unknown, unknown, O>,
    defaultArgs: O,
  ) => Helper<unknown, unknown, O, Items>;
}
