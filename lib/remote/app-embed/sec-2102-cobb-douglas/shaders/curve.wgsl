

struct CurveInUnif {
  min: vec2<f32>,
  step: vec2<f32>,
  count: vec2<u32>,
}

@group(0) @binding(0) var<uniform> uCurveIn: CurveInUnif;
@group(1) @binding(0) var<storage, read_write> vertices: array<vec2<f32>>;

/**
 * Generates inputs for the curve
 */
@compute @workgroup_size(8, 8)
fn generateMesh(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x >= uCurveIn.count.x || id.y >= uCurveIn.count.y) { return; }

  let x: f32 = uCurveIn.min.x + f32(id.x) * uCurveIn.step.x;
  let z: f32 = uCurveIn.min.y + f32(id.y) * uCurveIn.step.y;
  let xNext: f32 = x + uCurveIn.step.x;
  let zNext: f32 = z + uCurveIn.step.y;
  let quadIndex = (id.y * uCurveIn.count.x + id.x) * 6u;

  vertices[quadIndex + 0u] = vec2(xNext, z);
  vertices[quadIndex + 1u] = vec2(x, z);
  vertices[quadIndex + 2u] = vec2(xNext, zNext);

  vertices[quadIndex + 3u] = vec2(x, z);
  vertices[quadIndex + 4u] = vec2(x, zNext);
  vertices[quadIndex + 5u] = vec2(xNext, zNext);
}


struct CurveOutputUnif {
  world: mat4x4<f32>,
  viewProj: mat4x4<f32>,
  offset: vec3<f32>,
  productionMax: f32,
  alpha: f32,
  technology: f32,
  rho: f32,
  zeta: f32,
}

@group(0) @binding(0) var<uniform> uCurveOut: CurveOutputUnif;

fn ces_production_fn(
  labour: f32,
  capital: f32,
) -> f32 {
  let technology = uCurveOut.technology;
  let alpha = uCurveOut.alpha;
  let zeta = uCurveOut.zeta;
  let rho = uCurveOut.rho;

  if (rho == 0.0) {
    return technology * pow(capital, 1.0 - alpha) * pow(labour, alpha);
  } else {
    // Add epsilon to avoid pow(0, negative) which gives infinity/NaN
    let eps = 1e-6;
    let l = max(labour, eps);
    let k = max(capital, eps);

    let kTerm = (1.0 - alpha) * pow(k, rho);
    let lTerm = alpha * pow(l, rho);
    return technology * pow(kTerm + lTerm, zeta / rho);
  }
}

struct CurveParam {
  @location(0) position: vec2<f32>,
}

struct CurveReturn {
  @builtin(position) position: vec4<f32>,
  @location(0) worldPos: vec3<f32>,
  @location(1) @interpolate(flat) faceY: f32,
}

@vertex
fn meshVertex(input: CurveParam) -> CurveReturn {
  let y = ces_production_fn(input.position.x, input.position.y);
  let p = vec4(input.position.x, y, input.position.y, 1.0);
  let worldPosition = uCurveOut.world * (p + vec4(uCurveOut.offset, 0.0));

  var output: CurveReturn;
  output.worldPos = worldPosition.xyz;
  output.faceY = y;
  output.position = uCurveOut.viewProj * worldPosition;
  return output;
}

const PI = radians(180.0);

@fragment
fn meshFragment(input: CurveReturn) -> @location(0) vec4<f32> {
  let dx = dpdx(input.worldPos);
  let dy = dpdy(input.worldPos);
  let n = normalize(cross(dx, dy));

  let tilt = acos(clamp(dot(n, vec3(0.0, 1.0, 0.0)), -1.0, 1.0)) / (0.5 * PI);
  let shade = mix(tilt, tilt, tilt);

  let t = clamp(input.faceY / uCurveOut.productionMax, 0.0, 1.0);

  let colorA = vec3(1.0, 0.5, 0.10);
  let colorB = vec3(1.0, 0.25, 0.25);
  let color = mix(colorA, colorB, t);

  return vec4(color * shade, 1.0);
}
