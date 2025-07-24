export { generateCSS } from './css.js';

export type El =
  | Node
  | ElTopLevel
  | ElNode

export type ElNode =
  | [tagName: string,
     attrs: ElAttrs | null | undefined,
     children: El[] | undefined]

  | [tagName: string,
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

export function render(def: El): Element | Text;

export function renderOnto(parent: Node, defs: El[]): Element | Text;

export function updateOn(domElement: Node | null, vElements: El[]): void;

export function updateElement(node: Node, parent: Element, vElement: El): void;
