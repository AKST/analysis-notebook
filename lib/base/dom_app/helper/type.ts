import { E, ElAttributes } from '../type.ts'

type GeneralTemplateHelper<Attrs, Item> = {
  (text: TemplateStringsArray, ...items: Item[]): E.Item;
  (attr: Attrs): {
    (text: TemplateStringsArray, ...items: Item[]): E.Item;
    of: (...items: Item[]) => E.Item;
  };
  attr: (attr: Attrs) => {
    (text: TemplateStringsArray, ...items: Item[]): E.Item;
    of: (...items: Item[]) => E.Item;
  };
  of: (...items: Item[]) => E.Item;
};

export type VoidConstructor<O> = (attrs: O) => E.Item;
export interface VoidBuilderAbstract<Attrs> {
  attr(attr: Attrs): E.Item;
  attrAdd(attr: Attrs): this;
}

type GeneralVoidHelper<Attrs> = VoidBuilderAbstract<Attrs> & {
  (attr?: Attrs): E.Item;
};

export type VoidHelper<O = undefined> =
  O extends undefined ?
  GeneralVoidHelper<ElAttributes> :
  GeneralVoidHelper<O & ElAttributes>;

type GeneralHelper<Attrs, Items> = Items extends any[] ? {
  (...items: Items): E.Item;
  (attr: Attrs): {
    (...items: Items): E.Item;
    of: (...items: Items) => E.Item;
  };
  attr(attr: Attrs): {
    (...items: Items): E.Item;
    of: (...items: Items) => E.Item;
  };
  of: (...items: Items) => E.Item;
} : never;


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
