/**
 * @import { GpuTextureMeta } from './type.ts';
 */

/**
 * @param {string} text
 * @param {{ fontSize: number, font: string, fillStyle: string }} options
 * @returns {GpuTextureMeta}
 */
export function makeCanvasText(text, { font, fontSize, fillStyle }) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  if (ctx == null) throw new Error();

  ctx.canvas.height = fontSize;
  ctx.canvas.width = 1000;
  ctx.font = `${fontSize}px ${font} `;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fillStyle;

  const metrics = ctx.measureText(text);
  canvas.width = metrics.width;
  canvas.height = fontSize;
  ctx.font = `${fontSize}px ${font} `;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fillStyle;

  ctx.clearRect(0, 0, metrics.width, fontSize);
  ctx.fillText(text, metrics.width / 2, fontSize / 2);

  return { text, canvas, ctx, size: [metrics.width, fontSize] };
}

/**
 * Create WebGPU texture from canvas text
 * @param {GPUDevice} device
 * @param {GpuTextureMeta} cfg
 * @returns {GPUTexture}
 */
export function makeTextureFromCanvasText(device, cfg) {
  const texture = device.createTexture({
    size: { width: cfg.canvas.width, height: cfg.canvas.height },
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING |
           GPUTextureUsage.COPY_DST |
           GPUTextureUsage.RENDER_ATTACHMENT,
  });

  // Copy canvas data to texture
  device.queue.copyExternalImageToTexture(
    { source: cfg.canvas },
    { texture: texture },
    { width: cfg.canvas.width, height: cfg.canvas.height }
  );

  return texture;
}

/**
 * Create text texture for WebGPU
 * @param {GPUDevice} device
 * @param {string} text
 * @param {{ fontSize: number, font: string, fillStyle: string }} options
 * @returns {GPUTexture}
 */
export function makeTextTexture(device, text, options) {
  const canvasText = makeCanvasText(text, options);
  return makeTextureFromCanvasText(device, canvasText);
}
