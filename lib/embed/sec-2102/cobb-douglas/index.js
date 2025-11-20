import { UniformAdapter } from '@base/platform/webgpu/uniform.js';
import { perspective, createOrbitCamera } from './camera.js';

/**
 * @typedef {{
 *   meshRender: UniformAdapter,
 *   meshGen: UniformAdapter,
 * }} Uniforms
 * @typedef {{
 *   meshVertices: GPUBuffer,
 * }} Buffers
 */

class MeshState {
  x = { min: 0, max: 1000, step: 100 };
  z = { min: 0, max: 1000, step: 100 };

  get worldMatrix() {
    return new DOMMatrix()
      .scale(this.x.max, 1, this.z.max);
  }

  get triangleCount() {
    const trianglePoints = 3, triangles = 2;
    const xTriangles = (this.x.max - this.x.min) / this.x.step;
    const zTriangles = (this.z.max - this.z.min) / this.z.step;
    return [
      xTriangles * trianglePoints * triangles,
      zTriangles * trianglePoints * triangles,
    ]
  }

  /**
   * Offset in render
   */
  get offset() {
    return [this.x.max / 2, 0, this.z.max / 2];
  }

  get bufferSize() {
    const [x, y] = this.triangleCount, elemSize = 2 * 8;
    return x * y * elemSize;
  }

  /** @param {GPUDevice} device @param {UniformAdapter} u */
  updateUniform(device, u) {
    u.update('xMin', this.x.min);
    u.update('xStep', this.x.step);
    u.update('zMin', this.z.min);
    u.update('zStep', this.z.step);
    u.updateBuffer(device);
  }

  /** @param {GPUDevice} device */
  createVertixMesh(device) {
    return device.createBuffer({
      size: this.bufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
    });
  }
}

class CobbDouglas {
  alpha = 2/3;
  technology = 1;

  /**
   * @param {number} labour
   * @param {number} capital
   */
  output(labour, capital) {
    return this.technology * (labour ** this.alpha) * (capital ** (1 -this.alpha));
  }
}

class ViewState {
  ROTATION_SPEED = 0.2;
  RADIUS = 1500;
  HEIGHT = 800;

  fov = 1.51;
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

class SceneState {
  cobbDouglas = new CobbDouglas();
  mesh = new MeshState();

  /** @param {ViewState} camera */
  constructor(camera) {
    this.camera = camera;
  }

  /**
   * @param {GPUDevice} device
   * @param {Uniforms} uniforms
   */
  updateComputeUniforms(device, { meshRender, meshGen }) {
    const { mesh, cobbDouglas: cb } = this;
    this.mesh.updateUniform(device, meshGen);
  }

  /**
   * @param {GPUDevice} device
   * @param {Uniforms} uniforms
   */
  updateRenderUniforms(device, { meshRender }) {
    const { mesh, cobbDouglas: cb, camera } = this;
    const { viewMatrix, projectionMatrix } = camera;
    const viewProjection = viewMatrix.multiply(projectionMatrix);

    meshRender.update('world', new DOMMatrix());
    meshRender.update('viewProj', viewProjection);
    meshRender.update('meshOffset', mesh.offset);
    meshRender.update('alpha', cb.alpha);
    meshRender.update('technology', cb.technology);
    meshRender.update('productionMax', cb.output(mesh.x.max, mesh.z.max));
  }
}

export async function main() {

  const { navigator, devicePixelRatio } = globalThis;
  const adapter = await navigator.gpu.requestAdapter();
  if (adapter == null) throw new Error('no gpu adapter');
  const device = await adapter.requestDevice();

  const format = navigator.gpu.getPreferredCanvasFormat();
  const [canvas, context, getTexture] = await getCanvas(devicePixelRatio, device, format);

  const camera = new ViewState(canvas);
  const scene = new SceneState(camera);

  device.pushErrorScope('validation');
  const uniforms = createUniforms(device);
  const buffers = createBuffers(device, scene);
  const pipelines = await createPipelines(device, format, scene, uniforms, buffers);

  {
    const computeEncoder = device.createCommandEncoder();
    const computePass = computeEncoder.beginComputePass();
    pipelines.compute(computePass);
    scene.updateComputeUniforms(device, uniforms);
    computePass.end();
    device.queue.submit([computeEncoder.finish()]);
  }

  requestAnimationFrame(function f(t) {
    const depthTexture = getTexture();
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    });

    camera.updateClock(t / 1000);
    scene.updateRenderUniforms(device, uniforms);
    pipelines.render(renderPass);
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(f);
  });


  const errorScope = await device.popErrorScope();
  if (errorScope) {
    console.error('GPU:',errorScope.message);
    console.info(errorScope);
  } else {
    console.log('done');
  }
}

