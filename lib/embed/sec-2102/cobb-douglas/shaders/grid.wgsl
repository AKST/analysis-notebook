struct GridGenParams {
  min: vec2<f32>,
  max: vec2<f32>,
  spacing: f32,
  offset: vec2<f32>,
}

@group(0) @binding(0) var<uniform> gridCfg: GridGenParams;
@group(1) @binding(0) var<storage, read_write> vertices: array<vec2<f32>>;

@compute @workgroup_size(64)
fn generateGrid(@builtin(global_invocation_id) id: vec3<u32>) {
  let xLines = u32((gridCfg.max.x - gridCfg.min.x) / gridCfg.spacing) + 1u;
  let zLines = u32((gridCfg.max.y - gridCfg.min.y) / gridCfg.spacing) + 1u;
  let totalLines = xLines + zLines;

  if (id.x >= totalLines) { return; }

  let baseIdx = id.x * 2u;

  if (id.x < xLines) {
    let z = gridCfg.min.y + f32(id.x) * gridCfg.spacing;
    vertices[baseIdx + 0u] = vec2<f32>(gridCfg.min.x + gridCfg.offset.x, z + gridCfg.offset.y);
    vertices[baseIdx + 1u] = vec2<f32>(gridCfg.max.x + gridCfg.offset.x, z + gridCfg.offset.y);
  } else {
    let lineIdx = id.x - xLines;
    let x = gridCfg.min.x + f32(lineIdx) * gridCfg.spacing;
    vertices[baseIdx + 0u] = vec2<f32>(x + gridCfg.offset.x, gridCfg.min.y + gridCfg.offset.y);
    vertices[baseIdx + 1u] = vec2<f32>(x + gridCfg.offset.x, gridCfg.max.y + gridCfg.offset.y);
  }
}

struct GridUniforms {
  world: mat4x4<f32>,
  viewProj: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> gridUniforms: GridUniforms;

struct GridVertexInput {
  @location(0) position: vec2<f32>,
}

struct GridVertexOutput {
  @builtin(position) position: vec4<f32>,
}

@vertex
fn gridVertex(input: GridVertexInput) -> GridVertexOutput {
  var output: GridVertexOutput;
  let localPos = vec4<f32>(input.position.x, 0.0, input.position.y, 1.0);
  let worldPosition = gridUniforms.world * localPos;
  output.position = gridUniforms.viewProj * worldPosition;
  return output;
}

@fragment
fn gridFragment(input: GridVertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(1.0, 1.0, 1.0, 1.0);
}
