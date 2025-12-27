#!/usr/bin/env node

import { bundle } from '../lib/cli/bundle/index.js';

const projectRoot = process.cwd();
const args = process.argv.slice(2);

const options = {
  sourcemap: args.includes('--sourcemap'),
};

try {
  await bundle(projectRoot, options);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Build failed:', message);
  process.exit(1);
}
