fn cobbDouglas(technology: f32, labour: f32, capital: f32, alpha: f32) -> f32 {
  return technology * pow(capital, 1.0 - alpha) * pow(labour, alpha);
}

struct MeshGenParams { min: vec2<f32>, step: vec2<f32> }

@group(0) @binding(0) var<uniform> meshCfg: MeshGenParams;
@group(1) @binding(0) var<storage, read_write> vertices: array<vec2<f32>>;

@compute @workgroup_size(8, 8)
fn generateMesh(
  @builtin(global_invocation_id) id: vec3<u32>,
  @builtin(num_workgroups) numWorkgroups: vec3<u32>
) {
  let xCount = numWorkgroups.x * 8u;
  let zCount = numWorkgroups.z * 8u;
  if (id.x >= xCount || id.y >= zCount) { return; }

  let x: f32 = meshCfg.min.x + f32(id.x) * meshCfg.step.x;
  let z: f32 = meshCfg.min.y + f32(id.y) * meshCfg.step.y;
  let xNext: f32 = x + meshCfg.step.x;
  let zNext: f32 = z + meshCfg.step.y;
  let quadIndex = (id.y * xCount + id.x) * 6u;

  vertices[quadIndex + 0u] = vec2(xNext, z);
  vertices[quadIndex + 1u] = vec2(x, z);
  vertices[quadIndex + 2u] = vec2(xNext, zNext);

  vertices[quadIndex + 3u] = vec2(x, z);
  vertices[quadIndex + 4u] = vec2(x, zNext);
  vertices[quadIndex + 5u] = vec2(xNext, zNext);
}


struct MeshRenderParams {
  world: mat4x4<f32>,
  viewProj: mat4x4<f32>,
  offset: vec3<f32>,
  alpha: f32,
  technology: f32,
  productionMax: f32,
  _padding: f32,
}

@group(0) @binding(0) var<uniform> meshRUnif: MeshRenderParams;

struct MeshVertexInput {
  @location(0) position: vec2<f32>,
}

struct MeshVertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) worldPos: vec3<f32>,
  @location(1) @interpolate(flat) faceY: f32,
}

@vertex
fn meshVertex(input: MeshVertexInput) -> MeshVertexOutput {
  var output: MeshVertexOutput;

  let production = cobbDouglas(
    meshRUnif.technology,
    input.position.x,
    input.position.y,
    meshRUnif.alpha,
  );
  let localPos = vec4<f32>(input.position.x, production, input.position.y, 1.0);
  let offsetPos = localPos + vec4<f32>(meshRUnif.offset, 0.0);
  let worldPosition = meshRUnif.world * offsetPos;

  output.worldPos = worldPosition.xyz;
  output.faceY = production;
  output.position = meshRUnif.viewProj * worldPosition;

  return output;
}

@fragment
fn meshFragment(input: MeshVertexOutput) -> @location(0) vec4<f32> {
  let dx = dpdx(input.worldPos);
  let dy = dpdy(input.worldPos);
  let n = normalize(cross(dx, dy));

  let tilt = acos(clamp(dot(n, vec3<f32>(0.0, 1.0, 0.0)), -1.0, 1.0)) / (0.5 * 3.14159265);
  let shade = mix(tilt, tilt, tilt);

  let t = clamp(input.faceY / meshRUnif.productionMax, 0.0, 1.0);

  let colorA = vec3<f32>(1.0, 0.5, 0.10);
  let colorB = vec3<f32>(1.0, 0.25, 0.25);
  let color = mix(colorA, colorB, t);

  return vec4<f32>(color * shade, 1.0);
}
