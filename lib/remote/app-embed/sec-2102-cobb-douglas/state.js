/**
 * @import { Uniforms, Buffers } from './type.ts';
 * @import { UniformAdapter } from '@base/platform/webgpu/buffers.js';
 */
import { makeCanvasText } from '@base/platform/webgpu/text.js';
import { perspective, createOrbitCamera } from './camera.js';

export class CurveDomain {
  x = { min: 0, max: 1000, step: 100 };
  z = { min: 0, max: 1000, step: 100 };

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

  rho = 0;
  zeta = 1;
  alpha = 2/3;

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
    if (this.rho === 0) {
      const k = capital ** (1 - this.alpha);
      const l = labour ** this.alpha;
      return this.technology * k * l;
    } else {
      const k = ((1 - this.alpha) * capital) ** this.rho;
      const l = (this.alpha * labour) ** this.rho;
      return this.technology * ((k + l) ** (this.zeta / this.rho));
    }
  }
}

export class CameraState {
  ROTATION_SPEED = 0.4;
  RADIUS = 1500;
  HEIGHT = 800; // 1500;

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
  production = new CESProductionFunction();
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

  /** @param {CameraState} camera */
  constructor(camera) {
    this.camera = camera;
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
    meshRender.update('productionMax', cb.output(mesh.x.max, mesh.z.max));
    meshRender.update('alpha', cb.alpha);
    meshRender.update('technology', cb.technology);
    meshRender.update('rho', cb.rho);
    meshRender.update('zeta', cb.zeta);
    meshRender.updateBuffer(device);

    gridRender.update('world', world);
    gridRender.update('viewProj', viewProjection);
    gridRender.updateBuffer(device);
  }
}
