// @ts-nocheck - see definition file

const kindOf = (a) => {
  if (typeof a === 'number') return 'r';
  return a.kind;
}

const varOf = (a) => {
  if (typeof a === 'number') return 'r';
  if (a.kind === 'c') return 'c';
  if (a.kind === 'v') return a.var;
  if (a.kind === 'm') return a.var;
  console.error(a);
  throw new Error('unknown');
};

const promotion = (a, b) => {
  if (varOf(a) === 'r') return varOf(b);
  if (varOf(b) === 'r') return varOf(a);
  if (varOf(a) === 'c') return varOf(b);
  if (varOf(b) === 'c') return varOf(a);
  return '0';
}

const assocKind = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return ['rr', a, b];
  if (typeof a === 'number') return ['r'+b.kind, a, b];
  if (typeof b === 'number') return ['r'+a.kind, b, a];
  if (a.kind === 'c') return ['c'+b.kind, a, b];
  if (b.kind === 'c') return ['c'+a.kind, b, a];
  if (a.kind === 'v') return ['v'+b.kind, a, b];
  if (b.kind === 'v') return ['v'+a.kind, b, a];
  return ['mm', a, b];
}

const assertVec = (a, b) => {
  if (a.n === b.n) return;
  throw new TypeError("Vectors of different lengths added together");
}

const assertMat = (a, b) => {
  if (a.n === b.n && a.m === b.m) return;
  console.error(a);
  console.error(b);
  throw new TypeError("Matrixs must be the same dimensions");
}

const assertSquareMat = (a) => {
  if (a.n === a.m) return;
  console.error(a);
  throw new TypeError("Matrix needs to be square");
}

const vecMap = (v, f) => ({ ...v, vec: v.vec.map((v, i) => f(v, i)) });
const matMap = (m, f) => ({
  ...m,
  mat: m.mat.map((r, i) => r.map((c, j) => f(c, i, j)))
});

