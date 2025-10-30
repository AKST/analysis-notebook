#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="${SCRIPT_DIR}/templates"

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

# Function to read template file
# Args: $1 = template file name
# Returns: template content
process_template() {
  local template_file="$1"
  local template_path="${TEMPLATE_DIR}/${template_file}"

  if [ ! -f "$template_path" ]; then
    echo -e "${RED}Error: Template file not found: ${template_path}${NC}" >&2
    exit 1
  fi

  cat "$template_path"
}

# Validate app ID segments for security
# Args: $@ = all segments
validate_segments() {
  # Check for empty segments
  for segment in "$@"; do
    if [ -z "$segment" ]; then
      echo -e "${RED}Error: Empty segment in app ID${NC}"
      echo "Check for double dots or trailing dots in the app ID"
      exit 1
    fi

    # Check for path traversal and invalid characters
    if [[ "$segment" =~ [./\\] ]] || [[ "$segment" =~ ^- ]]; then
      echo -e "${RED}Error: Invalid characters in app ID segment: ${segment}${NC}"
      echo "Segments must contain only alphanumeric characters and hyphens (not at start)"
      exit 1
    fi
  done
}

# Parse app ID into components
# Args: $1 = app ID string
# Sets global variables: SEGMENTS, APP_DIR
parse_app_id() {
  local app_id="$1"

  # Split APP_ID by dots
  IFS='.' read -ra SEGMENTS <<< "$app_id"

  # Validate: must have at least 2 segments
  if [ ${#SEGMENTS[@]} -lt 2 ]; then
    echo -e "${RED}Error: Invalid app ID format${NC}"
    echo "Expected format: <section>.<subsection>[.<subsection>...] (e.g., 2206.04-2, c.1.2, 2206.10.3.5)"
    exit 1
  fi

  # Validate segments
  validate_segments "${SEGMENTS[@]}"

  # Build the full path by prepending 'sec-' to each segment
  APP_DIR="lib/app"
  for segment in "${SEGMENTS[@]}"; do
    APP_DIR="${APP_DIR}/sec-${segment}"
  done
}

# Display what will be generated
display_generation_plan() {
  echo -e "${BLUE}Creating app: ${APP_ID}${NC}"
  echo "App directory: ${APP_DIR}"
  echo ""

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
  echo ""
}

# Prompt user for confirmation
# Returns: 0 if confirmed, 1 if aborted
confirm_generation() {
  read -p "Continue with file generation? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    return 1
  fi
  return 0
}

# Create necessary directories
# Args: none (uses global APP_DIR)
create_app_directory() {
  echo ""
  echo -e "${BLUE}Creating directories...${NC}"
  mkdir -p "$APP_DIR"
}

# Generate required app files
# Args: none (uses global APP_DIR)
generate_required_files() {
  for file in "${REQUIRED_FILES[@]}"; do
    process_template "${file}.template" > "${APP_DIR}/${file}"
    echo -e "${GREEN}Created ${APP_DIR}/${file}${NC}"
  done
}

# Prompt and generate optional files
# Args: none (uses global APP_DIR, OPTIONAL_FILES)
generate_optional_files() {
  echo ""
  echo -e "${BLUE}Optional files:${NC}"

  for file in "${OPTIONAL_FILES[@]}"; do
    read -p "Generate ${file}? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      case "$file" in
        "mathml.js"|"render.js"|"tables.js"|"remote.js")
          process_template "${file}.template" > "${APP_DIR}/${file}"
          ;;
      esac
      echo -e "${GREEN}Created ${APP_DIR}/${file}${NC}"
    fi
  done
}

# Display success message and next steps
# Args: none (uses global APP_ID)
display_success_message() {
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
}

# Main execution function
main() {
  # Check if app ID argument is provided
  if [ $# -eq 0 ]; then
    echo -e "${RED}Error: App ID required${NC}"
    echo "Usage: $0 <app-id>"
    echo "Example: $0 2206.04-2"
    exit 1
  fi

  APP_ID="$1"

  # Parse and validate app ID
  parse_app_id "$APP_ID"

  # Check if app directory already exists
  if [ -d "$APP_DIR" ]; then
    echo -e "${RED}Error: App directory already exists: ${APP_DIR}${NC}"
    exit 1
  fi

  # Display generation plan
  display_generation_plan

  # Get user confirmation
  if ! confirm_generation; then
    exit 0
  fi

  # Create directories
  create_app_directory

  # Generate required files
  generate_required_files

  # Generate optional files
  generate_optional_files

  # Display success message
  display_success_message
}

# Run main function with all script arguments
main "$@"
