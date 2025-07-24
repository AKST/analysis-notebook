// TODO
// - move the existing implementation of add & sub into `el`
// - reimplement addition but only provide definitions for
//   complex and real numbers, and similar for sub
import * as Natural from './natural.ts';
import type {
  ElementKind,
  KindFromElementType,
  MatrixElements,
  Field,
  Complex,
  Vector,
  Matrix,
} from './type.js';

// Promotion type with mathematical hierarchy: Matrix > Vector > Complex > number
type Promotion<A, B> =
  A extends Matrix ? Matrix :
  B extends Matrix ? Matrix :
  A extends Vector ? Vector :
  B extends Vector ? Vector :
  A extends Complex ? Complex :
  B extends Complex ? Complex :
  A extends number ? B :
  B extends number ? A :
  never;

type ScalarMatrixPromotion<N, M, E, A> =
  MatrixOf<KindFromElementType<Promotion<ElementType<E>, A>>, N, M>;

type MatrixPromotion<N, M, A, B> =
  MatrixOf<KindFromElementType<Promotion<ElementType<A>, ElementType<B>>>, N, M>;

// Generic binary operation type
type MathValue = Field | VectorOf<number, ElementKind> | Matrix;

type UniaryMathOperation = {
  <A extends MathValue>(a: A): A;
}

type BinaryScalarOperation = {
  /**
   * Matrix Element wise operations
   */
  <N, M, A extends ElementKind, B extends ElementKind>(
    a: MatrixOf<A, N, M>,
    b: MatrixOf<B, N, M>,
  ): MatrixPromotion<N, M, A, B>;

  /**
   * Matrix Scalar operations
   */
  <N, M, R extends ElementKind, B extends Field>(
      a: MatrixOf<R, N, M>,
      b: B,
  ): ScalarMatrixPromotion<N, M, R, A>;

  <N, M, R extends ElementKind, B extends Field>(
      a: B,
      b: MatrixOf<R, N, M>,
  ): ScalarMatrixPromotion<N, M, R, A>;

  /**
   * Vector Elementwise operations
   */
  <N, R extends ElementKind>(a: VectorOf<N, R>, b: VectorOf<N, R>): VectorOf<N, R>;
  /**
   * Vector Scalar operations
   */
  <A extends MathValue, N, R extends ElementKind>(a: A, b: VectorOf<N, R>): VectorOf<N, R>;
  <A extends MathValue, N, R extends ElementKind>(b: VectorOf<N, R>, a: A): VectorOf<N, R>;

  <A extends MathValue, B extends MathValue>(a: A, b: B): Promotion<A, B>;
  <A extends MathValue>(a: A): <B extends MathValue>(b: B) => Promotion<A, B>;
};

type BinaryOp<A, B> =
  & ((a: A, b: B) => Promotion<A, B>)
  & ((a: A) => (b: B) => Promotion<A, B>);

type BinaryMatrixOp = {
  <A, B, N>(a: MatrixOf<A, N, N>, b: MatrixOf<B, N, N>): MatrixPromotion<N, N, A, B>;
};

type BinaryNumberOp = {
  <A extends Field, B extends Field>(a: A, b: B): Promotion<A, B>;
  <A extends Field>(a: A): <B extends Field>(b: B) => Promotion<A, B>;
};

export const euler: number;

export namespace field {
  export const log: <A extends Field, B extends Field>(value: A, base: B) => Promotion<A, B>;
  export const exp: <A extends Field, B extends Field>(base: A, exp: B) => Promotion<A, B>;
}

// scalar and elementwise operations
export namespace el {
  export const add: BinaryScalarOperation;
  export const sub: BinaryScalarOperation;
  export const mul: BinaryScalarOperation;
  export const div: BinaryScalarOperation;
  export const mod: BinaryScalarOperation;

  export const inv: <A extends MathValue>(a: A) => A;

  export const pow: <A extends number | Complex | Vector | Matrix>(value: A, base: number) => A;

  export const log: <A extends number | Complex | Vector | Matrix>(value: A) => unknown;
  export const exp: <A extends number | Complex | Vector | Matrix>(base: A) => A;
}

export function complex(real: number, imag: number): Complex;
export namespace complex {
  export function createMagAngle(magnitude: number, angle: number): Complex;
  export function magnitude(v: Complex): number;

  // also know as the arg
  export function phase(v: Complex): number;

  export function conj(v: Complex): Complex;
  export function real(v: Complex | number): number;
  export function imag(v: Complex): number;
}

export function vector<N extends number | undefined>(
  n?: N | undefined,
): <
  T extends number | Complex,
>(
  ...vec: T[],
) => VectorOf<
  KindFromElementType<T>,
  N extends undefined ? number : N,
>;