export const el = (function () {
  /**
   * Scalar and Elementwise Addition
   *
   * When you have a vector or matrix, the children will use normal addition
   *
   * Real with Complex numbers will have both values of a complex
   * added by the real number. But complex numbers as entries of
   * vectors of matries will use normal addition.
   */
  function add(a, b) {
    if (arguments.length === 1) {
      return b => add(a, b);
    }

    const [k, c, d] = assocKind(a, b);

    switch (k) {
      case 'rr':
        return c + d;
      case 'rc':
        // scalar operation, use _add for normal addition
        return complex(c + d.real, c + d.imag);
      case 'cc':
        return complex(c.real + d.real, c.imag + d.imag);
      case 'rv':
      case 'cv':
        return {
          ...vecMap(d, d => _add(c, d)),
          var: promotion(c, d),
        };
      case 'rm':
      case 'cm':
        return {
          ...matMap(d, d => _add(c, d)),
          var: promotion(c, d),
        };
      case 'vv':
        assertVec(c, d);
        return {
          ...vecMap(c, (c, i) => _add(c, d.vec[i])),
          var: promotion(c, d),
        };
      case 'vm':
        throw new Error('not implemented');
      case 'mm':
        assertMat(c, d);
        return {
          ...matMap(c, (c, i, j) => _add(c, d.mat[i][j])),
          var: promotion(c, b),
        };
      default:
        throw new Error('not reachable ' + k);
    }
  }

  /**
   * Scalar and Elementwise Substraction
   */
  function sub(a, b) {
    if (arguments.length === 1) {
      return b => add(a, _neg(b))
    }
    return add(a, _neg(b));
  };

  /**
   * Scalar and Elementwise Multiplication
   *
   * When you have a vector or matrix, the children will use
   * normal multiplication
   *
   * Real with Complex numbers will have both values of a complex
   * multiplie by the real number.But complex numbers as entries of
   * vectors of matries will use normal multiplication.
   */
  function mul(a, b) {
    if (arguments.length === 1) {
      return b => mul(a, b);
    }

    const [k, c, d] = assocKind(a, b);

    switch (k) {
      case 'rr':
        return c * d;
      case 'rc':
        return complex(c * d.real, c * d.imag);
      case 'cc':
        return complex(c.real * d.real, c.imag * d.imag);
      case 'rv':
      case 'cv':
        return {
          ...vecMap(d, d => _mul(c, d)),
          var: promotion(c, d),
        };
      case 'rm':
      case 'cm':
        return {
          ...matMap(d, d => _mul(c, d)),
          var: promotion(c, d),
        };
      case 'vv':
        assertVec(c, d);
        return {
          ...vecMap(c, (c, i) => _mul(c, d.vec[i])),
          var: promotion(c, d),
        };
      case 'vm':
        throw new Error('not supported');
      case 'mm':
        assertMat(c, d);
        return {
          ...matMap(c, (c, i, j) => _mul(c, d.mat[i][j])),
          var: promotion(c, b),
        };
      default:
        throw new Error('not reachable ' + k);
    }
  }

  function div(a, b) {
    if (arguments.length === 1) {
      return b => div(a, b);
    }

    const aKind = kindOf(a);
    const bKind = kindOf(b);
    const k = aKind + bKind;

    switch (k) {
      case 'rr':
        return a / b;
      case 'rc':
        return complex(a / b.real, a / b.imag);
      case 'cr':
        return complex(a.real / b, a.imag / b);
      case 'cc':
        return complex(a.real / b.real, a.imag / b.imag);
      case 'rv':
      case 'cv':
        return {
          ...vecMap(b, b => _div(a, b)),
          var: promotion(a, b),
        };
      case 'vr':
      case 'vc':
        return {
          ...vecMap(a, a => _div(a, b)),
          var: promotion(a, b),
        };
      case 'rm':
      case 'cm':
        return {
          ...matMap(b, b => _div(a, b)),
          var: promotion(a, b),
        };
      case 'mr':
      case 'mc':
        return {
          ...matMap(a, a => _div(a, b)),
          var: promotion(a, b),
        };
      case 'vv':
        assertVec(a, b);
        return {
          ...vecMap(a, (a, i) => div(a, b.vec[i])),
          var: promotion(a, b),
        };
      case 'vm':
        throw new Error('not supported, vm');
      case 'mm':
        assertMat(a, b);
        return {
          ...matMap(a, (a, i, j) => div(a, b.mat[i][j])),
          var: promotion(a, b),
        };
      default:
        throw new Error('not reachable ' + k);
    }
  }

  function pow(base, exp) {
    switch (kindOf(base)) {
      case 'r': return base ** exp;
      case 'c':
        return complex(base.real ** exp, base.imag ** exp);
      case 'v':
        return vecMap(base, (v) => _pow(v, exp));
      case 'm':
        return matMap(base, (v) => _pow(v, exp));
      default:
        throw new TypeError();
    }
  }

  function log(a, base) {
    throw new Error('not implemented');
  }

  function exp(a, base) {
    throw new Error('not implemented');
  }

  function mod(a, b) {
    if (arguments.length === 1) {
      return c => mod(c, a);
    }

    const aKind = kindOf(a);
    const bKind = kindOf(b);
    const k = aKind + bKind;

    switch (k) {
      case 'rr':
        return a % b;
      case 'rc':
        return complex(a % b.real, a % b.imag);
      case 'cr':
        return complex(a.real % b, a.imag % b);
      case 'cc':
        return complex(a.real % b.real, a.imag % b.imag);
      case 'rv':
      case 'cv':
        return {
          ...vecMap(b, b => mod(a, b)),
          var: promotion(a, b),
        };
      case 'vr':
      case 'vc':
        return {
          ...vecMap(a, a => mod(a, b)),
          var: promotion(a, b),
        };
      case 'rm':
      case 'cm':
        return {
          ...matMap(b, b => mod(a, b)),
          var: promotion(a, b),
        };
      case 'mr':
      case 'mc':
        return {
          ...matMap(a, a => mod(a, b)),
          var: promotion(a, b),
        };
      case 'vv':
        assertVec(a, b);
        return {
          ...vecMap(a, (a, i) => mod(a, b.vec[i])),
          var: promotion(a, b),
        };
      case 'vm':
        throw new Error('not supported');
      case 'mm':
        assertMat(a, b);
        return {
          ...matMap(a, (a, i, j) => mod(a, b.mat[i][j])),
          var: promotion(a, b),
        };
      default:
        throw new Error('not reachable ' + k);
    }
  }

  function inv(a) {
    if (arguments.length === 0) {
      throw new Error('inv requires at least one argument');
    }

    switch (kindOf(a)) {
      case 'r':
        return 1 / a;
      case 'c':
        return complex(1 / a.real, 1 / a.imag);
      case 'v':
        return vecMap(a, (v) => _inv(v));
      case 'm':
        return matMap(a, (v) => _inv(v));
      default:
        throw new TypeError();
    }
  }

  return { add, sub, div, mul, log, exp, pow, mod, inv };
}());

