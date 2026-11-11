# Tech Context — Brasaland AI Engineering

> **Contexto tecnológico:** stack, arquitectura, decisiones técnicas y restricciones.
> _Última actualización: 2026-10-21_

---

## 1. Stack Tecnológico

### Frontend público implementado — 2026-10-21

La aplicación [uis/landingpage](../uis/landingpage/README.md) utiliza HTML
semántico, JavaScript y Tailwind CSS 4 compilado y minificado, sin framework,
fuentes remotas ni CDN de estilos. Node.js 22/npm gestionan las dependencias
locales de la aplicación; no se presupone un runner global del monorepo.

- `index.html`: landing y JSON-LD `Restaurant`, idioma base español.
- `application.html` y `validation.js`: registro simulado, control de edad,
  prefijos automáticos, dependencias país/ciudad/restaurante y validación.
- `registro.html`: acceso compatible al nuevo formulario.
- `src/styles.css` → `assets/styles.css`: paleta y utilidades Tailwind.
- `assets/`: logos y fotografías WebP locales; trazabilidad en
  [photos.md](../uis/landingpage/photos.md).
- Desarrollo: `npm ci`, `npm run build`, `npm start` desde `uis/landingpage`.
  `http-server` sirve todas las páginas en `0.0.0.0:3000`; en Codespaces se abre
  el puerto reenviado. El 3011 fue exclusivo de una auditoría ya finalizada.
- Navegación HTML sin JavaScript; formulario bloqueado con explicación si
  JavaScript no está disponible. Sin API, almacenamiento, cookies de registro
  ni emails. El prefijo es visible y el número nacional requiere diez dígitos.
- Validación local: Playwright/Chromium, axe y Lighthouse 12.8.2. Para instalar
  Chromium en este entorno se usó
  `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu22.04-x64 npx playwright install chromium`.

### Stack base (heredado de la plantilla)

| Componente | Tecnología | Ubicación | Estado |
|---|---|---|---|
| **Shared Types** | TypeScript | `packages/shared/` (`@repo/shared-types`) | ⚠️ Esqueleto (`Id`, `BaseEntity`) |
| **Devcontainer** | Docker | `.devcontainer/` | ✅ Configurado |
| **Control de versiones** | Git + GitHub | — | ✅ Repo iniciado |
| **Skills raíz** | Python (pandas) | `skills/data-analysis/` | ✅ Incluido (script limpieza + métricas) |

### Stack propuesto / planeado

| Capa | Tecnología | Justificación |
|---|---|---|
| **Backend API** | **FastAPI** (Python) | Recomendado por el README del repo. Framework moderno, async, con documentación automática (OpenAPI) |
| **Base de datos** | PostgreSQL | Datos transaccionales: ventas, inventario, pedidos, proveedores |
| **Frontend Dashboards** | React / Next.js o Streamlit | Streamlit para prototipado rápido. React/Next.js para producción |
| **Agentes IA** | Python + LangChain / OpenAI SDK | Orquestación de sub-agentes con prompts y tools |
| **MCP Servers** | Python (MCP SDK) | Conectar agentes con fuentes de datos externas (clima, inventario) |
| **Workflows** | n8n | Orquestación visual de ETLs nocturnos, alertas e informes |
| **Pipeline Datos** | Python (pandas, numpy) | Scripts ETL en `data/pipelines/` |
| **Modelo Forecast** | Scikit-learn / Prophet / XGBoost | Predicción de ventas con variables externas |
| **APIs Externas** | OpenWeather, API liga fútbol (COL/MLS) | Variables climáticas y eventos deportivos |
| **Contenedores** | Docker + docker-compose | Orquestación local de todo el stack desde la raíz |

---

## 2. Decisiones de Arquitectura

### ADR-001: Monorepo con capas por responsabilidad
- **Contexto:** El proyecto abarca múltiples hitos y tecnologías.
- **Decisión:** Cada carpeta raíz tiene una única responsabilidad (UI, API, datos, agentes, etc.).
- **Consecuencia:** Clara separación de concerns. Fácil de navegar y escalar.

### ADR-002: API centralizada (no microservicios)
- **Contexto:** El README del repo recomienda explícitamente no dividir en microservicios al inicio.
- **Decisión:** Una sola app FastAPI con routers por dominio (`/locations`, `/sales`, `/suppliers`, `/inventory`).
- **Consecuencia:** Menor complejidad operativa. Extraer workers solo cuando sea estrictamente necesario.

### ADR-003: Agente multi-sub-agente con orquestador
- **Contexto:** El agente de previsión y pedidos integra múltiples fuentes de datos y reglas de negocio.
- **Decisión:** Arquitectura de sub-agentes (Forecast, Inventory, Order Validator, Calendar & Weather) coordinados por un orquestador central.
- **Consecuencia:** Cada sub-agente es independiente y testeable por separado. El orquestador consolida resultados.

### ADR-004: Pipeline de datos raw → pipelines → process
- **Contexto:** Los datos vienen de múltiples fuentes (TPV, proveedores, APIs externas) en formatos dispares.
- **Decisión:** Flujo `data/raw/` → `data/pipelines/` → `data/process/`. Los pipelines transforman y limpian.
- **Consecuencia:** Trazabilidad completa del origen al dato consumible. Reproducibilidad.

