#!/usr/bin/env bash
#
# Code Review skill — diff orienteering helper
# ---------------------------------------------
# Produces a compact orientation summary of a diff to start a review:
# stat, rename/copies, and the per-file diff hunks. It is a helper, not a
# review: apply the checklist from resources/checklist.md to the output.
#
# Usage:
#   ./review_diff.sh [<git-ref> [<git-ref>]]   e.g. ./review_diff.sh main
#   Run without arguments to review working tree vs HEAD (staged + unstaged).
#
set -euo pipefail

base="${1:-HEAD}"
other="${2:-}"

echo "== Diff stat ($base"
if [[ -n "$other" ]]; then echo " → $other"; fi
echo ") =="
git diff --stat "$base${other:+ $other}"

echo
echo "== Renamed / copied =="
git diff --summary "$base${other:+ $other}" | grep -E '^\s*(rename|copy)' || echo "(none)"

echo
echo "== Files that look sensitive (check closely) =="
git diff --name-only "$base${other:+ $other}" \
  | grep -E '(\.(env|pem|key|p12|pfx|jks)$|^\.env|(^|/)\.env)|(__pycache__|node_modules|\.venv|venv|dist|build|\.next)(/|$)' \
  || echo "(none flagged by name — still scan content for secrets)"

echo
echo "== Hunk overview (file : lines) =="
git diff --unified=0 "$base${other:+ $other}" \
  | awk '/^diff --git/ {file=$0} /^@@/ {print file "  " $0}' \

echo
echo "Done. Apply the checklist in resources/checklist.md to this diff."