export const complex = (function () {
  const complex = (real, imag) => {
    return { kind: 'c', real, imag };
  }

  complex.createMagAngle = (magnitude, angle) => {
    const real = magnitude * Math.cos(angle);
    const imag = magnitude * Math.sin(angle);
    return complex(real, imag);
  }

  complex.magnitude = (c) => {
    return Math.sqrt(c.real * c.real + c.imag * c.imag);
  };

  complex.phase = (c) => {
    return Math.atan2(c.imag, c.real);
  };

  complex.conj = (c) => {
    return complex(c.real, -c.imag);
  };

  complex.real = (c) => {
    return typeof c === 'number' ? c : c.real;
  };

  complex.imag = (c) => {
    return c.imag;
  };

  return complex;
}());

export const vector = (function () {
  const vector = n => (...vec) => {
    if (n == null) {
      n = vec.length;
    } else if (n !== vec.length) {
      throw new TypeError(`${n} is not equal to ${vec.length}`)
    }

    if (n === 0) return { kind: 'v', var: '0', n, vec: [] };
    return typeof vec[0] === 'number'
      ? ({ kind: 'v', var: 'r', n, vec })
      : ({ kind: 'v', var: 'c', n, vec });
  }

  vector.zeros = length => vector(length).apply(null, Array(length).fill(0));

  vector.ones = length => vector(length).apply(null, Array(length).fill(1));

  vector.basis = (length, index) => {
    const vec = Array(length).fill(0)
    vec[index] = 1
    return vector(length).apply(null, vec);
  };

  vector.size = (v) => v.n;

  vector.norm = (v) => {
    const sumOfSquares = v.vec.reduce((sum, element) => {
      if (typeof element === 'number') {
        return sum + element * element;
      } else {
        // Complex element: |z|² = real² + imag²
        return sum + element.real * element.real + element.imag * element.imag;
      }
    }, 0);
    return Math.sqrt(sumOfSquares);
  };

  vector.unit = (v) => {
    const norm = vector.norm(v);
    if (norm === 0) return v; // Avoid division by zero
    return vecMap(v, element => {
      if (typeof element === 'number') {
        return element / norm;
      } else {
        // Complex division by real scalar
        return complex(element.real / norm, element.imag / norm);
      }
    });
  };

  vector.cross2d = (a, b) => {
    if (a.n !== 2 || b.n !== 2) throw TypeError();
    const av = a.vec, bv = b.vec;
    return av[0] * bv[1] - av[1] * bv[0]
  }

  vector.cross3d = (a, b) => {
    if (a.n !== 3 || b.n !== 3) throw new TypeError();
    const [ax, ay, az] = a.vec;
    const [bx, by, bz] = b.vec;
    return vector(3)(
      ay * bz - az * by,
      az * bx - ax * bz,
      ax * by - ay * bx,
    )
  };

  vector.dot = (a, b) => {
    assertVec(a, b);
    return a.vec.reduce((sum, aElement, i) => {
      const bElement = b.vec[i];
      if (typeof aElement === 'number' && typeof bElement === 'number') {
        return sum + aElement * bElement;
      } else if (typeof aElement === 'number') {
        // a is real, b is complex: a * b = a * (real + imag*i)
        return sum + aElement * bElement.real + aElement * bElement.imag;
      } else if (typeof bElement === 'number') {
        // a is complex, b is real: conj(a) * b = (real - imag*i) * b
        return sum + aElement.real * bElement;
      } else {
        // Both complex: conj(a) * b = (real1 - imag1*i) * (real2 + imag2*i)
        return sum + aElement.real * bElement.real + aElement.imag * bElement.imag;
      }
    }, 0);
  };

  vector.get = (v, i) => v.vec[i];

  vector.set = (v, i, value) => {
    const newVec = [...v.vec];
    newVec[i] = value;

    // Determine new var type based on the updated vector
    let newVar = v.var;
    if (typeof value !== 'number' && newVar === 'r') {
      // Setting complex value in real vector promotes to complex
      newVar = 'c';
    }

    return {
      kind: 'v',
      var: newVar,
      n: v.n,
      vec: newVec
    };
  };

  return vector;
}());

