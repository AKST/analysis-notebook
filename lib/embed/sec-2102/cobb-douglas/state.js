/**
 * @import { Uniforms, Buffers } from './type.ts';
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
    return xQuads * zQuads * 6; // 6 vertices per quad
  }

  /**
   * Offset in render
   */
  get offset() {
    return [-this.x.max / 2, 0, -this.z.max / 2];
  }

  get bufferSize() {
    return this.totalVertices * 2 * 4; // 2 floats per vertex, 4 bytes per float
  }

  /** @param {GPUDevice} device */
  createVertixMesh(device) {
    return device.createBuffer({
      size: this.bufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
    });
  }
}

export class CobbDouglas {
  alpha = 2/3;
  technology = 1;

  /**
   * @param {number} labour
   * @param {number} capital
   */
  output(labour, capital) {
    return this.technology * (labour ** this.alpha) * (capital ** (1 - this.alpha));
  }
}

export class CameraState {
  ROTATION_SPEED = 0.4;
  RADIUS = 1500;
  HEIGHT = 1500;

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

  /** @param {number} t */
  updateClock(t) {
    //this.cameraAngle = (8 + t) * this.ROTATION_SPEED;
    this.cameraAngle = t * this.ROTATION_SPEED;
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
  cobbDouglas = new CobbDouglas();
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
    const { curveDomain: mesh, cobbDouglas: cb, camera } = this;
    const { viewMatrix, projectionMatrix } = camera;
    const viewProjection = projectionMatrix.multiply(viewMatrix);
    const world = new DOMMatrix()

    text.update('world', world);
    text.update('viewProj', viewProjection);
    text.updateBuffer(device);

    meshRender.update('world', world);
    meshRender.update('viewProj', viewProjection);
    meshRender.update('alpha', cb.alpha);
    meshRender.update('technology', cb.technology);
    meshRender.update('productionMax', cb.output(mesh.x.max, mesh.z.max));
    meshRender.update('offset', mesh.offset);
    meshRender.updateBuffer(device);

    gridRender.update('world', world);
    gridRender.update('viewProj', viewProjection);
    gridRender.updateBuffer(device);
  }
}
