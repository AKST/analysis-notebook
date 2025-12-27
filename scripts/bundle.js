#!/usr/bin/env node

import { build } from '../lib/cli/build/index.js';

const projectRoot = process.cwd();

try {
  await build(projectRoot);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Build failed:', message);
  process.exit(1);
}