export const matrix = (function () {
  const unsafe_create_internal = (k, n, m, mat) => {
    return { kind: 'm', var: k, n, m, mat };
  };

  const matrix = (n, m) => (...mat) => {
    if (n == null) {
      n = mat.length
    } else if (n !== mat.length) {
      throw new TypeError(`${n} is not equal to ${mat.length}`)
    }

    if (n === 0) return { kind: 'm', var: '0', n, m: 0, mat: [] };

    if (m == null) {
      m = mat[0].length;
    } else if (m !== mat[0].length) {
      throw new TypeError(`${m} is not equal to ${mat[0].length}`)
    }

    if (m === 0) return { kind: 'm', var: '0', n, m, mat: [] };

    return typeof mat[0][0] === 'number'
      ? ({ kind: 'm', var: 'r', n, m, mat })
      : ({ kind: 'm', var: 'c', n, m, mat });
  }

  matrix.zeros = (rows, cols) => {
    const data = Array(rows).fill().map(() => Array(cols).fill(0));
    return unsafe_create_internal('r', rows, cols, data);
  }

  matrix.ones = (rows, cols) => {
    const data = Array(rows).fill().map(() => Array(cols).fill(1));
    return unsafe_create_internal('r', rows, cols, data);
  }

  matrix.identity = (size) => {
    const data = Array(size).fill().map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) data[i][i] = 1;
    return unsafe_create_internal('r', size, size, data);
  }

  matrix.diag = (size, values) => {
    if (values.length !== size) throw new TypeError();
    const data = Array(size).fill().map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) data[i][i] = values[i];
    return matrix().apply(null, data);
  };

  matrix.row = (vec) =>
    unsafe_create_internal(vec.var, 1, vec.n, [vec.vec]);

  matrix.col = (vec) =>
    unsafe_create_internal(vec.var, vec.n, 1, vec.vec.map(x => [x]));

  matrix.mul = (a, b) => {
    if (a.m !== b.n) {
      throw new Error('Invalid matrix dimensions for multiplication');
    }

    const mat = Array(a.n).fill().map(() => Array(b.m).fill(0));

    for (let i = 0; i < a.n; i++) {
      for (let j = 0; j < b.m; j++) {
        for (let k = 0; k < a.m; k++) {
          mat[i][j] = _add(
            mat[i][j], _mul(a.mat[i][k], b.mat[k][j]));
        }
      }
    }

    return matrix(a.n, b.m)(...mat);
  };

  matrix.minor = (a, row, col) => {
    const newMat = [];
    for (let i = 0; i < a.n; i++) {
      if (i === row) continue;
      const newRow = [];
      for (let j = 0; j < a.m; j++) {
        if (j === col) continue;
        newRow.push(a.mat[i][j]);
      }
      newMat.push(newRow);
    }
    return unsafe_create_internal(a.var, a.n-1, a.m-1, newMat);
  };

  matrix.cofactor = (a, row, col) => {
    const sign = (row + col) % 2 === 0 ? 1 : -1;
    const minorMat = matrix.minor(a, row, col);
    return _mul(sign, matrix.det(minorMat));
  };

  matrix.det = (a) => {
    if (a.n !== a.m) {
      throw new Error('Determinant only defined for square matrices');
    }

    const n = a.n;

    if (n === 1) {
      return a.mat[0][0];
    }

    if (n === 2) {
      return _sub(
        _mul(a.mat[0][0], a.mat[1][1]),
        _mul(a.mat[0][1], a.mat[1][0])
      );
    }

    // Cofactor expansion along first row
    let det = 0;
    for (let j = 0; j < n; j++) {
      const element = a.mat[0][j];
      const cof = matrix.cofactor(a, 0, j);
      det = _add(det, _mul(element, cof));
    }
    return det;
  };

  matrix.transpose = (a) => {
    const transposedMat = Array(a.m).fill().map(() => Array(a.n));
    for (let i = 0; i < a.n; i++) {
      for (let j = 0; j < a.m; j++) {
        transposedMat[j][i] = a.mat[i][j];
      }
    }
    return unsafe_create_internal(a.var, a.m, a.n, transposedMat);
  };

  matrix.adjugate = (a) => {
    if (a.n !== a.m) {
      throw new Error('Adjugate only defined for square matrices');
    }

    const n = a.n;
    const cofactorMat = Array(n).fill().map(() => Array(n));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        cofactorMat[i][j] = matrix.cofactor(a, i, j);
      }
    }

    const cofactorMatrix = unsafe_create_internal(a.var, a.n, a.m, cofactorMat);
    return matrix.transpose(cofactorMatrix);
  };

  matrix.diagOf = (a) => {
    const minDim = Math.min(a.n, a.m);
    const diag = [];
    for (let i = 0; i < minDim; i++) {
      diag.push(a.mat[i][i]);
    }
    return vector()(...diag);
  };

  matrix.norm = (a) => {
    // https://en.wikipedia.org/wiki/Matrix_norm
    let sumOfSquares = 0;
    for (let i = 0; i < a.n; i++) {
      for (let j = 0; j < a.m; j++) {
        const element = a.mat[i][j];
        if (typeof element === 'number') {
          sumOfSquares += element * element;
        } else {
          // Complex element: |z|² = real² + imag²
          sumOfSquares += element.real * element.real + element.imag * element.imag;
        }
      }
    }
    return Math.sqrt(sumOfSquares);
  };

  matrix.trace = (a) => {
    if (a.n !== a.m) {
      throw new Error('Trace only defined for square matrices');
    }
    let trace = 0;
    for (let i = 0; i < a.n; i++) {
      trace = _add(trace, a.mat[i][i]);
    }
    return trace;
  };

  matrix.eigenDecomposition = (a) => {
    // https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix
    throw new Error('not implemented');
  };

  matrix.rows = (a) => a.n;

  matrix.cols = (a) => a.m;

  matrix.get = (a, i, j) => a.mat[i][j];

  matrix.set = (a, i, j, value) => {
    const newMat = a.mat.map(row => [...row]);
    newMat[i][j] = value;
    return unsafe_create_internal(a.var, a.n, a.m, newMat);
  };

  matrix.getRow = (a, index) => {
    return vector()(...a.mat[index]);
  };

  matrix.setRow = (a, index, v) => {
    const newMat = a.mat.map(row => [...row]);
    newMat[index] = [...v.vec];
    return unsafe_create_internal(a.var, a.n, a.m, newMat);
  };

  matrix.getCol = (a, index) => {
    const col = [];
    for (let i = 0; i < a.n; i++) {
      col.push(a.mat[i][index]);
    }
    return vector()(...col);
  };

  matrix.setCol = (a, index, v) => {
    const newMat = a.mat.map(row => [...row]);
    for (let i = 0; i < a.n; i++) {
      newMat[i][index] = v.vec[i];
    }
    return unsafe_create_internal(a.var, a.n, a.m, newMat);
  };

  return matrix;
}());

