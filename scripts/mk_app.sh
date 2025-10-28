#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if app ID argument is provided
if [ $# -eq 0 ]; then
  echo -e "${RED}Error: App ID required${NC}"
  echo "Usage: $0 <app-id>"
  echo "Example: $0 2206.04-2"
  exit 1
fi

APP_ID="$1"

# Parse app ID to determine section and path
# Examples: '2206.04-2' -> sec='2206', app_dir='sec-04-2'
#           '1101.05' -> sec='1101', app_dir='sec-05'
#           'c.1.2' -> sec='c', subsec='1', app_dir='sec-2'

if [[ $APP_ID =~ ^([0-9]+|[a-z])\.(.+)$ ]]; then
  SECTION="${BASH_REMATCH[1]}"
  REST="${BASH_REMATCH[2]}"

  # Determine if there's a subsection (like c.1.2 -> sec-c/sec-1/sec-2)
  if [[ $REST =~ ^([0-9]+)\.(.+)$ ]]; then
    SUBSECTION="${BASH_REMATCH[1]}"
    APP_NUM="${BASH_REMATCH[2]}"
    SECTION_DIR="lib/app/sec-${SECTION}/sec-${SUBSECTION}"
    APP_DIR="${SECTION_DIR}/sec-${APP_NUM}"
  else
    SECTION_DIR="lib/app/sec-${SECTION}"
    APP_DIR="${SECTION_DIR}/sec-${REST}"
  fi
else
  echo -e "${RED}Error: Invalid app ID format${NC}"
  echo "Expected format: <section>.<app> (e.g., 2206.04-2, 1101.05, c.1.2)"
  exit 1
fi

# Required files (always generated)
REQUIRED_FILES=(
  "index.js"
  "doc.js"
  "util.js"
  "type.ts"
  "style.js"
)

# Optional files (ask before generating)
OPTIONAL_FILES=(
  "mathml.js"
  "render.js"
  "tables.js"
  "remote.js"
)

echo -e "${BLUE}Creating app: ${APP_ID}${NC}"
echo "Section directory: ${SECTION_DIR}"
echo "App directory: ${APP_DIR}"
echo ""

# Check if section directory exists
NEW_SECTION=false
if [ ! -d "$SECTION_DIR" ]; then
  NEW_SECTION=true
  echo -e "${YELLOW}New section directory will be created${NC}"
fi

# Check if app directory exists
if [ -d "$APP_DIR" ]; then
  echo -e "${RED}Error: App directory already exists: ${APP_DIR}${NC}"
  exit 1
fi

# List files to generate
echo -e "${GREEN}Required files to generate:${NC}"
for file in "${REQUIRED_FILES[@]}"; do
  echo "  - $file"
done

echo ""
echo -e "${YELLOW}Optional files (will prompt):${NC}"
for file in "${OPTIONAL_FILES[@]}"; do
  echo "  - $file"
done

if [ "$NEW_SECTION" = true ]; then
  echo ""
  echo -e "${YELLOW}New section files:${NC}"
  echo "  - prelude.js"
  echo "  - README.md"
fi

echo ""
read -p "Continue with file generation? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# Create directories
echo ""
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p "$APP_DIR"

if [ "$NEW_SECTION" = true ]; then
  # Create prelude.js for new section
  cat > "${SECTION_DIR}/prelude.js" <<'EOF'
export * as vis2dModel from '../../base/preludes/university/2d/model.js';
export * as components from '../../base/preludes/university/components.js';
export * as mathmlHelper from '../../base/preludes/university/mathml.js';
export * as layout from '../../base/preludes/university/layout.js';
export * as tables from '../../base/preludes/university/tables.js';
export * as styles from '../../base/preludes/university/styles.js';
export * as util from '../../base/preludes/university/util.js';
EOF
  echo -e "${GREEN}Created ${SECTION_DIR}/prelude.js${NC}"

  # Create empty README.md
  touch "${SECTION_DIR}/README.md"
  echo -e "${GREEN}Created ${SECTION_DIR}/README.md${NC}"
fi

# Generate index.js
cat > "${APP_DIR}/index.js" <<'EOF'
/**
 * @import { Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as doc from './doc.js';
import * as render from './render.js';
export { getConfig, createState, onUpdate } from './util.js';
export { createStyle } from './style.js';

export const meta = {
  kind: 'multi',
  layout: {
    gridTemplateColumns: ['1fr', '1fr'],
    breakpoints: { s: 620 },
  },
};

/**
 * @type {Widget<any, State, Config>[]}
 */
export const children = [
  doc.intro,
];
EOF
echo -e "${GREEN}Created ${APP_DIR}/index.js${NC}"

# Generate doc.js
cat > "${APP_DIR}/doc.js" <<'EOF'
/**
 * @import { E, Widget } from '../../prelude-type.ts';
 * @import { Config, State } from './type.ts';
 */

import * as prelude from '../prelude.js';
import { doc } from '../../prelude.js';
import * as tables from './tables.js';
import * as mathml from './mathml.js';

const { readmore, dashbox, todo, infobox, defineTerm, text } = prelude.components;
const { container, twoThree, twoColumns } = prelude.layout;
const { createDoc } = prelude.util;

export const intro = createDoc(() => container(
  doc.h1`[TITLE]`,
  text.p.l`
    Content here...
  `,
));
EOF
echo -e "${GREEN}Created ${APP_DIR}/doc.js${NC}"

# Generate util.js
cat > "${APP_DIR}/util.js" <<'EOF'
/**
 * @import { MakeConfigKnobs } from '../../prelude-type.ts';
 * @import { Config, State, Event } from './type.ts';
 */

/**
 * @returns {MakeConfigKnobs<Config>}
 */
export function getConfig() {
  return {
    dummy: { kind: 'number', of: 0, range: [0, 1] },
  }
}

/**
 * @param {State} state
 * @param {Event} event
 * @returns {State}
 */
export function onUpdate(state, event) {
  switch (event.kind) {
    case 'config':
      return state;

    default:
      return state;
  }
}

/**
 * @returns {State}
 */
export function createState() {
  return {};
}
EOF
echo -e "${GREEN}Created ${APP_DIR}/util.js${NC}"

# Generate type.ts
cat > "${APP_DIR}/type.ts" <<'EOF'
import { RenderContextInit } from '../../prelude-type.ts';

export type RenderContext = RenderContextInit & {
};

export type Config = {
  dummy: number;
};

export type Event =
  | { kind: 'config', config: Config };

export type State = {};
EOF
echo -e "${GREEN}Created ${APP_DIR}/type.ts${NC}"

# Generate style.js
cat > "${APP_DIR}/style.js" <<'EOF'
import { styles } from '../prelude.js';

export function createStyle() {
  return {
    ...styles.getTypography(),
    ...styles.getLayout(),
    ...styles.getTableStyles(),
    ...styles.getInfoBoxStyles(),
  }
}
EOF
echo -e "${GREEN}Created ${APP_DIR}/style.js${NC}"

# Prompt for optional files
echo ""
echo -e "${BLUE}Optional files:${NC}"

for file in "${OPTIONAL_FILES[@]}"; do
  read -p "Generate ${file}? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    case "$file" in
      "mathml.js")
        cat > "${APP_DIR}/${file}" <<'EOF'
