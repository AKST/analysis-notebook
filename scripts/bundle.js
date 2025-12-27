#!/usr/bin/env node

import { bundle } from '../lib/cli/bundle/index.js';

const projectRoot = process.cwd();

try {
  await bundle(projectRoot);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Build failed:', message);
  process.exit(1);
}