export const unit = {
  m: matrix,
  v: vector,
  c: complex,
};

function _neg(value) {
  switch (kindOf(value)) {
    case 'r': return -value;
    case 'c': return complex(-value.real, -value.imag);
    case 'v': return vecMap(value, v => _neg(v));
    case 'm': return matMap(value, v => _neg(v));
    default:
      console.error(value);
      throw new Error('unknown');
  }
}

function _sub(a, b) {
  if (arguments.length === 1) {
    return b => _add(a, _neg(b))
  }
  return _add(a, _neg(b));
}

function _add(a, b) {
  if (arguments.length === 1) {
    return (c) => _add(a, c);
  }

  const aKind = kindOf(a);
  const bKind = kindOf(b);
  const k = aKind + bKind;

  switch (k) {
    case 'rr':
      return a + b;
    case 'rc':
      return complex(b.real + a, b.imag);
    case 'cr':
      return complex(a.real + b, a.imag);
    case 'cc':
      return complex(a.real + b.real, a.imag + b.imag);
    default:
      throw new Error(`Invalid operands for add: ${aKind}, ${bKind}`);
  }
}

function _mul(a, b) {
  if (arguments.length === 1) {
    return (c) => _mul(a, c);
  }

  const aKind = kindOf(a);
  const bKind = kindOf(b);
  const k = aKind + bKind;

  switch (k) {
    case 'rr':
      return a * b;
    case 'rc':
      return complex(b.real * a, b.imag * a);
    case 'cr':
      return complex(a.real * b, a.imag * b);
    case 'cc':
      return complex(
        a.real * b.real - a.imag * b.imag,
        a.real * b.imag + a.imag * b.real,
      );
    case 'mm':
      return matrix.mul(a, b);
    default:
      throw new Error(`Invalid operands for mul: ${aKind}, ${bKind}`);
  }
}

