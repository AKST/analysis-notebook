import { E, ElAttributes } from '../type.ts'

export type ChildOf<L> = L extends (infer I)[] ? I : never;
export type ChildOfIfEl<L> = L extends E.Item[] ? E.Item : never;

export interface AttributeBuilder<Attrs> {
}

export type VoidConstructor<O> = (attrs: O) => E.Item;
export interface VoidBuilderAbstract<Attrs> extends AttributeBuilder<Attrs> {
  attr(attr: Attrs): E.Item;
  attrAdd(attr: Attrs): this;
}

export type HelperConstructor<O, I> = (attrs: O, items: I) => E.Item;

type OverloadBuilderAbstract<Attrs, I> =
  I extends E.Item[]
    ? TextBuilderAbstract<Attrs, I>
    : BuilderAbstract<Attrs, I>;

export type BuilderAbstract<Attrs, I> = AttributeBuilder<Attrs> & {
  attr: (attr: Attrs) => OverloadBuilderAbstract<Attrs, I>;
  of: (...elements: ChildOf<I>[]) => E.Item;
  pre: (element: ChildOf<I>) => OverloadBuilderAbstract<Attrs, I>;
  app: (element: ChildOf<I>) => OverloadBuilderAbstract<Attrs, I>;
  post: (element: ChildOf<I>) => OverloadBuilderAbstract<Attrs, I>;
};

export type TextBuilderAbstract<Attrs, I> = BuilderAbstract<Attrs, I> & {
  t: (text: TemplateStringsArray, ...items: E.Item[]) => E.Item;
  preT: (text: TemplateStringsArray, ...items: E.Item[]) => OverloadBuilderAbstract<Attrs, I>;
  appT: (text: TemplateStringsArray, ...items: E.Item[]) => OverloadBuilderAbstract<Attrs, I>;
  postT: (text: TemplateStringsArray, ...items: E.Item[]) => OverloadBuilderAbstract<Attrs, I>;
};

type GeneralVoidHelper<Attrs> = VoidBuilderAbstract<Attrs> & {
  (attr?: Attrs): E.Item;
};

type GeneralTemplateHelper<Attrs, Items> = Items extends any[] ? (OverloadBuilderAbstract<Attrs, Items> & {
  (text: TemplateStringsArray, ...items: Items): E.Item;
  (attr: Attrs): OverloadBuilderAbstract<Attrs, Items>;
}) : never;

type GeneralHelper<Attrs, Items> = Items extends any[] ? (OverloadBuilderAbstract<Attrs, Items> & {
  (...items: Items): E.Item;
  (attr: Attrs): OverloadBuilderAbstract<Attrs, Items>;
}) : never;

export type VoidHelper<O = undefined> =
  O extends undefined ?
  GeneralVoidHelper<ElAttributes> :
  GeneralVoidHelper<O & ElAttributes>;

export type TemplateHelper<O = undefined, Items = E.Item[]> =
  O extends undefined ?
  GeneralTemplateHelper<ElAttributes, Items> :
  GeneralTemplateHelper<O & ElAttributes, Items>;

export type Helper<O = undefined, Items = E.Item[]> =
  O extends undefined ?
  GeneralHelper<ElAttributes, Items> :
  GeneralHelper<O & ElAttributes, Items>;

export type VoidHelperFactory = {
  <O extends Object>(f: (attrs: O & ElAttributes) => E.Item, defaultArgs: O): VoidHelper<O>;
  (f: (attrs: ElAttributes) => E.Item): VoidHelper<undefined>;
}

export type TemplateHelperFactory = {
  <O extends Object, Items extends any[] = E.Item[]>(f: (attrs: O & ElAttributes, items: Items) => E.Item, defaultArgs: O): TemplateHelper<O, Items>;
  <Items extends any[] = E.Item[]>(f: (attrs: ElAttributes, items: Items) => E.Item): TemplateHelper<undefined, Items>;
}

export type HelperFactory = {
  <O extends Object, Items extends any[] = E.Item[]>(f: (attrs: O & ElAttributes, items: Items) => E.Item, defaultArgs: O): Helper<O, Items>;
  <Items extends any[] = E.Item[]>(f: (attrs: ElAttributes, items: Items) => E.Item): Helper<undefined, Items>;
}
