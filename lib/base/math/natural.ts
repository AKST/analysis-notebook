export type Inc<N> =
  N extends 0 ? 1 :
  N extends 1 ? 2 :
  N extends 2 ? 3 :
  N extends 3 ? 4 :
  N extends 4 ? 5 :
  N extends 5 ? 6 :
  N extends 6 ? 7 :
  N extends 7 ? 8 :
  N extends 8 ? 9 :
  N extends 9 ? 10 :
  N extends 10 ? 11 :
  N extends 11 ? 12 :
  N extends 12 ? 13 :
  N extends 13 ? 14 :
  N extends 14 ? 15 :
  N extends 15 ? 16 :
  N extends 16 ? 17 :
  N extends 17 ? 18 :
  N extends 18 ? 19 :
  N extends 19 ? 20 :
  N extends 20 ? 21 :
  N extends 21 ? 22 :
  N extends 22 ? 23 :
  N extends 23 ? 24 :
  N extends 24 ? 25 :
  N extends 25 ? 26 :
  N extends 26 ? 27 :
  N extends 27 ? 28 :
  N extends 28 ? 29 :
  N extends 29 ? 30 :
  N extends 30 ? 31 :
  N extends 31 ? 32 : never;

export type Dec<N> =
  N extends 32 ? 31 :
  N extends 31 ? 30 :
  N extends 30 ? 29 :
  N extends 29 ? 28 :
  N extends 28 ? 27 :
  N extends 27 ? 26 :
  N extends 26 ? 25 :
  N extends 25 ? 24 :
  N extends 24 ? 23 :
  N extends 23 ? 22 :
  N extends 22 ? 21 :
  N extends 21 ? 20 :
  N extends 20 ? 19 :
  N extends 19 ? 18 :
  N extends 18 ? 17 :
  N extends 17 ? 16 :
  N extends 16 ? 15 :
  N extends 15 ? 14 :
  N extends 14 ? 13 :
  N extends 13 ? 12 :
  N extends 12 ? 11 :
  N extends 11 ? 10 :
  N extends 10 ? 9  :
  N extends 9  ? 8  :
  N extends 8  ? 7  :
  N extends 7  ? 6  :
  N extends 6  ? 5  :
  N extends 5  ? 4  :
  N extends 4  ? 3  :
  N extends 3  ? 2  :
  N extends 2  ? 1  :
  N extends 1  ? 0  : never;

export type Repeat<N, V> =
  N extends number ? (
    N extends 0 ? [] :
    N extends 1 ? [V] :
    [V, ...Repeat<Dec<N>, V>]
  ) : never;

export type Min<A, B> = MinImpl<A, B, A, B>;

type MinImpl<A, B, AA, BB> =
  AA extends 0 ? A :
  BB extends 0 ? B :
  MinImpl<A, B, Dec<AA>, Dec<BB>>;