function _inv(value) {
  switch (kindOf(value)) {
    case 'r':
      return 1/value;
    case 'c': {
      const denom
        = value.real * value.real
        + value.imag * value.imag;
      return complex(value.real / denom, -value.imag / denom);
    }
    case 'm': {
      const det = matrix.det(value);
      if (det === 0) {
        throw new Error('Matrix is singular and cannot be inverted');
      }
      return el.mul(_inv(det), matrix.adjugate(value));
    }
    default:
      console.error(value);
      throw new Error('unknown');
  }
}

function _div(a, b) {
  if (arguments.length === 1) {
    return (b) => _mul(a, _inv(b));
  }

  return _mul(a, _inv(b));
}

function _log(a, base = null) {
  // Complex logarithm: log(z) = log|z| + i*arg(z)
  // https://en.wikipedia.org/wiki/Complex_logarithm

  // Matrix logarithm using eigendecomposition: log(A) = Q * log(Λ) * Q^(-1)
  // https://en.wikipedia.org/wiki/Logarithm_of_a_matrix

  const k = base == null ? 'r' : kindOf(base);

  switch (k) {
    case 'r': switch (kindOf(a)) {
      case 'r': return base == null ? Math.log(a) : Math.log(a) / Math.log(base);
      case 'c': {
        if (base == null) {
          // Natural logarithm: log(z) = log|z| + i*arg(z)
          const r = Math.log(complex.magnitude(a));
          const i = complex.phase(a);
          return complex(r, i);
        } else {
          // Arbitrary base: log_base(z) = ln(z) / ln(base)
          const naturalLog = _log(a);
          const logBase = Math.log(base);
          return complex(naturalLog.real / logBase, naturalLog.imag / logBase);
        }
      }
      case 'm': {
        assertSquareMat(a);
        if (base == null) {
          // Natural matrix logarithm
          const {eigenvalues, eigenvectors} = matrix.eigenDecomposition(a);
          const logEigenvalues = eigenvalues.vec.map(λ => _log(λ));
          const logDiag = matrix.diag(logEigenvalues);
          return matrix.mul(matrix.mul(eigenvectors, logDiag), _inv(eigenvectors));
        } else {
          // Arbitrary base matrix logarithm: log_base(A) = ln(A) / ln(base)
          const naturalLog = _log(a);
          const logBase = Math.log(base);
          return el.mul(_inv(logBase), naturalLog);
        }
      }
      default: throw new Error('log not supported for this type');
    }
    case 'c': switch (kindOf(a)) {
      case 'r': {
        // log_complexBase(real) = ln(real) / ln(complexBase)
        const naturalLog = Math.log(a);
        const logBase = _log(base);
        return _div(naturalLog, logBase);
      }
      case 'c': {
        // log_complexBase(complex) = ln(complex) / ln(complexBase)
        const naturalLog = _log(a);
        const logBase = _log(base);
        return _div(naturalLog, logBase);
      }
      case 'm': {
        assertSquareMat(a);
        // log_complexBase(matrix) = ln(matrix) / ln(complexBase)
        const naturalLog = _log(a);
        const logBase = _log(base);
        return el.mul(_inv(logBase), naturalLog);
      }
      default: throw new Error('log not supported for this type');
    }
    case 'm':
      throw new Error('Matrix base logarithm not supported');
    default:
      throw new Error('log not supported for this type');
  }
}

