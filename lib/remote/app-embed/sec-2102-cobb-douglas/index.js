/**
 * @import { Textures, Uniforms, Buffers } from './type.ts';
 */
import { UniformAdapter, createContiguousArray } from '@base/platform/webgpu/buffers.js';
import { makeTextureFromCanvasText } from '@base/platform/webgpu/text.js';
import { perspective, createOrbitCamera } from './camera.js';
import { SceneState, CameraState } from './state.js';

function generateXzQuad() {
  return new Float32Array([
    +0.5, +0.5,
    +0.5, -0.5,
    -0.5, +0.5,

    -0.5, +0.5,
    +0.5, -0.5,
    -0.5, -0.5,
  ]);
}

/**
 * @param {{
 *   production: { kind: 'CD' | 'CES', label: string }
 * }} options
 */
export async function main(options) {
  console.log(options);
  const { navigator, devicePixelRatio } = globalThis;
  const adapter = await navigator.gpu.requestAdapter();
  if (adapter == null) throw new Error('no gpu adapter');
  const device = await adapter.requestDevice();

  const format = navigator.gpu.getPreferredCanvasFormat();
  const [canvas, context, getTexture] = await getCanvas(devicePixelRatio, device, format);

  const camera = new CameraState(canvas);
  const scene = new SceneState(camera);
  if (globalThis.parent) {
    listenToParent(globalThis.parent, scene);
  }

  device.pushErrorScope('validation');
  const uniforms = createUniforms(device);
  const textures = createTextures(device, scene);
  const buffers = createBuffers(device, scene);
  const pipelines = await createPipelines(device, format, scene, uniforms, buffers, textures);

  {
    const computeEncoder = device.createCommandEncoder();
    const computePass = computeEncoder.beginComputePass();
    scene.updateComputeUniforms(device, uniforms);
    pipelines.compute(computePass);
    computePass.end();
    device.queue.submit([computeEncoder.finish()]);
  }

  await logErrors(device, 'compute');

  requestAnimationFrame(function f(t) {
    const depthTexture = getTexture();
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        clearValue: { r: 0, g: 0, b: 1, a: 1 },
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
}

/** @param {GPUDevice} device @param {string} label */
async function logErrors(device, label) {
  const errorScope = await device.popErrorScope();
  if (errorScope) {
    console.error(`GPU(${label}):`,errorScope.message);
    console.info(errorScope);
  } else {
    console.log('GPU(${label}): now running');
  }
}

/**
 * @param {GPUDevice} device
 * @param {GPUTextureFormat} format
 * @param {SceneState} scene
 * @param {Uniforms} uniforms
 * @param {Buffers} buffers
 * @param {Textures} textures
 */
async function createPipelines(device, format, scene, uniforms, buffers, textures) {
  const { curveShader, textShader, gridShader } = await loadShader(device);

  const plCompute = device.createComputePipeline({
    layout: 'auto',
    compute: { module: curveShader, entryPoint: 'generateMesh' },
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
      module: curveShader,
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
      module: curveShader,
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


  const textSampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    mipmapFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
  });

  const textPipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: textShader,
      entryPoint: 'textVertex',
      buffers: [
        {
          arrayStride: 2 * 4,
          stepMode: 'vertex',
          attributes: [{
            shaderLocation: 0,
            offset: 0,
            format: 'float32x2',
          }],
        },
        {
          arrayStride: 32,
          stepMode: 'instance',
          attributes: [
            { shaderLocation: 1, offset: 0, format: 'float32x3' },
            { shaderLocation: 2, offset: 12, format: 'float32' },
            { shaderLocation: 3, offset: 16, format: 'float32x2' },
          ],
        }
      ],
    },
    fragment: {
      module: textShader,
      entryPoint: 'textFragment',
      targets: [{
        format,
        blend: {
          color: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
          },
          alpha: {
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha',
            operation: 'add',
          },
        },
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
  });

  const labourBindGroup = device.createBindGroup({
    layout: textPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniforms.text.getBuffer(device) } },
      { binding: 1, resource: textSampler },
      { binding: 2, resource: textures.labour.createView() },
    ],
  });

  const capitalBindGroup = device.createBindGroup({
    layout: textPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniforms.text.getBuffer(device) } },
      { binding: 1, resource: textSampler },
      { binding: 2, resource: textures.capital.createView() },
    ],
  });

  const plGridCompute = device.createComputePipeline({
    layout: 'auto',
    compute: { module: gridShader, entryPoint: 'generateGrid' },
  });

  const bgGridComputeUniform = device.createBindGroup({
    layout: plGridCompute.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniforms.gridGen.getBuffer(device) } },
    ],
  });

  const bgGridComputeBuffer = device.createBindGroup({
    layout: plGridCompute.getBindGroupLayout(1),
    entries: [
      { binding: 0, resource: { buffer: buffers.gridVertices } },
    ],
  });

  const plGrid = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: gridShader,
      entryPoint: 'gridVertex',
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
      module: gridShader,
      entryPoint: 'gridFragment',
      targets: [{
        format,
      }],
    },
    primitive: {
      topology: 'line-list',
      cullMode: 'none',
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  const bgGrid = device.createBindGroup({
    layout: plGrid.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniforms.gridRender.getBuffer(device) } },
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

      const [xQuads, zQuads] = scene.curveDomain.quads;
      pass.dispatchWorkgroups(Math.ceil(xQuads / 8), Math.ceil(zQuads / 8));

      pass.setPipeline(plGridCompute);
      pass.setBindGroup(0, bgGridComputeUniform);
      pass.setBindGroup(1, bgGridComputeBuffer);

      const gridSpacing = 100;
      const xLines = Math.floor((scene.curveDomain.x.max - scene.curveDomain.x.min) / gridSpacing) + 1;
      const zLines = Math.floor((scene.curveDomain.z.max - scene.curveDomain.z.min) / gridSpacing) + 1;
      const totalLines = xLines + zLines;
      pass.dispatchWorkgroups(Math.ceil(totalLines / 64));
    },

    /**
     * @param {GPURenderPassEncoder} pass
     */
    render(pass) {
      pass.setPipeline(plGrid);
      pass.setBindGroup(0, bgGrid);
      pass.setVertexBuffer(0, buffers.gridVertices);

      const gridSpacing = 100;
      const xLines = Math.floor((scene.curveDomain.x.max - scene.curveDomain.x.min) / gridSpacing) + 1;
      const zLines = Math.floor((scene.curveDomain.z.max - scene.curveDomain.z.min) / gridSpacing) + 1;
      const totalLines = xLines + zLines;
      const gridVertexCount = totalLines * 2;
      pass.draw(gridVertexCount);

      pass.setPipeline(plMesh);
      pass.setBindGroup(0, bgMesh);
      pass.setVertexBuffer(0, buffers.meshVertices);

      const vertexCount = scene.curveDomain.totalVertices;
      pass.draw(vertexCount);

      pass.setPipeline(textPipeline);
      pass.setVertexBuffer(0, buffers.textVertices);
      pass.setVertexBuffer(1, buffers.textLabourInstance);
      pass.setBindGroup(0, labourBindGroup);
      pass.draw(6, 2);
      pass.setPipeline(textPipeline);
      pass.setVertexBuffer(0, buffers.textVertices);
      pass.setVertexBuffer(1, buffers.textCapitalInstance);
      pass.setBindGroup(0, capitalBindGroup);
      pass.draw(6, 2);
    },
  };
}