export namespace vector {
  export function zeros(length: number): Vector;
  export function ones(length: number): Vector;
  export function basis(length: number, index: number): Vector;
  export function size(v: Vector): number;
  export function norm(v: Vector): number;
  export function unit(v: Vector): Vector;
  export function cross2d(v: Vector, v: Vector): number;
  export function cross3d(v: Vector, v: Vector): Vector;
  export function dot(a: Vector, b: Vector): number;
  export function set(v: Vector, i: number, a: number | Complex): Vector;
  export function get(v: Vector, i: number): number | Complex;
}


export function matrix<
  N extends number | undefined = undefined,
  M extends number | undefined = undefined,
>(
  n?: N | undefined,
  m?: M | undefined,
): <T extends number | Complex>(...mat: MatrixElements<N, M, T>) =>
  MatrixOf<KindFromElementType<T>, N, M>;

// Matrix constructor
// export function matrix<T extends number | Complex>(...mat: T[][]): Matrix;
export namespace matrix {
  export function zeros<N extends number, M extends number>(rows: N, cols: M): MatrixOf<'r', N, M>;
  export function ones<N extends number, M extends number>(rows: N, cols: M): MatrixOf<'r', N, M>;
  export function identity<N extends number>(size: N): MatrixOf<'r', N, N>;

  export const diag: <E, N extends number>(n: N, values: Natural.Repeat<N, E>) => MatrixOf<KindFromElementType<E>, N, N>;
  export const row: <E, N extends number>(v: VectorOf<E, N>) => MatrixOf<E, 1, N>;
  export const col: <E, N extends number>(v: VectorOf<E, N>) => MatrixOf<E, N, 1>;
  export const det: <E, N extends number>(m: MatrixOf<E, N, N>) => E;
  export const mul: <A, B, N, M, P>(a: MatrixOf<A, N, M>, b: MatrixOf<B, M, P>) => MatrixPromotion<N, P, A, B>;

  export const norm: (values: Matrix) => number;
  export const diagOf: <E, N, M>(m: MatrixOf<E, N, M>) => VectorOf<E, Natural.Min<N, M>>;
  export const transpose: <E, N, M>(m: MatrixOf<E, N, M>) => MatrixOf<E, M, N>;
  export const rows: (m: Matrix) => number;
  export const cols: (m: Matrix) => number;
  export const get: <E>(m: MatrixOf<E, unknown, unknown>, i: number, j: number) => ElementType<E>;
  export const set: <E, N, M>(m: MatrixOf<E, N, M>, i: number, j: number, a: ElementType<E>) => MatrixOf<E, N, M>;
  export const getRow: <E, M>(m: MatrixOf<E, unknown, M>, index: number) => VectorOf<E, M>;
  export const setRow: <E, N, M>(m: MatrixOf<E, N, M>, index: number, v: VectorOf<E, M>) => MatrixOf<E, N, M>;
  export const getCol: <E, N>(m: MatrixOf<E, N, unknown>, index: number) => VectorOf<E, N>;
  export const setCol: <E, N, M>(m: MatrixOf<E, N, M>, index: number, v: VectorOf<E, N>) => MatrixOf<E, N, M>;
  export const minor: <E, N, M>(m: MatrixOf<E, N, M>, i: number, j: number) => MatrixOf<E, Natural.Dec<N>, Natural.Dec<M>>;
  export const cofactor: <E>(m: MatrixOf<E, unknown, unknown>, row: number, col: number) => ElementType<E>;
  export const adjugate: <E, N>(m: MatrixOf<E, N, N>) => MatrixOf<E, N, N>;
  export const trace: (m: Matrix) => number;

  export const eigenDecomposition: (m: Matrix) => [Vector, Matrix];
}

// Unit exports
export const unit: {
  m: typeof matrix;
  v: typeof vector;
  c: typeof complex;
};


export const inv: <V extends number | Complex | Matrix>(v: V) => V;
export const neg: UniaryMathOperation;

export const add: BinaryNumberOp;
export const sub: BinaryNumberOp;
export const mul: BinaryNumberOp & BinaryMatrixOp;
export const div: BinaryNumberOp;

export const log: {
  <A extends number | Complex | Matrix>(value: A): A;
  <A extends number | Complex | Matrix, B extends number | Complex>(value: A, base: B): Promotion<A, B>;
  <A extends number | Complex | Matrix>(value: A, base: Matrix): never;
};

export const exp: {
  <A extends number | Complex | Matrix>(value: A): A;
  <A extends number | Complex | Matrix, B extends number | Complex>(value: A, base: B): Promotion<A, B>;
  <A extends number | Complex>(value: A, base: Matrix): Matrix;
  (value: Matrix, base: Matrix): never;
};

export const pow: <A extends number | Complex | Matrix>(a: A, base: number) => A;
export const nrt: <A extends number | Complex | Matrix>(a: A, base: number) => A;
export const sqrt: <A extends number | Complex | Matrix>(a: A) => A;

export const equals: {
  (a: MathValue): (b: MathValue) => boolean;
  (a: MathValue, b: MathValue): boolean;
},
