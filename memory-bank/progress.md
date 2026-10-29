# Progress — Brasaland AI Engineering

> **Estado actual del desarrollo:** lo que funciona, lo que está pendiente y próximos pasos.
> _Última actualización: 2026-10-15_

---

## 1. Resumen del Estado

```
Proyecto: Brasaland AI Engineering
Inicio:   2026-10-15
Fase:     Inicial (Definición y estructura)
Estado:   ⚡ 11 elementos completos · 15 pendientes
```

---

## 2. Lo que funciona (✅)

| Elemento | Estado | Detalle |
|---|---|---|
| **Estructura del monorepo** | ✅ Completa | Todas las carpetas raíz con sus README |
| **CONTEXT.md** | ✅ Completado | Briefing completo de Brasaland (7 departamentos, 14 locales, 2 países) |
| **COMPANY CHOICE** | ✅ Completado | Empresa elegida, razón, proyectos por departamento y definición del agente IA |
| **Shared types** | ✅ Esqueleto | `packages/shared/types/index.ts` con `Id` y `BaseEntity` |
| **skills/data-analysis/** | ✅ Incluido | Script `pandas_clean.py` + `common_metrics.md` |
| **skills/tdd/** | ✅ Incluido | Skill TDD de `mattpocock/skills` reubicada a `skills/tdd/` (SKILL.md, tests.md, mocking.md) y mejorada (Objective, Inputs, Acceptance Criteria) |
| **skills/code-review/** | ✅ Incluido | Skill de revisión de código creada desde cero: SKILL.md, checklist, severidades, ejemplos bueno/malo y `review_diff.sh` |
| **agents/skills/README.md** | ✅ Creado | Catálogo con 4 skills definidos (forecast, inventory, order-validation, weather-calendar) |
| **agents/_template/** | ✅ Template | Plantilla base para nuevos agentes con estructura y tests |
| **Devcontainer** | ✅ Configurado | `.devcontainer/` listo para desarrollo |
| **memory-bank/** | ✅ Creado | `projectbrief.md`, `techContext.md`, `progress.md` establecidos |

---

## 3. Lo que está incompleto / no iniciado (🚧 ❌)

### 🟡 En progreso / esbozado

| Elemento | Estado | Notas |
|---|---|---|
| `agents/skills/*/SKILL.md` | 📝 Esbozado | 4 skills definidos en README, pendientes de crear su `SKILL.md` individual |
| `packages/shared/types/index.ts` | ⚠️ Placeholder | Solo tipos base, sin tipos de dominio Brasaland |

### 🔴 No iniciado

| Elemento | Prioridad | Notas |
|---|---|---|
| `agents/forecast-order-agent/` | 🔴 Alta | Carpeta y código del agente principal sin crear |
| `agents/rules/` | 🔴 Alta | Reglas de negocio (stock mínimo, país, datos) sin implementar |
| `services/api/` (FastAPI) | 🔴 Alta | Backend centralizado sin iniciar |
| `data/raw/` + `data/process/` | 🔴 Alta | Sin datasets de ejemplo (ventas, proveedores, escandallos, inventario) |
| `data/pipelines/` | 🔴 Alta | Sin scripts ETL |
| `uis/backoffice/` | 🔴 Media | Dashboard de operaciones y panel supply chain sin crear |
| `mcps/` (MCP Servers) | 🔴 Media | Sin servidores MCP (clima, inventario) |
| `workflows/` (n8n) | 🔴 Media | Sin flujos de automatización |
| `docker-compose.yml` | 🔴 Media | Sin orquestación de contenedores |
| `docs/architecture.md` | 🔴 Baja | Sin documentación de arquitectura |
| `scripts/` | 🔴 Baja | Vacío |
| `internal/` | 🔴 Baja | Vacío |
| `shared/` | 🔴 Baja | Vacío |

---

## 4. Próximos Pasos (Roadmap)

### 🎯 Sprint actual — Prioridad 1: Fundamentos del Agente IA

| # | Tarea | Archivo | Dependencias |
|---|---|---|---|
| 1 | Crear `agents/skills/forecast-skill/SKILL.md` | Skill de previsión de ventas | — |
| 2 | Crear `agents/skills/inventory-skill/SKILL.md` | Skill de inventario y escandallos | — |
| 3 | Crear `agents/skills/order-validation-skill/SKILL.md` | Skill de validación de pedidos | — |
| 4 | Crear `agents/skills/weather-calendar-skill/SKILL.md` | Skill de clima, deportes y calendario | — |

### ⏳ Siguiente — Prioridad 2: Datos de ejemplo y pipeline

| # | Tarea | Descripción |
|---|---|---|
| 5 | Generar `data/raw/ventas_historicas.csv` | Dataset sintético de ventas (2 años, 14 locales) |
| 6 | Generar `data/raw/proveedores_catalogo.csv` | ~20 proveedores con productos, precios y plazos |
| 7 | Generar `data/raw/escandallos_recetas.json` | Recetas → ingredientes + cantidades |
| 8 | Generar `data/raw/inventario_inicial.csv` | Stock inicial por local |

### ⏳ Después — Prioridad 3: Backend API

| # | Tarea | Descripción |
|---|---|---|
| 9 | Crear `services/api/main.py` | App FastAPI principal |
| 10 | Crear `services/api/routers/locations.py` | CRUD de locales |
| 11 | Crear `services/api/routers/sales.py` | Ventas tiempo real e históricas |
| 12 | Crear `services/api/routers/suppliers.py` | Proveedores, precios y alertas |
| 13 | Crear `services/api/routers/inventory.py` | Stock y escandallos |

### ⏳ Posterior — Prioridad 4: Agente IA + Prioridad 5: Dashboards

| # | Tarea | Descripción |
|---|---|---|
| 14 | Implementar `agents/forecast-order-agent/` | Orquestador + 4 sub-agentes |
| 15 | Crear `uis/backoffice/` | Dashboard operaciones + panel supply chain |

---

## 5. Hitos y Modificaciones

| Fecha | Hito | Descripción |
|---|---|---|
| 2026-10-15 | 🏁 Inicio del proyecto | Estructura del monorepo revisada. Contexto de Brasaland cargado. |
| 2026-10-15 | 📁 `agents/skills/` creado | Catálogo de skills con 4 skills definidos para Brasaland |
| 2026-10-15 | 📁 `memory-bank/` creado | Documentación de memoria dividida en 3 archivos: `projectbrief.md`, `techContext.md`, `progress.md` |
| 2026-10-15 | 📁 `skills/tdd/` incorporada | Skill TDD de `mattpocock/skills` reubicada a ubicación canónica y mejorada (Objective, Inputs, Acceptance Criteria) |
| 2026-10-15 | 📁 `skills/code-review/` creada | Skill de revisión de código completa (checklist, severidades, ejemplos, script de diff) |
| 2026-10-15 | 🤖 Agentes creados | `sdd-workflow-agent` (diseño de workflows SDD) y `commit-protocol-agent` (protocolo pre-commit obligatorio) |

---

## 6. Métricas de Progreso

```
Hitos completados:   4/8  (50%)
Skills definidos:    4/4  (100% en README, 0% con SKILL.md)
Skills globales:     2/—  (tdd, code-review incorporadas)
Agentes creados:     2/—  (sdd-workflow-agent, commit-protocol-agent)
Servicios (API):     0/1  (0%)
Datasets:            0/4  (0%)
Dashboards:          0/2  (0%)
Workflows:           0/5  (0%)
```

> **Nota:** Este documento se actualiza al completar cada hito. Las tablas de próximos pasos se replanifican según las prioridades del momento.