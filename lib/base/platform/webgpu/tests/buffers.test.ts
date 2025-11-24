import { expect, describe, it, vi } from 'vitest';
import { FieldDescriptor, GpuTypeDeclare } from '../type.ts';
import { createContiguousArray, UniformAdapter } from '../buffers.js';

describe('WebGPU Buffers', () => {
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
        layout: [
          { name: 'x', type: 'f32' },
        ],
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
        layout: [
          { name: 'x', type: 'f32' },
          { name: 'y', type: 'f32' },
        ],
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
        layout: [
          { name: 'pos', type: 'vec2<f32>' },
        ],
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
        layout: [
          { name: 'pos', type: 'vec2<f32>' },
          { name: 'size', type: 'f32' },
        ],
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
        layout: [
          { name: 'x', type: 'f32' },
        ],
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
        layout: [
          { name: 'x', type: 'f32' },
          { name: 'y', type: 'f32' },
        ],
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
        layout: [
          { name: 'pos', type: 'vec2<f32>' },
        ],
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
        layout: [
          { name: 'pos', type: 'vec2<f32>' },
          { name: 'size', type: 'f32' },
        ],
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

  describe('UniformAdapter', () => {
    it('creates adapter with initial state', () => {
      const uniformDef: GpuTypeDeclare<any>[] = [
        { name: 'x', type: 'f32', init: 1.0 },
        { name: 'y', type: 'f32', init: 2.0 },
      ];

      const adapter = UniformAdapter.create(uniformDef);

      expect(adapter.state).toEqual({ x: 1.0, y: 2.0 });
    });

    it('calculates correct buffer size', () => {
      const uniformDef: GpuTypeDeclare<any>[] = [
        { name: 'x', type: 'f32', init: 1.0 },
        { name: 'y', type: 'f32', init: 2.0 },
      ];

      const adapter = UniformAdapter.create(uniformDef);

      expect(adapter.bufferSize).toBe(16);
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
      const arrayBuffer = new ArrayBuffer(adapter.bufferSize);
      adapter.writeToArrayBuffer(arrayBuffer);

      const data = new Float32Array(arrayBuffer);
      expect(data[0]).toBe(1.0);
      expect(data[1]).toBe(2.0);
    });
  });
});
