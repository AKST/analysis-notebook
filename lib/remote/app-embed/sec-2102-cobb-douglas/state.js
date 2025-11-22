/**
 * @import { Uniforms, Buffers } from './type.ts';
 * @import { UniformAdapter } from '@base/platform/webgpu/buffers.js';
 */
import { makeCanvasText } from '@base/platform/webgpu/text.js';
import { perspective, createOrbitCamera } from './camera.js';

export class CurveDomain {
  x = { min: 0, max: 1000, step: 50 };
  y = { min: 0, max:  500, step: 50 };
  z = { min: 0, max: 1000, step: 50 };

  get quads() {
    const xQuads = (this.x.max - this.x.min) / this.x.step;
    const zQuads = (this.z.max - this.z.min) / this.z.step;
    return [xQuads, zQuads];
  }

  get totalVertices() {
    const [xQuads, zQuads] = this.quads;
    return xQuads * zQuads * 6;
  }

  /**
   * Position Offset in rendering output to make
   * sure the middle of the render in placed at
   * the origin (0,0).
   */
  get offset() {
    return [-this.x.max / 2, 0, -this.z.max / 2];
  }

  get bufferSize() {
    return this.totalVertices * 2 * 4;
  }

  get gridSize() {
    const gridSpacing = this.x.step;
    const xLines = Math.floor((this.x.max - this.x.min) / gridSpacing) + 1;
    const zLines = Math.floor((this.z.max - this.z.min) / gridSpacing) + 1;
    const totalGridLines = xLines + zLines;
    return totalGridLines * 2;
  }
}

export class CESProductionFunction {
  #technology = 30;
  alpha = 2/3;

  /**
   * @param {number} rho
   * @param {number} xi
   */
  constructor(rho, xi) {
    this.rho = rho;
    this.xi = xi;
  }

  /**
   * Dampens the value of technology until a proper
   * scaling mechanism is introduced to the renderer.
   */
  technologyDampener = 50;

  set technology(value) {
    this.#technology = value;
  }

  get technology() {
    return this.#technology / this.technologyDampener;
  }

  /**
   * @param {number} labour
   * @param {number} capital
   */
  output(labour, capital) {
    // Add small epsilon to avoid division by zero for negative rho
    const eps = 1e-6;
    const l = Math.max(labour, eps);
    const k = Math.max(capital, eps);

    if (this.rho === 0) {
      return this.technology * (k ** (1 - this.alpha)) * (l ** this.alpha);
    } else {
      const kTerm = (1 - this.alpha) * (k ** this.rho);
      const lTerm = this.alpha * (l ** this.rho);
      return this.technology * ((kTerm + lTerm) ** (this.xi / this.rho));
    }
  }

  /**
   * Compute maximum output analytically based on CES properties
   * @param {{ min: number, max: number }} labourRange
   * @param {{ min: number, max: number }} capitalRange
   */
  computeMaxOutput(labourRange, capitalRange) {
    const eps = 1e-6;

    if (this.rho === 0) {
      return this.output(labourRange.max, capitalRange.max);
    }


    if (this.rho < 0) {
      const outerExp = this.xi / this.rho;

      if (outerExp < 0) {
        return this.output(labourRange.max, capitalRange.max);
      } else {
        const lMin = Math.max(labourRange.min, eps);
        const kMin = Math.max(capitalRange.min, eps);
        return this.output(lMin, kMin);
      }
    }

    return this.output(labourRange.max, capitalRange.max);
  }
}

export class CameraState {
  ROTATION_SPEED = 0.4;
  RADIUS = 1200;
  HEIGHT = 600; // 800; // 1500;

  fov = 1.1;
  near = 1;
  far = 10000;
  cameraAngle = 0;

  /**
   * @param {{ width: number, height: number }} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
  }

  /**
   * @param {number} t
   */
  updateClock(t) {
    this.cameraAngle = (8 + t) * this.ROTATION_SPEED;
  }

  get projectionMatrix() {
    const aspect = this.canvas.width / this.canvas.height;
    return perspective(this.fov, aspect, this.near, this.far);
  }

  get viewMatrix(){
    return createOrbitCamera(
      this.RADIUS,
      this.cameraAngle,
      this.HEIGHT,
      [0, 0, 0],
    );
  }
}

export class SceneState {
  curveDomain = new CurveDomain();

  labels = {
    capital: makeCanvasText('Capital', {
      fontSize: 64,
      font: 'Helvetica',
      fillStyle: 'white'
    }),
    labour: makeCanvasText('Labour', {
      fontSize: 64,
      font: 'Helvetica',
      fillStyle: 'white'
    })
  };

  /**
   * @param {CameraState} camera
   * @param {CESProductionFunction} production
   */
  constructor(camera, production) {
    this.camera = camera;
    this.production = production;
  }

  /**
   * @param {GPUDevice} device
   * @param {Uniforms} uniforms
   */
  updateComputeUniforms(device, { meshGen, gridGen }) {
    const { curveDomain: d } = this;
    meshGen.update('min', [d.x.min, d.z.min]);
    meshGen.update('step', [d.x.step, d.z.step]);
    meshGen.update('count', d.quads);
    meshGen.updateBuffer(device);

    gridGen.update('min', [d.x.min, d.z.min]);
    gridGen.update('max', [d.x.max, d.z.max]);
    gridGen.update('spacing', 100);
    gridGen.update('offset', [d.offset[0], d.offset[2]]);
    gridGen.updateBuffer(device);
  }

  /**
   * @param {GPUDevice} device
   * @param {Uniforms} uniforms
   */
  updateRenderUniforms(device, { meshRender, text, gridRender }) {
    const { curveDomain: mesh, production: cb, camera } = this;
    const { viewMatrix, projectionMatrix } = camera;
    const viewProjection = projectionMatrix.multiply(viewMatrix);
    const world = new DOMMatrix()

    text.update('world', world);
    text.update('viewProj', viewProjection);
    text.updateBuffer(device);

    meshRender.update('world', world);
    meshRender.update('viewProj', viewProjection);
    meshRender.update('offset', mesh.offset);
    meshRender.update('productionMax', cb.computeMaxOutput(mesh.x, mesh.z));
    meshRender.update('prodScale', 500);
    meshRender.update('alpha', cb.alpha);
    meshRender.update('technology', cb.technology);
    meshRender.update('rho', cb.rho);
    meshRender.update('zeta', cb.xi);
    meshRender.updateBuffer(device);

    gridRender.update('world', world);
    gridRender.update('viewProj', viewProjection);
    gridRender.updateBuffer(device);
  }
}
