/**
 * Simple camera and matrix utilities using DOMMatrix for WebGPU
 * DOMMatrix is column-major, which matches WebGPU's expectations
 *
 * @typedef {[number, number, number]} V3
 */

/**
 * Create perspective projection matrix
 * @param {number} fov - field of view in radians
 * @param {number} aspect - aspect ratio
 * @param {number} near - near clipping plane
 * @param {number} far - far clipping plane
 * @returns {DOMMatrix}
 */
export function perspective(fov, aspect, near, far) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
  const ri = 1.0 / (near - far);

  // DOMMatrix constructor takes column-major values
  return new DOMMatrix([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * ri, -1,
    0, 0, near * far * ri * 2, 0
  ]);
}

/**
 * Create a lookAt view matrix
 * @param {V3} eye - camera position [x, y, z]
 * @param {V3} target - look at point [x, y, z]
 * @param {V3} up - up vector [x, y, z]
 * @returns {DOMMatrix}
 */
export function lookAt(eye, target, up) {
  const zAxis = normalize(subtract(eye, target));
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = cross(zAxis, xAxis);

  // DOMMatrix constructor takes column-major values
  return new DOMMatrix([
    xAxis[0], yAxis[0], zAxis[0], 0,
    xAxis[1], yAxis[1], zAxis[1], 0,
    xAxis[2], yAxis[2], zAxis[2], 0,
    -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1
  ]);
}

/**
 * Create a camera that orbits around a target point
 * @param {number} radius - distance from target
 * @param {number} angleY - rotation around Y axis (radians)
 * @param {number} height - camera height
 * @param {V3} target - point to look at [x, y, z]
 * @returns {DOMMatrix} view matrix
 */
export function createOrbitCamera(radius, angleY, height, target = [0, 0, 0]) {
  const camX = target[0] + radius * Math.sin(angleY);
  const camY = target[1] + height;
  const camZ = target[2] + radius * Math.cos(angleY);
  return lookAt([camX, camY, camZ], target, [0, 1, 0]);
}

/**
 * @param {V3} a
 * @param {V3} b
 * @returns {V3}
 */
function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/**
 * @param {V3} a
 * @param {V3} b
 * @returns {V3}
 */
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

/**
 * @param {V3} a
 * @param {V3} b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * @param {V3} v
 * @returns {V3}
 */
function normalize(v) {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : v;
}
