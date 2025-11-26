import { expect, describe, it, vi } from 'vitest';
import { FieldDescriptor, GpuTypeDeclare } from '../type.ts';
import { MemoryLayout, createContiguousArray, UniformAdapter, readStructuredData, writeStructuredData } from '../buffers.js';

describe('WebGPU Buffers', () => {
  const ml_f32 = MemoryLayout.create([{ name: 'x', type: 'f32' }]);
  const ml_u32 = MemoryLayout.create([{ name: 'x', type: 'u32' }]);

  const ml_f32_xy = MemoryLayout.create([
    { name: 'x', type: 'f32' },
    { name: 'y', type: 'f32' },
  ]);

  const ml_f32_xyz = MemoryLayout.create([
    { name: 'x', type: 'f32' },
    { name: 'y', type: 'f32' },
    { name: 'z', type: 'f32' },
  ]);

  const ml_f32_v2 = MemoryLayout.create([{ name: 'pos', type: 'vec2<f32>' }]);
  const ml_f32_v3 = MemoryLayout.create([{ name: 'pos', type: 'vec3<f32>' }]);
  const ml_f32_v4 = MemoryLayout.create([{ name: 'pos', type: 'vec4<f32>' }]);

  const ml_comp_v2_f32 = MemoryLayout.create([
    { name: 'pos', type: 'vec2<f32>' },
    { name: 'size', type: 'f32' },
  ]);

  describe('createContiguousArray', () => {
    it('writes 3 rows of scalar f32 data', () => {
      const rows = [
        { x: 1.0 },
        { x: 2.0 },
        { x: 3.0 },
      ];

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'rows', rows },
        layout: ml_f32,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(2.0);
      expect(floats[2]).toBe(3.0);
    });

    it('writes 3 rows of multiple scalar fields', () => {
      const rows = [
        { x: 1.0, y: 10.0 },
        { x: 2.0, y: 20.0 },
        { x: 3.0, y: 30.0 },
      ];

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'rows', rows },
        layout: ml_f32_xy,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(10.0);
      expect(floats[2]).toBe(2.0);
      expect(floats[3]).toBe(20.0);
      expect(floats[4]).toBe(3.0);
      expect(floats[5]).toBe(30.0);
    });

    it('writes 3 rows of vec2 data', () => {
      const rows = [
        { pos: [1.0, 2.0] },
        { pos: [3.0, 4.0] },
        { pos: [5.0, 6.0] },
      ];

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'rows', rows },
        layout: ml_f32_v2,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(2.0);
      expect(floats[2]).toBe(3.0);
      expect(floats[3]).toBe(4.0);
      expect(floats[4]).toBe(5.0);
      expect(floats[5]).toBe(6.0);
    });

    it('writes 3 rows of mixed scalar and vector data', () => {
      const rows = [
        { pos: [1.0, 2.0], size: 10.0 },
        { pos: [3.0, 4.0], size: 20.0 },
        { pos: [5.0, 6.0], size: 30.0 },
      ];

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'rows', rows },
        layout: ml_comp_v2_f32,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(2.0);
      expect(floats[2]).toBe(10.0);
      expect(floats[4]).toBe(3.0);
      expect(floats[5]).toBe(4.0);
      expect(floats[6]).toBe(20.0);
      expect(floats[8]).toBe(5.0);
      expect(floats[9]).toBe(6.0);
      expect(floats[10]).toBe(30.0);
    });

    it('writes 3 rows of scalar f32 data from columns', () => {
      const cols = { x: [1.0, 2.0, 3.0] };

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'cols', cols, length: 3 },
        layout: ml_f32,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(2.0);
      expect(floats[2]).toBe(3.0);
    });

    it('writes 3 rows of multiple scalar fields from columns', () => {
      const cols = {
        x: [1.0, 2.0, 3.0],
        y: [10.0, 20.0, 30.0],
      };

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'cols', cols, length: 3 },
        layout: ml_f32_xy,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(10.0);
      expect(floats[2]).toBe(2.0);
      expect(floats[3]).toBe(20.0);
      expect(floats[4]).toBe(3.0);
      expect(floats[5]).toBe(30.0);
    });

    it('writes 3 rows of vec2 data from columns', () => {
      const cols = {
        pos: [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]],
      };

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'cols', cols, length: 3 },
        layout: ml_f32_v2,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(2.0);
      expect(floats[2]).toBe(3.0);
      expect(floats[3]).toBe(4.0);
      expect(floats[4]).toBe(5.0);
      expect(floats[5]).toBe(6.0);
    });

    it('writes 3 rows of mixed scalar and vector data from columns', () => {
      const cols = {
        pos: [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]],
        size: [10.0, 20.0, 30.0],
      };

      const result = createContiguousArray({
        rows: 3,
        data: { kind: 'cols', cols, length: 3 },
        layout: ml_comp_v2_f32,
      });

      const floats = new Float32Array(result);
      expect(floats[0]).toBe(1.0);
      expect(floats[1]).toBe(2.0);
      expect(floats[2]).toBe(10.0);
      expect(floats[4]).toBe(3.0);
      expect(floats[5]).toBe(4.0);
      expect(floats[6]).toBe(20.0);
      expect(floats[8]).toBe(5.0);
      expect(floats[9]).toBe(6.0);
      expect(floats[10]).toBe(30.0);
    });
  });

  describe('readStructuredData', () => {
    it('reads 1 row of scalar f32 data', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 42.0;

      const rows: any[] = [{}];

      const result = readStructuredData({
        arrayBuffer,
        layout: ml_f32,
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0].x).toBe(42.0);
      expect(result).toBe(4);
    });

    it('reads 1 row of multiple scalar fields', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 1.0;
      floats[1] = 2.0;
      floats[2] = 3.0;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: ml_f32_xyz,
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0]).toEqual({ x: 1.0, y: 2.0, z: 3.0 });
    });

    it('reads 1 row of vec2 data', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 1.0;
      floats[1] = 2.0;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: ml_f32_v2,
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0].pos).toEqual([1.0, 2.0]);
    });

    it('reads 1 row of vec3 data', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 1.0;
      floats[1] = 2.0;
      floats[2] = 3.0;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: ml_f32_v3,
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0].pos).toEqual([1.0, 2.0, 3.0]);
    });

    it('reads 1 row of vec4 data', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 1.0;
      floats[1] = 2.0;
      floats[2] = 3.0;
      floats[3] = 4.0;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: ml_f32_v4,
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0].pos).toEqual([1.0, 2.0, 3.0, 4.0]);
    });

    it('reads 1 row of mixed scalar and vector data', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 1.0;
      floats[1] = 2.0;
      floats[2] = 10.0;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: ml_comp_v2_f32,
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0]).toEqual({ pos: [1.0, 2.0], size: 10.0 });
    });

    it('reads u32 scalar data', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const uints = new Uint32Array(arrayBuffer);
      uints[0] = 42;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: MemoryLayout.create([{ name: 'count', type: 'u32' }]),
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0].count).toBe(42);
    });

    it('reads i32 scalar data', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const ints = new Int32Array(arrayBuffer);
      ints[0] = -42;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: MemoryLayout.create([{ name: 'value', type: 'i32' }]),
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0].value).toBe(-42);
    });

    it('reads data with proper alignment', () => {
      const arrayBuffer = new ArrayBuffer(32);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 1.0;
      floats[2] = 2.0;
      floats[3] = 3.0;

      const rows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout: MemoryLayout.create([
          { name: 'x', type: 'f32' },
          { name: 'pos', type: 'vec2<f32>' },
        ]),
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(rows[0]).toEqual({ x: 1.0, pos: [2.0, 3.0] });
    });

    it('reads data from non-zero offset', () => {
      const arrayBuffer = new ArrayBuffer(32);
      const floats = new Float32Array(arrayBuffer);
      floats[4] = 42.0;

      const rows: any[] = [{}];

      const result = readStructuredData({
        arrayBuffer,
        layout: ml_f32,
        data: { kind: 'rows', rows },
        readFrom: 16,
        writeTo: 0,
      });

      expect(rows[0].x).toBe(42.0);
      expect(result).toBe(20);
    });

    it('reads data into column format', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 1.0;
      floats[1] = 2.0;

      const cols: Record<string, any[]> = { x: [], y: [] };

      readStructuredData({
        arrayBuffer,
        layout: ml_f32_xy,
        data: { kind: 'cols', cols, length: 1 },
        readFrom: 0,
        writeTo: 0,
      });

      expect(cols.x[0]).toBe(1.0);
      expect(cols.y[0]).toBe(2.0);
    });

    it('reads data into specific row index', () => {
      const arrayBuffer = new ArrayBuffer(16);
      const floats = new Float32Array(arrayBuffer);
      floats[0] = 42.0;

      const rows: any[] = [{}, {}, {}];

      readStructuredData({
        arrayBuffer,
        layout: ml_f32,
        data: { kind: 'rows', rows },
        readFrom: 0,
        writeTo: 2,
      });

      expect(rows[2].x).toBe(42.0);
      expect(rows[0]).toEqual({});
      expect(rows[1]).toEqual({});
    });

    it('roundtrip: write then read produces original data', () => {
      const originalRows = [
        { pos: [1.0, 2.0], size: 10.0, count: 5 },
      ];

      const arrayBuffer = new ArrayBuffer(32);
      const layout = MemoryLayout.create([
        { name: 'pos', type: 'vec2<f32>' },
        { name: 'size', type: 'f32' },
        { name: 'count', type: 'u32' },
      ]);

      writeStructuredData({
        arrayBuffer,
        layout,
        data: { kind: 'rows', rows: originalRows },
        writeTo: 0,
        readFrom: 0,
      });

      const readRows: any[] = [{}];

      readStructuredData({
        arrayBuffer,
        layout,
        data: { kind: 'rows', rows: readRows },
        readFrom: 0,
        writeTo: 0,
      });

      expect(readRows[0]).toEqual(originalRows[0]);
    });
  });

  describe('UniformAdapter', () => {
    it('creates adapter with initial state', () => {
      const uniformDef: GpuTypeDeclare<any>[] = [
        { name: 'x', type: 'f32', init: 1.0 },
        { name: 'y', type: 'f32', init: 2.0 },
      ];

      const adapter = UniformAdapter.create(uniformDef);

      expect(adapter.state).toEqual({ x: 1.0, y: 2.0 });
    });

    it('updates state values', () => {
      const uniformDef: GpuTypeDeclare<any>[] = [
        { name: 'x', type: 'f32', init: 1.0 },
      ];

      const adapter = UniformAdapter.create(uniformDef);
      adapter.update('x', 5.0);

      expect(adapter.state.x).toBe(5.0);
    });

    it('writes data to array buffer', () => {
      const uniformDef: GpuTypeDeclare<any>[] = [
        { name: 'x', type: 'f32', init: 1.0 },
        { name: 'y', type: 'f32', init: 2.0 },
      ];

      const adapter = UniformAdapter.create(uniformDef);
      const arrayBuffer = new ArrayBuffer(adapter.layout.stride);
      adapter.writeToArrayBuffer(arrayBuffer);

      const data = new Float32Array(arrayBuffer);
      expect(data[0]).toBe(1.0);
      expect(data[1]).toBe(2.0);
    });
  });
});