/**
 * @param {GPUDevice} device
 * @param {GPUTextureFormat} format
 * @param {SceneState} scene
 * @param {Uniforms} uniforms
 * @param {Buffers} buffers
 */
async function createPipelines(device, format, scene, uniforms, buffers) {
  const shaderModule = await loadShader(device);

  const plCompute = device.createComputePipeline({
    layout: 'auto',
    compute: { module: shaderModule, entryPoint: 'generateMesh' },
  });

  const bgComputeUniform = device.createBindGroup({
    layout: plCompute.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniforms.meshGen.getBuffer(device) } },
    ],
  });

  const bgComputeBuffer = device.createBindGroup({
    layout: plCompute.getBindGroupLayout(1),
    entries: [
      { binding: 0, resource: { buffer: buffers.meshVertices } },
    ],
  });

  const plMesh = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'meshVertex',
      buffers: [{
        arrayStride: 2 * 4,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: 'float32x2',
        }],
      }],
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'meshFragment',
      targets: [{
        format,
      }],
    },
    primitive: {
      topology: 'triangle-list',
      cullMode: 'none',
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  })

  const bgMesh = device.createBindGroup({
    layout: plMesh.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniforms.meshRender.getBuffer(device) } },
    ],
  });

  return {
    /**
     * @param {GPUComputePassEncoder} pass
     */
    compute(pass) {
      pass.setPipeline(plCompute);
      pass.setBindGroup(0, bgComputeUniform);
      pass.setBindGroup(1, bgComputeBuffer);

      const [x, z] = scene.mesh.triangleCount;
      pass.dispatchWorkgroups(Math.ceil(x / 8), Math.ceil(z / 8));
    },

    /**
     * @param {GPURenderPassEncoder} pass
     */
    render(pass) {
      pass.setPipeline(plMesh);
      pass.setBindGroup(0, bgMesh);
      pass.setVertexBuffer(0, buffers.meshVertices);

      const [x, z] = scene.mesh.triangleCount;
      pass.draw(x * z)
    },
  };
}

/**
 * @param {GPUDevice} device
 */
function createUniforms(device) {
  const meshGen = UniformAdapter.create([
    { type: 'f32', init: 0, name: 'xMin' },
    { type: 'f32', init: 0, name: 'zMin' },
    { type: 'f32', init: 0, name: 'xStep' },
    { type: 'f32', init: 0, name: 'zStep' },
  ]);

  const meshRender = UniformAdapter.create([
    { type: 'mat4x4<f32>', name: 'world' },
    { type: 'mat4x4<f32>', name: 'viewProj' },
    { type: 'vec3<f32>', name: 'offset' },
    { type: 'f32', init: 0, name: 'alpha' },
    { type: 'f32', init: 0, name: 'technology' },
    { type: 'f32', init: 0, name: 'productionMax' },
    { type: 'f32', init: 0, name: '_padding' },
  ]);

  const uniforms = { meshGen, meshRender };
  return uniforms;
}

/**
 * @param {GPUDevice} device
 * @param {SceneState} scene
 * @returns {Buffers}
 */
function createBuffers(device, scene) {
  return {
    meshVertices: scene.mesh.createVertixMesh(device)
  };
}

/**
 * @param {GPUDevice} device
 */
async function loadShader(device) {
  const shaderSourceRes = await fetch('./shader.wgsl');
  const shaderSource = await shaderSourceRes.text();
  return device.createShaderModule({ code: shaderSource });
}

/**
 * @param {number} devicePixelRatio
 * @param {GPUDevice} device
 * @param {GPUTextureFormat} format
 * @returns {Promise<[
 *   HTMLCanvasElement,
 *   GPUCanvasContext,
 *   () => GPUTexture,
 * ]>}
 */
async function getCanvas(devicePixelRatio, device, format) {
  const canvas = document.createElement('canvas');

  /** @type {GPUTexture} */
  let depthTexture;

  const observer = new ResizeObserver((entries) => {
    for (const { contentRect: { width, height } } of entries) {
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }

    depthTexture = device.createTexture({
      size: { width: canvas.width, height: canvas.height },
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  });

  document.body.insertBefore(canvas, document.body.firstChild);
  observer.observe(document.body);

  await new Promise(r => setTimeout(() => r(undefined), 0));

  const context = canvas.getContext('webgpu');
  if (context == null) throw new Error();
  context.configure({
    device,
    format,
    alphaMode: 'premultiplied',
  });

  return [canvas, context, () => depthTexture];
}
