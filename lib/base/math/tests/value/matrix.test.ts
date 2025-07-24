import { describe, it, expect } from 'vitest';
import { unit } from '../../index.js';

const { m } = unit;

describe('Matrix namespace functions', () => {
  describe('matrix.det', () => {
    it('calculates determinant of 2x2 matrix', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const result = m.det(matrix);
      expect(result).toEqual(-2); // 1*4 - 2*3 = -2
    });

    it('calculates determinant of 3x3 matrix', () => {
      const matrix = m(3, 3)([1, 2, 3], [4, 5, 6], [7, 8, 9]);
      const result = m.det(matrix);
      expect(result).toEqual(0); // This matrix is singular
    });

    it('calculates determinant of identity matrix', () => {
      const identity = m.identity(3);
      const result = m.det(identity);
      expect(result).toEqual(1);
    });

    it('throws error for non-square matrix', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);
      expect(() => m.det(matrix)).toThrow('Determinant only defined for square matrices');
    });
  });

  describe('matrix.diag', () => {
    it('test', () => {
      expect(m.diag(4, [1, 2, 3, 4])).toEqual(
        m(4, 4)(
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0],
          [0, 0, 0, 4],
        ),
      );
    });
  });

  describe('matrix.transpose', () => {
    it('transposes a 2x3 matrix', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);
      const result = m.transpose(matrix);

      expect(result.n).toEqual(3);
      expect(result.m).toEqual(2);
      expect(result.mat).toEqual([[1, 4], [2, 5], [3, 6]]);
    });

    it('transposes a square matrix', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const result = m.transpose(matrix);

      expect(result.mat).toEqual([[1, 3], [2, 4]]);
    });

    it('handles single row matrix', () => {
      const matrix = m(1, 3)([1, 2, 3]);
      const result = m.transpose(matrix);

      expect(result.n).toEqual(3);
      expect(result.m).toEqual(1);
      expect(result.mat).toEqual([[1], [2], [3]]);
    });
  });

  describe('matrix.minor', () => {
    it('calculates minor by removing row and column', () => {
      const matrix = m(3, 3)([1, 2, 3], [4, 5, 6], [7, 8, 9]);
      const result = m.minor(matrix, 0, 0);

      expect(result.mat).toEqual([[5, 6], [8, 9]]);
      expect(result.n).toEqual(2);
      expect(result.m).toEqual(2);
    });

    it('calculates minor from center position', () => {
      const matrix = m(3, 3)([1, 2, 3], [4, 5, 6], [7, 8, 9]);
      const result = m.minor(matrix, 1, 1);

      expect(result.mat).toEqual([[1, 3], [7, 9]]);
    });
  });

  describe('matrix.cofactor', () => {
    it('calculates cofactor with correct sign', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);

      expect(m.cofactor(matrix, 0, 0)).toEqual(4);   // +det([[4]])
      expect(m.cofactor(matrix, 0, 1)).toEqual(-3);  // -det([[3]])
      expect(m.cofactor(matrix, 1, 0)).toEqual(-2);  // -det([[2]])
      expect(m.cofactor(matrix, 1, 1)).toEqual(1);   // +det([[1]])
    });
  });

  describe('matrix.adjugate', () => {
    it('calculates adjugate of 2x2 matrix', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const result = m.adjugate(matrix);

      // Adjugate should be transpose of cofactor matrix
      // Cofactor matrix: [[4, -3], [-2, 1]]
      // Adjugate: [[4, -2], [-3, 1]]
      expect(result.mat).toEqual([[4, -2], [-3, 1]]);
    });

    it('throws error for non-square matrix', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);
      expect(() => m.adjugate(matrix)).toThrow('Adjugate only defined for square matrices');
    });
  });

  describe('matrix.mul', () => {
    it('multiplies 2x2 matrices', () => {
      const a = m(2, 2)([1, 2], [3, 4]);
      const b = m(2, 2)([5, 6], [7, 8]);
      const result = m.mul(a, b);

      // [1 2] [5 6]   [19 22]
      // [3 4] [7 8] = [43 50]
      expect(result.mat).toEqual([[19, 22], [43, 50]]);
    });

    it('multiplies rectangular matrices', () => {
      const a = m(2, 3)([1, 2, 3], [4, 5, 6]);  // 2x3
      const b = m(3, 2)([7, 8], [9, 10], [11, 12]);  // 3x2
      const result = m.mul(a, b);  // Should be 2x2

      // [1 2 3] [7  8 ]   [58  64]
      // [4 5 6] [9  10] = [139 154]
      //         [11 12]
      expect(result.n).toEqual(2);
      expect(result.m).toEqual(2);
      expect(result.mat).toEqual([[58, 64], [139, 154]]);
    });

    it('multiplies with identity matrix', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const identity = m.identity(2);
      const result = m.mul(matrix, identity);

      expect(result.mat).toEqual([[1, 2], [3, 4]]);
    });

    it('throws error for incompatible dimensions', () => {
      const a = m(2, 2)([1, 2], [3, 4]);  // 2x2
      const b = m(3, 3)([1, 2, 3], [4, 5, 6], [7, 8, 9]);  // 3x3

      expect(() => m.mul(a, b)).toThrow('Invalid matrix dimensions for multiplication');
    });
  });

  describe('matrix.rows and matrix.cols', () => {
    it('returns correct dimensions', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);

      expect(m.rows(matrix)).toEqual(2);
      expect(m.cols(matrix)).toEqual(3);
    });
  });

  describe('matrix.get and matrix.set', () => {
    it('gets element at position', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);

      expect(m.get(matrix, 0, 0)).toEqual(1);
      expect(m.get(matrix, 0, 1)).toEqual(2);
      expect(m.get(matrix, 1, 0)).toEqual(3);
      expect(m.get(matrix, 1, 1)).toEqual(4);
    });

    it('sets element at position', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const result = m.set(matrix, 0, 1, 99);

      expect(result.mat).toEqual([[1, 99], [3, 4]]);
      // Original matrix unchanged
      expect(matrix.mat).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('matrix.getRow and matrix.setRow', () => {
    it('gets row as vector', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);
      const row0 = m.getRow(matrix, 0);
      const row1 = m.getRow(matrix, 1);

      expect(row0.vec).toEqual([1, 2, 3]);
      expect(row1.vec).toEqual([4, 5, 6]);
    });

    it('sets row from vector', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const newRow = unit.v()(9, 8);
      const result = m.setRow(matrix, 1, newRow);

      expect(result.mat).toEqual([[1, 2], [9, 8]]);
      // Original matrix unchanged
      expect(matrix.mat).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('matrix.getCol and matrix.setCol', () => {
    it('gets column as vector', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);
      const col0 = m.getCol(matrix, 0);
      const col1 = m.getCol(matrix, 1);
      const col2 = m.getCol(matrix, 2);

      expect(col0.vec).toEqual([1, 4]);
      expect(col1.vec).toEqual([2, 5]);
      expect(col2.vec).toEqual([3, 6]);
    });

    it('sets column from vector', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const newCol = unit.v()(9, 8);
      const result = m.setCol(matrix, 1, newCol);

      expect(result.mat).toEqual([[1, 9], [3, 8]]);
      // Original matrix unchanged
      expect(matrix.mat).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('matrix.diagOf', () => {
    it('extracts diagonal from square matrix', () => {
      const matrix = m(3, 3)([1, 2, 3], [4, 5, 6], [7, 8, 9]);
      const diag = m.diagOf(matrix);

      expect(diag.vec).toEqual([1, 5, 9]);
      expect(diag.n).toEqual(3);
    });

    it('extracts diagonal from rectangular matrix (more rows)', () => {
      const matrix = m(3, 2)([1, 2], [3, 4], [5, 6]);
      const diag = m.diagOf(matrix);

      expect(diag.vec).toEqual([1, 4]);
      expect(diag.n).toEqual(2);
    });

    it('extracts diagonal from rectangular matrix (more cols)', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);
      const diag = m.diagOf(matrix);

      expect(diag.vec).toEqual([1, 5]);
      expect(diag.n).toEqual(2);
    });

    it('handles complex matrix diagonal', () => {
      const matrix = m(2, 2)([unit.c(1, 1), unit.c(2, 0)], [unit.c(0, 3), unit.c(4, 4)]);
      const diag = m.diagOf(matrix);

      expect(diag.vec).toEqual([unit.c(1, 1), unit.c(4, 4)]);
    });

    it('handles single element matrix', () => {
      const matrix = m(1, 1)([5]);
      const diag = m.diagOf(matrix);

      expect(diag.vec).toEqual([5]);
    });
  });

  describe('matrix.norm', () => {
    it('calculates Frobenius norm of real matrix', () => {
      const matrix = m(2, 2)([3, 4], [0, 0]);
      const norm = m.norm(matrix);

      expect(norm).toEqual(5); // sqrt(3² + 4² + 0² + 0²) = 5
    });

    it('calculates norm of identity matrix', () => {
      const identity = m.identity(3);
      const norm = m.norm(identity);

      expect(norm).toBeCloseTo(Math.sqrt(3), 10); // sqrt(1² + 1² + 1²)
    });

    it('calculates norm of complex matrix', () => {
      const matrix = m(2, 2)([unit.c(3, 4), unit.c(0, 0)], [unit.c(0, 0), unit.c(0, 0)]);
      const norm = m.norm(matrix);

      expect(norm).toEqual(5); // sqrt(|3+4i|²) = sqrt(3² + 4²) = 5
    });

    it('handles zero matrix', () => {
      const zeros = m.zeros(2, 3);
      const norm = m.norm(zeros);

      expect(norm).toEqual(0);
    });

    it('handles single element matrix', () => {
      const matrix = m(1, 1)([7]);
      const norm = m.norm(matrix);

      expect(norm).toEqual(7);
    });
  });

  describe('matrix.trace', () => {
    it('calculates trace of square real matrix', () => {
      const matrix = m(2, 2)([1, 2], [3, 4]);
      const trace = m.trace(matrix);

      expect(trace).toEqual(5); // 1 + 4
    });

    it('calculates trace of identity matrix', () => {
      const identity = m.identity(3);
      const trace = m.trace(identity);

      expect(trace).toEqual(3); // 1 + 1 + 1
    });

    it('calculates trace of complex matrix', () => {
      const matrix = m(2, 2)([unit.c(1, 2), unit.c(0, 0)], [unit.c(0, 0), unit.c(3, 4)]);
      const trace = m.trace(matrix);

      expect(trace).toEqual(unit.c(4, 6)); // (1+2i) + (3+4i) = 4+6i
    });

    it('handles single element matrix', () => {
      const matrix = m(1, 1)([5]);
      const trace = m.trace(matrix);

      expect(trace).toEqual(5);
    });

    it('throws error for non-square matrix', () => {
      const matrix = m(2, 3)([1, 2, 3], [4, 5, 6]);

      expect(() => m.trace(matrix)).toThrow('Trace only defined for square matrices');
    });
  });
});
