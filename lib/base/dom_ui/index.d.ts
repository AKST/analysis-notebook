export { generateCSS } from './css.js';

export type El =
  | Node
  | ElTopLevel
  | ElNode<string>

export type ElNode<TagName extends string> =
  | [tagName: TagName,
     attrs: ElAttrs | null | undefined,
     children: El[] | undefined]

  | [tagName: TagName,
     attrs: ElAttrs | null | undefined];

export type ElAttrs = {
  events?: never
  styles?: Record<string, string>,
  dataset?: Record<string, string>,
  [otherAttr: string]: any,
};

export type ElTopLevel =
  | string
  | false
  | undefined
  | null

export type Render = {
  <TagName extends keyof HTMLElementTagNameMap>(def: ElNode<TagName>): HTMLElementTagNameMap[TagName];
  (def: El): (Element | Text);
};

export const render: Render;
export function renderOnto(parent: Node, defs: El[]): Element | Text;
export function updateOn(domElement: Node | null, vElements: El[]): void;
export function updateElement(node: Node, parent: Element, vElement: El): void;
