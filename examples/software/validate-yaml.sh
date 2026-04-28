#!/bin/bash
# Validate CHIMERA body scan YAML files against schema v1.0
# Usage: ./validate-yaml.sh [directory]

DIR="${1:-.}"
ERRORS=0
CHECKED=0
PASSED=0

# Required top-level keys
REQUIRED_KEYS=(
  "schema_version"
  "scan_type"
  "identity"
  "nine_questions"
  "dna"
  "skeleton"
  "powers"
  "classification"
  "structural_weakness"
  "cross_domain"
  "fruit"
  "powers_detected"
)

# Required identity sub-keys
IDENTITY_KEYS=("subject" "body_type" "domain" "scale" "protocol_version")

# Required DNA sub-keys
DNA_KEYS=("o_vs_i" "pause_quality" "not_force")

# Required powers sub-keys
POWER_KEYS=("perceive" "govern" "project" "create" "release" "primary_gap")

echo "=== CHIMERA YAML Validation (Schema v1.0) ==="
echo ""

for yaml_file in "$DIR"/*.yaml; do
  [ "$yaml_file" = "$DIR/schema.yaml" ] && continue
  [ ! -f "$yaml_file" ] && continue

  CHECKED=$((CHECKED + 1))
  BASENAME=$(basename "$yaml_file")
  FILE_ERRORS=0

  # Check each required top-level key
  for key in "${REQUIRED_KEYS[@]}"; do
    if ! grep -q "^${key}:" "$yaml_file" 2>/dev/null; then
      echo "FAIL [$BASENAME]: missing required key '$key'"
      FILE_ERRORS=$((FILE_ERRORS + 1))
    fi
  done

  # Check identity sub-keys
  for key in "${IDENTITY_KEYS[@]}"; do
    if ! grep -q "  ${key}:" "$yaml_file" 2>/dev/null; then
      echo "FAIL [$BASENAME]: missing identity.$key"
      FILE_ERRORS=$((FILE_ERRORS + 1))
    fi
  done

  # Check DNA sub-keys
  for key in "${DNA_KEYS[@]}"; do
    if ! grep -q "  ${key}:" "$yaml_file" 2>/dev/null; then
      echo "FAIL [$BASENAME]: missing dna.$key"
      FILE_ERRORS=$((FILE_ERRORS + 1))
    fi
  done

  # Check powers sub-keys
  for key in "${POWER_KEYS[@]}"; do
    if ! grep -q "  ${key}:" "$yaml_file" 2>/dev/null; then
      echo "FAIL [$BASENAME]: missing powers.$key"
      FILE_ERRORS=$((FILE_ERRORS + 1))
    fi
  done

  # Check skeleton is not empty
  SKELETON=$(grep "^skeleton:" "$yaml_file" 2>/dev/null | sed 's/^skeleton: *//')
  if [ -z "$SKELETON" ] || [ "$SKELETON" = '""' ]; then
    echo "FAIL [$BASENAME]: skeleton is empty"
    FILE_ERRORS=$((FILE_ERRORS + 1))
  fi

  # Check structural weakness has content
  if ! grep -q "  primary:" "$yaml_file" 2>/dev/null; then
    echo "FAIL [$BASENAME]: structural_weakness.primary missing"
    FILE_ERRORS=$((FILE_ERRORS + 1))
  fi

  # Check corresponding markdown exists
  MD_FILE="${yaml_file%.yaml}.md"
  if [ ! -f "$MD_FILE" ]; then
    echo "WARN [$BASENAME]: no matching .md file found"
  fi

  if [ $FILE_ERRORS -eq 0 ]; then
    echo "PASS [$BASENAME]"
    PASSED=$((PASSED + 1))
  else
    ERRORS=$((ERRORS + FILE_ERRORS))
  fi
done

echo ""
echo "=== Results ==="
echo "Checked: $CHECKED files"
echo "Passed:  $PASSED"
echo "Failed:  $((CHECKED - PASSED))"
echo "Errors:  $ERRORS"

if [ $ERRORS -gt 0 ]; then
  exit 1
fi
echo "All validations passed."
