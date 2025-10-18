import { E, ElAttributes } from '../type.ts'

type GeneralHelper<Attrs, Item> = {
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


export type Helper<O = undefined, Item = E.Item> =
  O extends undefined ?
  GeneralHelper<ElAttributes, Item> :
  GeneralHelper<O & ElAttributes, Item>;


export type HelperFactory = {
  <O extends Object, Item = E.Item>(f: (attrs: O & ElAttributes, items: Item[]) => E.Item, defaultArgs: O): Helper<O, Item>;
  <Item = E.Item>(f: (attrs: ElAttributes, items: Item[]) => E.Item): Helper<undefined, Item>;
}