/**
 * @param {GPUDevice} device
 * @returns {Uniforms}
 */
function createUniforms(device) {
  const meshGen = UniformAdapter.create([
    { type: 'vec2<f32>', name: 'min' },
    { type: 'vec2<f32>', name: 'step' },
    { type: 'vec2<u32>', name: 'count' },
  ]);

  const meshRender = UniformAdapter.create([
    { type: 'mat4x4<f32>', name: 'world' },
    { type: 'mat4x4<f32>', name: 'viewProj' },
    { type: 'vec3<f32>', name: 'offset' },
    { type: 'f32', name: 'productionMax' },
    { type: 'f32', name: 'alpha' },
    { type: 'f32', name: 'technology' },
    { type: 'f32', name: 'rho' },
    { type: 'f32', name: 'zeta' },
  ]);

  const text = UniformAdapter.create([
    { type: 'mat4x4<f32>', name: 'world' },
    { type: 'mat4x4<f32>', name: 'viewProj' },
  ]);

  const gridGen = UniformAdapter.create([
    { type: 'vec2<f32>', name: 'min' },
    { type: 'vec2<f32>', name: 'max' },
    { type: 'f32', name: 'spacing' },
    { type: 'vec2<f32>', name: 'offset' },
  ]);

  const gridRender = UniformAdapter.create([
    { type: 'mat4x4<f32>', name: 'world' },
    { type: 'mat4x4<f32>', name: 'viewProj' },
  ]);

  return { meshGen, meshRender, text, gridGen, gridRender };
}

