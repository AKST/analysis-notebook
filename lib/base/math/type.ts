import { Repeat } from './natural.ts';

export type Real = number;

export type Complex =
  | { kind: 'c', real: Real, imag: Real };

export type Field = Real | Complex;

export type ElementKind = '0' | 'r' | 'c';

export type ElementType<K extends ElementKind> =
  K extends '0' ? unknown :
  K extends 'r' ? Real :
  K extends 'c' ? Complex : never;

export type KindFromElementType<K extends ElementKind> =
  K extends Real ? 'r' :
  K extends Complex ? 'c' : never;

export type Vector<N extends number = number> =
  | VectorOf<'r', N>
  | VectorOf<'c', N>
  | VectorOf<'0', N>;

export type VectorOf<
  E extends ElementKind,
  N extends number = number,
> = E extends '0'
    ? { kind: 'v', var: E, n: 0, vec: [] }
    : { kind: 'v', var: E, n: N, vec: ElementType<E>[] }

export type Matrix<N = undefined, M = undefined> =
  | MatrixOf<'r', N, M>
  | MatrixOf<'c', N, M>
  | MatrixOf<'0', N, M>;

export type MatrixOf<E extends ElementKind, N, M> =
  E extends '0'
    ? { kind: 'm', var: E, n: 0, m: 0, mat: [] }
    : { kind: 'm',
        var: E,
        n: N extends undefined ? number : N,
        m: M extends undefined ? number : M,
        mat: MatrixElements<N, M, ElementType<E>> };

export type MatrixElements<N, M, V> =
  [N, M] extends [undefined, undefined] ? V[][] :
  N extends number ?
    M extends number ?
      Repeat<N, Repeat<M, V>> :
      Repeat<N, V[]> :
    M extends number ?
      Repeat<M, V>[] :
      V[][];

export type Value =
  | Real
  | Complex
  | Vector
  | Matrix;