### ADR-005: Memoria del proyecto en `memory-bank/`
- **Contexto:** Se necesita un sistema de documentación vivo que registre el estado y decisiones del proyecto.
- **Decisión:** Carpeta `memory-bank/` en la raíz con tres archivos: `projectbrief.md`, `techContext.md`, `progress.md`.
- **Consecuencia:** Documentación centralizada, fácil de consultar y actualizar, independiente de `docs/`.

### ADR-006: Hito web estático y registro de demostración (2026-10-21)
- **Decisión:** HTML, JavaScript y Tailwind compilado en `uis/landingpage/`,
  servido desde un único puerto 3000, sin dependencia del backend planeado.
- **Privacidad y alcance:** solo validación en navegador; edad mínima de
  18 años cumplidos, términos demostrativos y ningún envío o persistencia.
- **Recursos:** fotografías locales optimizadas con permiso declarado por
  el usuario; no depender de URLs firmadas de Facebook en el HTML.
- **Calidad:** mediciones locales registradas en el README; formulario `noindex`
  deliberado hasta que exista una inscripción real con términos oficiales.

---

## 3. Estructura del Monorepo

```
/                               ← Raíz
├── memory-bank/                ← Memoria del proyecto (projectbrief, techContext, progress)
├── agents/                     ← Agentes de IA
│   ├── skills/                 ← Skills reutilizables para agentes
│   ├── tools/                  ← Tools compartidas (existente)
│   └── _template/              ← Plantilla para nuevos agentes
├── services/                   ← Backend (FastAPI)
├── data/                       ← Datos y pipelines
│   ├── raw/                    ← Datos fuente sin tocar
│   ├── pipelines/              ← Scripts ETL
│   ├── process/                ← Datos limpios
│   └── eval/                   ← Evaluación
├── uis/                        ← Frontends
├── workflows/                  ← Automatización (n8n)
├── mcps/                       ← Servidores MCP
├── packages/                   ← Librerías compartidas
│   └── shared/                 ← @repo/shared-types
├── shared/                     ← Assets sueltos
├── skills/                     ← Skills globales (raíz)
├── docs/                       ← Documentación transversal
├── infra/                      ← Infraestructura
├── scripts/                    ← Scripts auxiliares
└── internal/                   ← CLIs internas
```

---

## 4. Restricciones Técnicas

### Delimitaciones del proyecto
1. **Multi-moneda obligatoria:** Todos los componentes que manejen importes deben soportar COP y USD simultáneamente, con tipo de cambio dinámico.
2. **Multi-país:** La lógica de negocio debe adaptarse a Colombia y USA (lead times, proveedores, legislación).
3. **Sin PII en agentes:** Los agentes de IA no pueden acceder a datos personales de empleados ni información financiera sensible.
4. **Sin microservicios en fase inicial:** Todo el backend en una misma app FastAPI.

### Dependencias externas
| Servicio | Propósito | API |
|---|---|---|
| OpenWeather | Clima en tiempo real y pronóstico | REST API (API key) |
| API Liga Fútbol COL/MLS | Eventos deportivos | REST API |
| Banco de la República | TRM (tasa de cambio COP/USD) | REST API o scraping |

### Convenios técnicos
- **Lenguaje principal:** Python (backend, agentes, pipelines, MCP)
- **Frontend público actual:** HTML/JavaScript y Tailwind; React/TypeScript o
  Streamlit permanecen como opciones para futuros dashboards.
- **Documentación:** Markdown, siempre enlazada desde los README de cada carpeta
- **Control de versiones:** Git flow simplificado (main + ramas por hito)

---

## 5. Flujo de Datos (Operaciones + Supply Chain)

```
TPV / POS (cada local)
    ↓ (exportación diaria o en tiempo real)
data/raw/ventas_tpv_*.csv
    ↓
data/pipelines/etl_ventas.py
    ↓
data/process/ventas_diarias.parquet
    │
    ├──→ services/api/  (GET /sales/realtime, GET /sales/history)
    │       │
    │       ├──→ uis/backoffice/DashboardOperaciones
    │       │
    │       └──→ agents/forecast-order-agent/
    │               ├── Calendar&Weather Agent (APIs externas)
    │               ├── Forecast Agent (predice ventas)
    │               ├── Inventory Agent (stock + escandallos)
    │               └── Order Validator Agent (genera/valida pedidos)
    │                   │
    │                   └──→ services/api/ (POST /orders/validate)
    │                           │
    │                           ├──→ uis/backoffice/Recomendación Pedidos
    │                           └──→ Proveedor (pedido generado)
    │
data/raw/proveedores_*.xlsx
    ↓
data/pipelines/etl_proveedores.py
    ↓
data/process/historico_precios.parquet
    │
    └──→ services/api/ (GET /suppliers, GET /suppliers/{id}/price-history)
            │
            └──→ uis/backoffice/PanelSupplyChain
```

> **Nota:** Este documento registra las decisiones tecnológicas del proyecto. Cualquier cambio en el stack o la arquitectura debe reflejarse aquí.