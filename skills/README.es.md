# Carpeta `skills`

Esta carpeta contiene las **skills de agentes** (capacidades reusables) que ayudan a trabajar de forma consistente en el monorepo: investigación, análisis de datos, revisión de código, scraping, matemáticas, etc.

- **Propósito principal**: estandarizar cómo los agentes de IA asisten al equipo en los distintos hitos del proyecto transversal.
- **Recomendación**: documenta cada skill que añadas (cuándo usarla, inputs/outputs esperados, ejemplos) y mantén una estructura clara por subcarpetas para facilitar su descubrimiento.

## Catálogo de skills

| Skill           | Propósito                                                                                                                                                                                | Documentación                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `tdd`           | Referencia de desarrollo guiado por tests (red → green → refactor): buenos tests, seams, anti-patrones y reglas del bucle. Instalada desde `mattpocock/skills`.                          | [SKILL.md](./tdd/SKILL.md)                               |
| `code-review`   | Revisión de código sistemática: flujo de trabajo, checklist, niveles de severidad, ejemplos bueno/malo y script de resumen de diffs. El hogar de la etapa de refactoring que delega TDD. | [SKILL.md](./code-review/SKILL.md)                       |
| `data-analysis` | Utilidades de análisis de datos (métricas, scripts de limpieza con pandas).                                                                                                              | [resources](./data-analysis/resources/common_metrics.md) |
| `research`      | Flujos de investigación (placeholders).                                                                                                                                                  | —                                                        |

> **Dónde viven las skills.** Las skills globales e independientes de dominio viven en `skills/<nombre-skill>/`. Las skills de dominio específicas de Brasaland viven en [`agents/skills/`](../agents/skills/README.es.md). El instalador `npx skills` escribe en el área local `.agents/skills/` (ignorada por Git); un symlink en `.agents/skills/tdd` apunta a la copia canónica aquí para que el descubrimiento siga funcionando sin duplicar archivos.
