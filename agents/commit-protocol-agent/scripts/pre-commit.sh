#!/usr/bin/env bash
#
# Commit Protocol Agent — pre-commit hook (Brasaland)
# -----------------------------------------------------
# Aplica de forma mecánica los pasos bloqueantes del protocolo que no
# requieren IA: secretos, archivos sensibles/artefactos y especificación
# SDD para cambios en workflows/. Las validaciones semánticas (calidad de
# código, tests, reglas del proyecto, veredicto) las confirma el agente
# de protocolo durante la revisión del commit.
#
# Instalación (una de las dos):
#   cp agents/commit-protocol-agent/scripts/pre-commit.sh .git/hooks/pre-commit \
#     && chmod +x .git/hooks/pre-commit
#   git config core.hooksPath agents/commit-protocol-agent/scripts
#
set -euo pipefail

echo "🔒 Commit Protocol Agent — verificando cambios staged..."

# Patrones de secretos comunes (amplía o quita según el stack del proyecto).
SECRET_PATTERNS=(
  '(-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----)'
  'AKIA[0-9A-Z]{16}'                     # AWS Access Key ID
  'gh[psu]_[0-9A-Za-z]{36}'              # GitHub tokens (PAT, fine-grained, OAuth)
  'xox[baprs]-[0-9A-Za-z-]+'             # Slack tokens
  'sk-[0-9A-Za-z]{20,}'                  # OpenAI-style API keys
  '(api[_-]?key|apikey|secret|password|passwd|token)[s]?[[:space:]]*[:=][[:space:]]*[^[:space:]]+'
)

# Archivos sensibles o de artefactos que nunca deben commitearse.
BLOCKED_NAME_RE='(^|/)(\.env|\.env\..+|.*\.pem|.*\.key|.*\.p12|.*\.pfx|.*\.jks)$'
BLOCKED_PATH_RE='(^|/)(__pycache__|node_modules|\.venv|venv|dist|build|\.next|\.cache)(/|$)'

# ---------------------------------------------------------------------------
# 1. Inspección mínima
# ---------------------------------------------------------------------------
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "❌ No estás dentro de un repositorio Git."
  exit 1
fi

staged=$(git diff --cached --name-only)
if [[ -z "$staged" ]]; then
  echo "ℹ️  No hay cambios staged. Ejecuta 'git add' antes del commit."
  exit 0
fi

# ---------------------------------------------------------------------------
# 2. Integridad y secretos (bloqueante)
# ---------------------------------------------------------------------------
while IFS= read -r file; do
  [[ -z "$file" ]] && continue

  # a) Archivos sensibles / artefactos por nombre
  if [[ "$file" =~ $BLOCKED_NAME_RE ]] || [[ "$file" =~ $BLOCKED_PATH_RE ]]; then
    echo "❌ Archivo bloqueado en el commit: $file"
    echo "   Elimínalo del índice: git rm --cached \"$file\""
    exit 1
  fi

  # b) Escaneo de contenido de archivos de texto staged
  if git show ":$file" 2>/dev/null | grep -qiE "$(IFS='|'; echo "${SECRET_PATTERNS[*]}")"; then
    echo "❌ Posible secreto detectado en: $file"
    echo "   Reemplázalo por una variable \${NOMBRE_VAR} y elimínalo del índice."
    exit 1
  fi
done <<< "$staged"

# ---------------------------------------------------------------------------
# 3. Cambios en workflows/ exigen especificación SDD (bloqueante)
# ---------------------------------------------------------------------------
workflow_dirs=$(git diff --cached --name-only --diff-filter=ACMR \
  | grep '^workflows/' \
  | cut -d'/' -f2 | sort -u | grep -v '^$') || true
blocked=0
for name in $workflow_dirs; do
  spec="workflows/$name/README.md"
  if [[ ! -f "$spec" ]] && ! git cat-file -e ":$spec" 2>/dev/null; then
    echo "❌ Cambio en flujo sin especificación: workflows/$name/"
    echo "   Crea $spec siguiendo el SDD (disparador, entradas, salidas, errores, aceptación)."
    blocked=1
  fi
done
if [[ $blocked -eq 1 ]]; then
  exit 1
fi

# ---------------------------------------------------------------------------
# 4. Lint rápido opcional (solo si la configuración y la herramienta existen)
# ---------------------------------------------------------------------------
if [[ -f "pyproject.toml" ]] && command -v ruff >/dev/null 2>&1; then
  python_files=$(printf '%s\n' "$staged" | grep -E '\.py$' || true)
  if [[ -n "$python_files" ]]; then
    echo "⚙️  ruff check sobre archivos Python staged..."
    ruff check $python_files
  fi
fi

if [[ -f "package.json" ]] && command -v eslint >/dev/null 2>&1; then
  ts_files=$(printf '%s\n' "$staged" | grep -E '\.(ts|tsx)$' || true)
  if [[ -n "$ts_files" ]]; then
    echo "⚙️  eslint sobre archivos TypeScript staged..."
    eslint $ts_files
  fi
fi

echo "✅ Verificación mecánica del protocolo superada."
echo "   Recordatorio: el Commit Protocol Agent debe confirmar la validación"
echo "   semántica (tests, reglas del proyecto, mensaje Conventional Commits)."