/**
 * @param {GPUDevice} device
 * @param {SceneState} scene
 * @returns {Buffers}
 */
function createBuffers(device, scene) {
  const textVertices = generateXzQuad();
  const textVertexBuffer = device.createBuffer({
    size: textVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(textVertexBuffer, 0, textVertices);

  const labourInstanceData = createContiguousArray({
    data: [
      { position: [0, 0, +600], rotation: 0, scale: scene.labels.labour.size },
      { position: [0, 0, -600], rotation: Math.PI, scale: scene.labels.labour.size },
    ],
    layout: [
      { type: 'vec3<f32>', name: 'position' },
      { type: 'f32', name: 'rotation' },
      { type: 'vec2<f32>', name: 'scale' },
    ],
  });
  const lTextInstanceBuffer = device.createBuffer({
    size: labourInstanceData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(lTextInstanceBuffer, 0, labourInstanceData);

  const capitalInstanceData = createContiguousArray({
    data: [
      { position: [+600, 0, 0], rotation: Math.PI * 1.5, scale: scene.labels.capital.size },
      { position: [-600, 0, 0], rotation: Math.PI * 0.5, scale: scene.labels.capital.size },
    ],
    layout: [
      { type: 'vec3<f32>', name: 'position' },
      { type: 'f32', name: 'rotation' },
      { type: 'vec2<f32>', name: 'scale' },
    ],
  });

  const kTextInstanceBuffer = device.createBuffer({
    size: capitalInstanceData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(kTextInstanceBuffer, 0, capitalInstanceData);

  return {
    meshVertices: device.createBuffer({
      size: scene.curveDomain.bufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
    }),
    gridVertices: device.createBuffer({
      size: scene.curveDomain.gridSize * 2 * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
    }),
    textVertices: textVertexBuffer,
    textLabourInstance: lTextInstanceBuffer,
    textCapitalInstance: kTextInstanceBuffer,
  };
}

/**
 * @param {GPUDevice} device
 * @param {SceneState} scene
 * @returns {Textures}
 */
function createTextures(device, scene) {
	const labour = makeTextureFromCanvasText(device, scene.labels.labour);
  const capital = makeTextureFromCanvasText(device, scene.labels.capital);
  return { capital, labour };
}

/**
 * @param {GPUDevice} device
 * @returns {Promise<{
 *   curveShader: GPUShaderModule,
 *   textShader: GPUShaderModule,
 *   gridShader: GPUShaderModule,
 * }>}
 */
async function loadShader(device) {
  /** @param {string} url */
  const withShaderUrl = async (url) => {
    const shaderSourceRes = await fetch(url);
    const shaderSource = await shaderSourceRes.text();
    return device.createShaderModule({ code: shaderSource })
  };

  const [
    curveShader,
    textShader,
    gridShader,
  ] = await Promise.all([
    withShaderUrl('./shaders/curve.wgsl'),
    withShaderUrl('./shaders/text.wgsl'),
    withShaderUrl('./shaders/grid.wgsl'),
  ])

  return {
    curveShader,
    textShader,
    gridShader,
  };
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

  function updateDepthTexture() {
    depthTexture = device.createTexture({
      size: { width: canvas.width, height: canvas.height },
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  const observer = new ResizeObserver((entries) => {
    for (const { contentRect: { width, height } } of entries) {
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }

    updateDepthTexture();
  });

  document.body.insertBefore(canvas, document.body.firstChild);
  updateDepthTexture();
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

/**
 * @param {Window} parent
 * @param {SceneState} scene
 */
function listenToParent(parent, scene) {
  addEventListener('message', ({ data: message }) => {
    switch (message.kind) {
      case 'set':
        switch (message.key) {
          case 'ctrl-technology':
            scene.production.technology = message.value;
            break;

          case 'ctrl-alpha':
            scene.production.alpha = message.value;
            break;

          default:
            console.warn("unknown message", message);
        }
        break;

      default:
        break;
    }
  });
}
