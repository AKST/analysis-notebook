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
}

type GeneralHelper<Attrs, Items> = Items extends any[] ? {
  (...items: Items): E.Item;
  (attr: Attrs): (...items: Items) => E.Item;
  attr: (attr: Attrs) => (...items: Items) => E.Item;
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

export type HelperFactory = {
  <O extends Object, Items = E.Item[]>(f: (attrs: O & ElAttributes, items: Items) => E.Item, defaultArgs: O): Helper<O, Items>;
  <Items = E.Item[]>(f: (attrs: ElAttributes, items: Items) => E.Item): Helper<undefined, Items>;
}