/**
 * @import { E } from '../../prelude-type.ts';
 */

import * as prelude from '../prelude.js';
import { mathml, doc } from '../../prelude.js';

const { mi, mo, mtext, mrow, mn, msup, msub, msubsup, msqrt, munder, mspace, mfrac } = mathml;
const { parensB, SPECIAL, abs, annotationOver, rows, parensA, call, table, op } = prelude.mathmlHelper;
const { eqId, eq, add, minus, div, mul } = op;

// Export your MathML formulas here
EOF
        ;;
      "render.js")
        cat > "${APP_DIR}/${file}" <<'EOF'
/**
 * @import { RenderContext, State, Config } from './type.ts';
 */

/**
 * @param {any} ctx
 * @param {RenderContext} context
 * @param {State} state
 * @param {Config} config
 */
export function render(ctx, context, state, config) {
  // Render logic here
}
EOF
        ;;
      "tables.js")
        cat > "${APP_DIR}/${file}" <<'EOF'
/**
 * @import { E } from '../../prelude-type.ts';
 * @import { State, Config } from './type.ts';
 */

import * as prelude from '../prelude.js';
import { doc } from '../../prelude.js';

// Export your table functions here
EOF
        ;;
      "remote.js")
        cat > "${APP_DIR}/${file}" <<'EOF'
/**
 * @import { State, Config } from './type.ts';
 */

// Remote data fetching or processing
EOF
        ;;
    esac
    echo -e "${GREEN}Created ${APP_DIR}/${file}${NC}"
  fi
done

# Show navigation config entry
echo ""
echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}App files generated successfully!${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""
echo -e "${YELLOW}Next step: Update navigation config${NC}"
echo "Add the following entry to lib/ui/navigation/app_explorer/config.js"
echo "in the appropriate section:"
echo ""
echo -e "${BLUE}    ['${APP_ID}', '[TITLE]'],${NC}"
echo ""
echo "Example locations:"
echo "  - ECON1101: Inside the '1101' section array"
echo "  - ECON2102: Inside the '2102' section array"
echo "  - ECON2206: Inside the '2206' section array"
echo "  - Complex Analysis: Inside the 'c' section array"
echo ""
