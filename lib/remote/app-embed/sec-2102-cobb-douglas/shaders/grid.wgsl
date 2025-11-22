struct GridGenParams {
  min: vec2<f32>,
  max: vec2<f32>,
  offset: vec2<f32>,
  spacing: f32,
}

@group(0) @binding(0) var<uniform> gridCfg: GridGenParams;
@group(1) @binding(0) var<storage, read_write> vertices: array<vec4<f32>>;

@compute @workgroup_size(10, 10)
fn generateGrid(@builtin(global_invocation_id) id: vec3<u32>) {
  let baseIdx = (id.y * 10 + id.x) * 2u;

  let mn_x = gridCfg.min.x;
  let mn_z = gridCfg.min.y;
  let mx_x = gridCfg.max.x;
  let mx_z = gridCfg.max.y;
  let of_x = gridCfg.offset.x;
  let of_z = gridCfg.offset.y;

  let z = mn_z + f32(id.x) * gridCfg.spacing;
  let y = f32(id.x + 1) / 10.0;
  let x = mn_x + f32(id.x) * gridCfg.spacing;

  switch id.y {
    case 0u {
      vertices[baseIdx + 0u] = vec4(mn_x + of_x, 0.0, z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(mx_x + of_x, 0.0, z + of_z, 1.0);
    }
    case 1u {
      vertices[baseIdx + 0u] = vec4(mn_x + of_x, 0.0, z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(mn_x + of_x, 1.0, z + of_z, 1.0);
    }
    case 2u {
      vertices[baseIdx + 0u] = vec4(mx_x + of_x, 0.0, z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(mx_x + of_x, 1.0, z + of_z, 1.0);
    }
    case 3u {
      vertices[baseIdx + 0u] = vec4(mn_x + of_x, y, mn_z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(mx_x + of_x, y, mn_z + of_z, 1.0);
    }
    case 4u {
      vertices[baseIdx + 0u] = vec4(mn_x + of_x, y, mx_z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(mx_x + of_x, y, mx_z + of_z, 1.0);
    }
    case 5u {
      vertices[baseIdx + 0u] = vec4(x + of_x, 0.0, mn_z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(x + of_x, 0.0, mx_z + of_z, 1.0);
    }
    case 6u {
      vertices[baseIdx + 0u] = vec4(x + of_x, 0.0, mn_z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(x + of_x, 1.0, mn_z + of_z, 1.0);
    }
    case 7u {
      vertices[baseIdx + 0u] = vec4(x + of_x, 0.0, mx_z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(x + of_x, 1.0, mx_z + of_z, 1.0);
    }
    case 8u {
      vertices[baseIdx + 0u] = vec4(mn_x + of_x, y, mn_z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(mn_x + of_x, y, mx_z + of_z, 1.0);
    }
    case 9u {
      vertices[baseIdx + 0u] = vec4(mx_x + of_x, y, mn_z + of_z, 1.0);
      vertices[baseIdx + 1u] = vec4(mx_x + of_x, y, mx_z + of_z, 1.0);
    }
    default {

    }
  }
}

struct GridUniforms {
  world: mat4x4<f32>,
  view_proj: mat4x4<f32>,
  camera_angle: f32,
  _pad: f32
}

@group(0) @binding(0) var<uniform> grid_uniforms: GridUniforms;

struct GridVertexInput {
  @location(0) position: vec4<f32>,
}

struct GridVertexOutput {
  @builtin(position) out_pos: vec4<f32>,
  @location(0) in_pos: vec4<f32>,
}

@vertex
fn gridVertex(input: GridVertexInput) -> GridVertexOutput {
  var output: GridVertexOutput;
  let w_position = grid_uniforms.world * input.position;
  output.out_pos = grid_uniforms.view_proj * w_position;
  output.in_pos = input.position;
  return output;
}

struct WallAngle { start: f32, end: f32 }

const PI = radians(180.0);
const FRONT_WALL = WallAngle(5.498, 0.785);
const RIGHT_WALL = WallAngle(0.785, 2.356);
const BACK_WALL = WallAngle(2.356, 3.927);
const LEFT_WALL = WallAngle(3.927, 5.498);

@fragment
fn gridFragment(input: GridVertexOutput) -> @location(0) vec4<f32> {
  let _a = grid_uniforms.camera_angle;
  let a = _a - floor(_a / (PI*2)) * (PI*2);
  let p = input.in_pos;

  if p.y > 0 {
    if p.x == 500 && (a > RIGHT_WALL.start && a < RIGHT_WALL.end) { discard; }
    if p.z == 500 && (a > FRONT_WALL.start || a < FRONT_WALL.end) { discard; }
    if p.x == -500 && (a > LEFT_WALL.start && a < LEFT_WALL.end) { discard; }
    if p.z == -500 && (a > BACK_WALL.start && a < BACK_WALL.end) { discard; }
  }
  return vec4<f32>(1.0, 1.0, 1.0, 1.0);
}
