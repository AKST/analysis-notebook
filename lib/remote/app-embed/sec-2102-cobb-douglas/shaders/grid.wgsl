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

@group(0) @binding(0) var<uniform> u_grid: GridUniforms;

struct GridVertexInput {
  @location(0) position: vec4<f32>,
}

struct GridVertexOutput {
  @builtin(position) out_pos: vec4<f32>,
  @location(0) in_pos: vec4<f32>,
}

@vertex
fn gridVertex(input: GridVertexInput) -> GridVertexOutput {
  let w_position = u_grid.world * input.position;
  return GridVertexOutput(u_grid.view_proj * w_position, input.position);
}

struct Radians { deg_45: f32, deg_135: f32, deg_225: f32, deg_315: f32 }
struct TransparencyCondition { start: f32, end: f32, axis: u32, pos: f32, or: u32 }

const ANGLES = Radians(0.785, 2.356, 3.927, 5.498);
const FRONT_WALL = TransparencyCondition(ANGLES.deg_315, ANGLES.deg_45, 2, 500, 1);
const RIGHT_WALL = TransparencyCondition(ANGLES.deg_45, ANGLES.deg_135, 0, 500, 0);
const BACK_WALL = TransparencyCondition(ANGLES.deg_135, ANGLES.deg_225, 2, -500, 0);
const LEFT_WALL = TransparencyCondition(ANGLES.deg_225, ANGLES.deg_315, 0, -500, 0);
const PI = radians(180.0);

@fragment
fn gridFragment(input: GridVertexOutput) -> @location(0) vec4<f32> {
  let p = input.in_pos;
  let a = u_grid.camera_angle - floor(u_grid.camera_angle / (PI*2)) * (PI*2);

  if p.y > 0 {
    if is_transparent(p, a, RIGHT_WALL) { discard; }
    if is_transparent(p, a, FRONT_WALL) { discard; }
    if is_transparent(p, a, LEFT_WALL) { discard; }
    if is_transparent(p, a, BACK_WALL) { discard; }
  }

  return vec4(1.0, 1.0, 1.0, 1.0);
}

fn is_transparent(p: vec4<f32>, a: f32, w: TransparencyCondition) -> bool {
  return p[w.axis] == w.pos && select((a > w.start && a < w.end), (a > w.start || a < w.end), w.or == 1);
}
