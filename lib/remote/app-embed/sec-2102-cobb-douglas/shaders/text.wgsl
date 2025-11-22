struct TextUniforms { world: mat4x4<f32>, viewProjection: mat4x4<f32> }

@group(0) @binding(0) var<uniform> textUniforms: TextUniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var textureData: texture_2d<f32>;

struct TextVertexInput {
  @location(0) position: vec2<f32>,
  @location(1) instancePosition: vec3<f32>,
  @location(2) instanceRotation: f32,
  @location(3) instanceScale: vec2<f32>,
}

struct TextVertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) texcoord: vec2<f32>,
}

@vertex
fn textVertex(input: TextVertexInput) -> TextVertexOutput {
  var output: TextVertexOutput;

  let cosR = cos(input.instanceRotation);
  let sinR = sin(input.instanceRotation);
  let scaledPos = input.position * input.instanceScale;
  let rotatedX = scaledPos.x * cosR - scaledPos.y * sinR;
  let rotatedY = scaledPos.x * sinR + scaledPos.y * cosR;

  let localPos = vec4(rotatedX, 0.0, rotatedY, 1.0);
  let worldPosition = localPos + vec4(input.instancePosition, 0.0);

  output.position = textUniforms.viewProjection * worldPosition;
  output.texcoord = input.position + 0.5;

  return output;
}

@fragment
fn textFragment(input: TextVertexOutput) -> @location(0) vec4<f32> {
  return textureSample(textureData, textureSampler, input.texcoord);
}