function _exp(a, base = null) {
  // Matrix exponential using eigendecomposition: e^A = Q * e^Λ * Q^(-1)
  // https://en.wikipedia.org/wiki/Matrix_exponential

  // Complex exponential: e^(a+bi) = e^a * (cos(b) + i*sin(b))
  // https://en.wikipedia.org/wiki/Exponential_function#Complex_exponential

  const k = base == null ? 'r' : kindOf(base);

  switch (k) {
    case 'r': switch (kindOf(a)) {
      case 'r': return base == null ? Math.exp(a) : base ** a;
      case 'c': {
        const { real, imag } = a;
        const realPart = _exp(real, base);
        const theta = base == null ? imag : imag * Math.log(base);
        return complex(realPart * Math.cos(theta), realPart * Math.sin(theta));
      }
      case 'm': {
        assertSquareMat(a);
        const {eigenvalues, eigenvectors} = matrix.eigenDecomposition(a);
        const expEigenvalues = eigenvalues.vec.map(λ => _exp(λ, base));
        const expDiag = matrix.diag(expEigenvalues);
        return matrix.mul(matrix.mul(eigenvectors, expDiag), _inv(eigenvectors));
      }
      default: throw new Error('exp not supported for this type');
    }
    case 'c': switch (kindOf(a)) {
      case 'r': return _pow(base, a);
      case 'c': return _exp(_mul(a, _log(base)));
      case 'm': {
        assertSquareMat(a);
        const {eigenvalues, eigenvectors} = matrix.eigenDecomposition(a);
        const expEigenvalues = eigenvalues.vec.map(λ => _exp(λ, base));
        const expDiag = matrix.diag(expEigenvalues);
        return matrix.mul(matrix.mul(eigenvectors, expDiag), _inv(eigenvectors));
      }
      default: throw new Error('exp not supported for this type');
    }
    case 'm': switch (kindOf(a)) {
      case 'r': return _pow(base, a);
      case 'c': return _exp(_mul(a, _log(base)));
      case 'm': throw new Error('unsure')
      default: throw new Error('undefined');
    }
    default:
      throw new Error('exp not supported for this type');
  }
}

function _pow(base, exponent) {
  switch (kindOf(base)) {
    case 'r': {
      return Math.pow(base, exponent);
    }
    case 'c': {
      // Complex exponentiation using polar form: z^w = r^w * e^(i*w*θ)
      const magnitude = complex.magnitude(base);
      const phase = complex.phase(base);
      const newMagnitude = Math.pow(magnitude, exponent);
      const newPhase = phase * exponent;
      return complex.createMagAngle(newMagnitude, newPhase);
    }
    case 'm': {
      assertSquareMat(base);

      // Handle integer exponents with repeated multiplication
      if (Number.isInteger(exponent)) {
        if (exponent === 0) return matrix.identity(base.n);
        if (exponent === 1) return base;
        if (exponent < 0) return _pow(_inv(base), -exponent);

        // Positive integer: use exponentiation by squaring
        let result = matrix.identity(base.n);
        let currentPower = base;
        let exp = exponent;

        while (exp > 0) {
          if (exp % 2 === 1) result = matrix.mul(result, currentPower);
          currentPower = matrix.mul(currentPower, currentPower);
          exp = Math.floor(exp / 2);
        }
        return result;
      }

      // Non-integer exponents need eigendecomposition
      const {eigenvalues, eigenvectors} = matrix.eigenDecomposition(base);
      const powEigenvalues = eigenvalues.vec.map(λ => _pow(λ, exponent));
      const powDiag = matrix.diag(powEigenvalues);
      return matrix.mul(matrix.mul(eigenvectors, powDiag), _inv(eigenvectors));
    }
    default:
      throw new Error('pow not supported for this type');
  }
}

function _nrt(value, n) {
  return _pow(value, 1/n);
}

function _equals(a, b) {
  if (arguments.length === 1) {
    return b => _equals(a, b);
  }

  if (typeof a === 'number' && typeof b === 'number') return a === b;
  if (typeof a === 'number' && b.kind === 'c') return a === b.real && b.imag === 0;
  if (typeof b === 'number' && a.kind === 'c') return _equals(b, a);
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case 'c': return a.real === b.real && a.imag === b.imag;
    case 'v':
      return a.n === b.n && a.vec.every((element, i) => _equals(element, b.vec[i]));
    case 'm':
      return a.n === b.n && a.m === b.m && a.mat.every((row, i) => row.every((element, j) => _equals(element, b.mat[i][j])));
  }
}

export const euler = Math.E;

export const add = _add;
export const sub = _sub;
export const mul = _mul;
export const div = _div;
export const inv = _inv;
export const neg = _neg;
export const log = _log;
export const exp = _exp;

// nth root
export const nrt = _nrt

// power
export const pow = _pow;

export const sqrt = (v) => _nrt(v, 2);

export const equals = _equals;
