import * as Dom from '../platform/dom/type.ts';
import { E } from './type.ts'

export type DefaultHelperAttrs<NS, T> = Partial<Dom.ElementAttributesWriteOnly<NS, T>>;
export type HelperNode<NS, T> = E.Node<NS, T, DefaultHelperAttrs<NS, T>>;

export type ChildOf<L> = L extends (infer I)[] ? I : never;
export type ChildOfIfEl<L> = L extends E.Item[] ? E.Item : never;


export type VoidConstructor<NS, T, O> = (attrs: E.Meta<O>) => E.Node<NS, T, DefaultHelperAttrs<NS, T>>;
export interface VoidBuilderAbstract<NS, T, Attrs> {
  css(style: E.Styles): VoidBuilderAbstract<NS, T, Attrs>;
  data(data: E.Dataset): VoidBuilderAbstract<NS, T, Attrs>;
  meta: (attr: E.Meta<Attrs>) => VoidBuilderAbstract<NS, T, Attrs>;
  attr(attr: Attrs): HelperNode<NS, T>;
  attrAdd(attr: Attrs): VoidBuilderAbstract<NS, T, Attrs>;
}

export type HelperConstructor<NS, T, O, I> =
  (attrs: E.Meta<O>, items: I) => HelperNode<NS, T>;

type OverloadBuilderAbstract<NS, T, Attrs, I> =
  I extends E.Item[]
    ? TextBuilderAbstract<NS, T, Attrs, I>
    : BuilderAbstract<NS, T, Attrs, I>;

export type BuilderAbstract<NS, T, Attrs, I> = {
  /**
   * `c` is short for `children`
   */
  c: (...elements: ChildOf<I>[]) => HelperNode<NS, T>;
  css: (style: E.Styles) => BuilderAbstract<NS, T, Attrs, I>;
  data: (data: E.Dataset) => BuilderAbstract<NS, T, Attrs, I>;
  meta: (attr: E.Meta<Attrs>) => BuilderAbstract<NS, T, Attrs, I>;
  attr: (attr: Attrs) => BuilderAbstract<NS, T, Attrs, I>;
  cAppend: (element: ChildOf<I>) => BuilderAbstract<NS, T, Attrs, I>;
};

export type TextBuilderAbstract<NS, T, Attrs, I> = {
  /**
   * `t` is short for `text`
   */
  t: (text: TemplateStringsArray, ...items: E.Item[]) => HelperNode<NS, T>;
  /**
   * `c` is short for `children`
   */
  c: (...elements: ChildOf<I>[]) => HelperNode<NS, T>;
  css: (style: E.Styles) => TextBuilderAbstract<NS, T, Attrs, I>;
  data: (data: E.Dataset) => TextBuilderAbstract<NS, T, Attrs, I>;
  meta: (attr: E.Meta<Attrs>) => TextBuilderAbstract<NS, T, Attrs, I>;
  attr: (attr: Attrs) => TextBuilderAbstract<NS, T, Attrs, I>;
  cAppend: (element: ChildOf<I>) => TextBuilderAbstract<NS, T, Attrs, I>;
  tAppend: (text: TemplateStringsArray, ...items: E.Item[]) => TextBuilderAbstract<NS, T, Attrs, I>;
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
  (attr: E.Meta<Attrs>): OverloadBuilderAbstract<NS, T, Attrs, Items>;
  (attr: Attrs): OverloadBuilderAbstract<NS, T, Attrs, Items>;
}) : never;

type GeneralHelper<NS, T, Attrs, Items> = Items extends any[] ? (OverloadBuilderAbstract<NS, T, Attrs, Items> & {
  (...items: Items): HelperNode<NS, T>;
  (attr: E.Meta<Attrs>): OverloadBuilderAbstract<NS, T, Attrs, Items>;
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
   * Known element with overriden attributes
   */
  <NS extends string, T extends string, O extends Object = DefaultHelperAttrs<NS, T>>(options: {
    of: [NS, T];
    create?: (meta: E.Meta<O>) => HelperNode<NS, T>;
  }): VoidHelper<NS, T, O>;
}

export type TemplateHelperFactory = {
  /**
   * Known element with overriden attributes
   */
  <NS extends string, T extends string, O extends Object = DefaultHelperAttrs<NS, T>, Items extends any[] = E.Item[]>(options: {
    of: [NS, T];
    create?: (meta: E.Meta<O>, items: Items) => HelperNode<NS, T>;
  }): TemplateHelper<NS, T, O, Items>;
}

export type HelperFactory = {
  /**
   * Known element with overriden attributes
   */
  <NS extends string, T extends string, O extends Object = DefaultHelperAttrs<NS, T>, Items extends any[] = E.Item[]>(options: {
    of: [NS, T];
    create?: (meta: E.Meta<O>, items: Items) => HelperNode<NS, T>;
  }): Helper<NS, T, O, Items>;

  // /**
  //  * Anonymous element with overriden attributes
  //  */
  // <NS extends string, T extends string, O extends Object = DefaultHelperAttrs<NS, T>, Items extends any[] = E.Item[]>(options: {
  //   create: (meta: E.Meta<O>, items: Items) => HelperNode<unknown, unknown>;
  // }): Helper<unknown, unknown, O, Items>;
}
