import { E, ElAttributes } from '../type.ts'

export type ChildOf<L> = L extends (infer I)[] ? I : never;
export type ChildOfIfEl<L> = L extends E.Item[] ? E.Item : never;

interface AttributeBuilder<Attrs> {
}

export type VoidConstructor<O> = (attrs: O) => E.Item;
export interface VoidBuilderAbstract<Attrs> extends AttributeBuilder<Attrs> {
  attr(attr: Attrs): E.Item;
  attrAdd(attr: Attrs): this;
}

export type HelperConstructor<O, I> = (attrs: O, items: I) => E.Item;

export type BuilderAbstract<Attrs, I> = AttributeBuilder<Attrs> & {
  attr: (attr: Attrs) => BuilderAbstract<Attrs, I>;
  of: (...elements: ChildOf<I>[]) => E.Item;
  pre: (element: ChildOf<I>) => BuilderAbstract<Attrs, I>;
  app: (element: ChildOf<I>) => BuilderAbstract<Attrs, I>;
  post: (element: ChildOf<I>) => BuilderAbstract<Attrs, I>;
} & (I extends E.Item[] ? TextBuilderAbstract<Attrs> : {});

export type TextBuilderAbstract<Attrs> = {
  t: (text: TemplateStringsArray, ...items: E.Item[]) => E.Item;
  preT: (text: TemplateStringsArray, ...items: E.Item[]) => BuilderAbstract<Attrs, E.Item[]>;
  appT: (text: TemplateStringsArray, ...items: E.Item[]) => BuilderAbstract<Attrs, E.Item[]>;
  postT: (text: TemplateStringsArray, ...items: E.Item[]) => BuilderAbstract<Attrs, E.Item[]>;
};

type GeneralVoidHelper<Attrs> = VoidBuilderAbstract<Attrs> & {
  (attr?: Attrs): E.Item;
};

type GeneralTemplateHelper<Attrs, Item> = {
  (text: TemplateStringsArray, ...items: Item[]): E.Item;
  (attr: Attrs): {
    t: (text: TemplateStringsArray, ...items: Item[]) => E.Item;
    of: (...items: Item[]) => E.Item;
  };
  attr: (attr: Attrs) => {
    t: (text: TemplateStringsArray, ...items: Item[]) => E.Item;
    of: (...items: Item[]) => E.Item;
  };
  of: (...items: Item[]) => E.Item;
};

type New_GeneralHelper<Attrs, Items> = Items extends any[] ? (BuilderAbstract<Attrs, Items> & {
  (...items: Items): E.Item;
  (attr: Attrs): BuilderAbstract<Attrs, Items>;
}) : never;

type GeneralHelper<Attrs, Items> = Items extends any[] ? {
  (...items: Items): E.Item;
  (attr: Attrs): {
    of: (...items: Items) => E.Item;
  };
  attr(attr: Attrs): {
    of: (...items: Items) => E.Item;
  };
  of: (...items: Items) => E.Item;
} : never;

export type VoidHelper<O = undefined> =
  O extends undefined ?
  GeneralVoidHelper<ElAttributes> :
  GeneralVoidHelper<O & ElAttributes>;

export type TemplateHelper<O = undefined, Item = E.Item> =
  O extends undefined ?
  GeneralTemplateHelper<ElAttributes, Item> :
  GeneralTemplateHelper<O & ElAttributes, Item>;

export type Helper<O = undefined, Items = E.Item[]> =
  O extends undefined ?
  GeneralHelper<ElAttributes, Items> :
  GeneralHelper<O & ElAttributes, Items>;


export type TemplateHelperFactory = {
  <O extends Object, Item = E.Item>(f: (attrs: O & ElAttributes, items: Item[]) => E.Item, defaultArgs: O): TemplateHelper<O, Item>;
  <Item = E.Item>(f: (attrs: ElAttributes, items: Item[]) => E.Item): TemplateHelper<undefined, Item>;
}

export type VoidHelperFactory = {
  <O extends Object>(f: (attrs: O & ElAttributes) => E.Item, defaultArgs: O): VoidHelper<O>;
  (f: (attrs: ElAttributes) => E.Item): VoidHelper<undefined>;
}

export type HelperFactory = {
  <O extends Object, Items extends any[] = E.Item[]>(f: (attrs: O & ElAttributes, items: Items) => E.Item, defaultArgs: O): Helper<O, Items>;
  <Items extends any[] = E.Item[]>(f: (attrs: ElAttributes, items: Items) => E.Item): Helper<undefined, Items>;
}
