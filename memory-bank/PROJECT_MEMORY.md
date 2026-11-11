# 📋 Memoria del Proyecto — Brasaland AI Engineering

> **Documento de memoria del proyecto.** Registra visión general, stack tecnológico, estado actual e hitos.
> _Última actualización: 2026-10-21_

## Actualización del 2026-10-21 — Sitio público y Brasa Points

El hito web ya dispone de una aplicación estática ejecutable en
[uis/landingpage](../uis/landingpage/README.md), independiente del backend
y de los futuros dashboards de Operaciones y Supply Chain.

- **Landing:** presentación de marca, historia, beneficios, 14 restaurantes
  en Colombia y Florida, Brasa Points, contacto, propuesta gastronómica,
  enlaces sociales y JSON-LD `Restaurant` en español.
- **Identidad:** paleta del brandbook, logotipos oficiales en WebP y tres
  fotografías locales optimizadas. [photos.md](../uis/landingpage/photos.md)
  registra fuentes, autorización declarada por el usuario y etiquetas.
  La procedencia comercial de las etiquetas no se verificó independientemente.
- **Formulario:** [application.html](../uis/landingpage/application.html) y
  [validation.js](../uis/landingpage/validation.js). Nombre y fecha de nacimiento
  habilitan la continuación desde los 18 años cumplidos; email, país, ciudad,
  teléfono con prefijo automático, procedencia y términos se validan antes del
  envío. Ofertas, restaurante favorito y preferencias son opcionales.
  País y ciudad limpian selecciones dependientes; el registro anterior conserva
  un enlace de acceso compatible.
- **Simulación:** no hay backend, persistencia, envío de emails ni inscripción
  real. Los términos oficiales siguen pendientes; la casilla es demostrativa.
  Sin JavaScript, los controles permanecen bloqueados con una explicación.
- **Stack real:** HTML, JavaScript, Tailwind CSS 4 compilado, Node.js 22/npm,
  `http-server`; Playwright/Chromium, axe y Lighthouse para comprobaciones.
- **Ejecución:** desde `uis/landingpage`, `npm ci`, `npm run build` y `npm start`.
  Un único puerto, **3000**, sirve landing, formulario y recursos. El 3011 solo
  se utilizó temporalmente para auditar el formulario y está detenido.
- **Documentación:** [AGENTS.md](../uis/landingpage/AGENTS.md),
  [Plan.md](../uis/landingpage/Plan.md), [tasks.md](../uis/landingpage/tasks.md)
  y [README](../uis/landingpage/README.md), con pendientes explícitos.

Verificación local del 2026-10-21: compilación, enlaces y recursos HTTP,
validaciones, umbral de edad, dependencias, consentimiento y controles
opcionales comprobados en Chromium. Sin desbordamientos en nueve anchos del
formulario; axe sin infracciones automáticas en el formulario y la sección
fotográfica. Lighthouse 12.8.2:

| Página | Performance móvil / escritorio | Accesibilidad móvil / escritorio |
| --- | --- | --- |
| Landing con fotografías | 98 / 100 | No se midió la página completa |
| Formulario de demostración | 100 / 100 | 100 / 100 |

El formulario mantiene `noindex` deliberado (SEO 60/63). Son mediciones locales,
no certificación WCAG ni garantías en producción. Pendientes: lector de pantalla,
auditoría integral de la landing, condiciones de atribución de las fotos y
términos oficiales antes de un registro definitivo. Los componentes de backend,
agentes y operaciones descritos más abajo conservan su estado histórico:
no se han implementado como parte de este hito.

---

## 1. Overview del Proyecto

### ¿Quién construye la app?

Este proyecto forma parte del **Programa de Carrera en Ingeniería de IA de 4Geeks Academy**. Es un proyecto transversal que abarca múltiples hitos: Web, Programación, Backend, Telemetría, RAG, Agentes, Workflows y Tiempo Real.

El equipo **Brasaland Digital** (equipo interno creado por la CEO Mariana Restrepo) tiene el mandato de construir las herramientas, sistemas y automatizaciones que permitan a Brasaland operar como una empresa moderna. El alumno actúa como ingeniero dentro de este equipo.

### ¿Quién usará la app?

Los usuarios son los distintos departamentos de **Brasaland**, cadena de restaurantes de cocina a la brasa con 14 locales en Colombia (10) y USA / Florida (4):

| Departamento     | Usuario clave    | Rol                                                 |
| ---------------- | ---------------- | --------------------------------------------------- |
| **Operaciones**  | Felipe Guerrero  | Director de operaciones — supervisa los 14 locales  |
| **Supply Chain** | Lucía Fernández  | Responsable de compras — gestiona ~20 proveedores   |
| **Marketing**    | Camila Ospina    | Marketing digital — fidelización y presencia online |
| **Personas**     | Ashley Turner    | RRHH — gestión de 115 empleados en 2 países         |
| **Formación**    | Jake Morrison    | Calidad y estándares — recetas y formación          |
| **Tecnología**   | Nicolás Park     | CTO — construcción de la plataforma digital         |
| **Dirección**    | Mariana Restrepo | CEO — decisiones estratégicas                       |

### Características clave del proyecto

1. **Monorepo con arquitectura por capas:** Cada carpeta raíz tiene una responsabilidad única (UI, servicios, datos, agentes, etc.), siguiendo el modelo de un repo de ingeniería real.
2. **Enfoque en Operaciones y Supply Chain (fase inicial):** Se prioriza el dashboard de ventas en tiempo real, la previsión de demanda y la validación automatizada de pedidos.
3. **Agente IA multi-sub-agente:** Sistema autónomo que integra previsión de ventas (clima, deportes, calendario) con validación de pedidos a proveedor.
4. **API centralizada (FastAPI):** Single entry point que evita la complejidad de microservicios en etapas tempranas.
5. **Multi-moneda y multi-país:** COP (Colombia) y USD (USA) con tipos de cambio dinámicos.
6. **Pipeline de datos:** Flujo `raw → pipelines → process` que alimenta dashboards, agentes y servicios.

---

## 2. Stack Tecnológico

### Stack base de la plantilla

| Componente               | Tecnología                                             | Estado                                           |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------ |
| **Shared Types**         | TypeScript — `packages/shared/` (`@repo/shared-types`) | ✅ Esqueleto con tipos base (`Id`, `BaseEntity`) |
| **Infraestructura**      | Docker (`.devcontainer/`)                              | ✅ Devcontainer listo                            |
| **Control de versiones** | Git + GitHub                                           | ✅ Repo iniciado                                 |

### Stack propuesto/planeado

| Capa                           | Tecnología propuesta                   | Notas                                                                       |
| ------------------------------ | -------------------------------------- | --------------------------------------------------------------------------- |
| **Backend API**                | **FastAPI** (Python)                   | Recomendado explícitamente por el README del repo                           |
| **Base de datos**              | PostgreSQL                             | Para datos transaccionales (ventas, pedidos, stock)                         |
| **Frontend Dashboards**        | React / Next.js o Streamlit            | Según el milestone (Web/UI). Posiblemente Streamlit para dashboards rápidos |
| **Agentes IA**                 | Python + LangChain / OpenAI SDK        | Para el Forecast & Order AI Agent y subagentes                              |
| **MCP Servers**                | Python (MCP SDK)                       | Para conectar agentes con sistemas (clima, inventario)                      |
| **Workflows / Automatización** | n8n                                    | Orquestación de ETLs nocturnos, alertas, informes                           |
| **Pipeline Datos**             | Python (pandas, numpy)                 | Scripts ETL en `data/pipelines/`                                            |
| **Modelo de forecast**         | Scikit-learn / Prophet / XGBoost       | Para la predicción de ventas con variables externas                         |
| **APIs externas**              | OpenWeather, API liga fútbol (COL/MLS) | Fuentes de clima y eventos deportivos                                       |
| **Contenedores**               | Docker + docker-compose                | Orquestación local de todo el stack                                         |

---

## 3. Estado Actual del Proyecto

### ✅ Lo que funciona / está construido

| Elemento                    | Estado                 | Detalle                                                                                   |
| --------------------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| **Estructura del monorepo** | ✅ Completa            | Todas las carpetas raíz con sus README                                                    |
| **CONTEXT.md**              | ✅ Completado          | Briefing completo de Brasaland (7 departamentos, 14 locales, 2 países)                    |
| **COMPANY CHOICE**          | ✅ Completado          | Empresa elegida (Brasaland), razón, proyectos por departamento y definición del agente IA |
| **Shared types**            | ✅ Esqueleto           | `packages/shared/types/index.ts` con `Id` y `BaseEntity`                                  |
| **Skills raíz**             | ✅ Template listo      | `skills/data-analysis/` con script pandas y métricas de referencia                        |
| **skills/ (data-analysis)** | ✅ Incluido            | Script `pandas_clean.py` y `common_metrics.md`                                            |
| **agents/skills/**          | ✅ README con catálogo | 4 skills definidos: forecast, inventory, order-validation, weather-calendar               |
| **Plantilla de agente**     | ✅ Template            | `agents/_template/` con estructura base                                                   |
| **Devcontainer**            | ✅ Configurado         | `.devcontainer/` presente                                                                 |
| **memory-bank/**            | ✅ Creado              | Documento de memoria del proyecto enlazado desde la raíz                                  |

### 🚧 Lo que está incompleto / no iniciado

| Elemento                             | Estado         | Observaciones                                                                                                                                                                              |
| ------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **agents/skills/\*/SKILL.md**        | ❌ No iniciado | Los 4 skills (`forecast-skill`, `inventory-skill`, `order-validation-skill`, `weather-calendar-skill`) existen como concepto en el README pero no tienen su archivo `SKILL.md` ni ejemplos |
| **Agente forecast-order-agent**      | ❌ No iniciado | Carpeta y código del agente principal sin crear                                                                                                                                            |
| **Agentes/rules**                    | ❌ No iniciado | Reglas de negocio (stock mínimo, país, datos) sin implementar                                                                                                                              |
| **Backend API (FastAPI)**            | ❌ No iniciado | `services/api/` no existe                                                                                                                                                                  |
| **Datos de ejemplo**                 | ❌ No iniciado | `data/raw/`, `data/process/` están vacíos                                                                                                                                                  |
| **Pipelines ETL**                    | ❌ No iniciado | `data/pipelines/` sin scripts                                                                                                                                                              |
| **Dashboards internos**             | ❌ No iniciado | Backoffice pendiente; el sitio público sí está implementado en `uis/landingpage/` |
| **MCP Servers**                      | ❌ No iniciado | `mcps/` vacío                                                                                                                                                                              |
| **Workflows n8n**                    | ❌ No iniciado | `workflows/` vacío                                                                                                                                                                         |
| **Infraestructura (docker-compose)** | ❌ No iniciado | No hay `docker-compose.yml` en raíz                                                                                                                                                        |
| **Documentación de arquitectura**    | ❌ No iniciado | `docs/` solo tiene README                                                                                                                                                                  |
| **scripts/**                         | ❌ Vacío       | Sin scripts auxiliares                                                                                                                                                                     |
| **internal/**                        | ❌ Vacío       | Sin CLIs internas                                                                                                                                                                          |
| **shared/**                          | ❌ Vacío       | Sin assets compartidos                                                                                                                                                                     |
| **packages/shared/types**            | ⚠️ Placeholder | Solo tipos base (`Id`, `BaseEntity`), sin tipos de dominio                                                                                                                                 |

---

## 4. Próximas Prioridades Sugeridas

Basado en la visión del proyecto (Operaciones + Supply Chain) y el estado actual:

### Prioridad 1 — Fundamentos del Agente IA

1. Crear `agents/skills/forecast-skill/SKILL.md` — Skill de previsión de ventas
2. Crear `agents/skills/inventory-skill/SKILL.md` — Skill de inventario y escandallos
3. Crear `agents/skills/order-validation-skill/SKILL.md` — Skill de validación de pedidos
4. Crear `agents/skills/weather-calendar-skill/SKILL.md` — Skill de clima, deportes y calendario

### Prioridad 2 — Datos de ejemplo y pipeline

5. Poblar `data/raw/` con datasets sintéticos:
   - Ventas históricas (formato CSV con fechas, locales, importes, productos)
   - Catálogo de proveedores (nombres, productos, precios, plazos)
   - Escandallos de recetas (producto → ingredientes + cantidades)
   - Inventario inicial por local

### Prioridad 3 — Backend API

6. Crear `services/api/` con FastAPI:
   - Router de locales (`/locations`)
   - Router de ventas (`/sales`)
   - Router de proveedores (`/suppliers`)
   - Router de inventario (`/inventory`)

### Prioridad 4 — Agente Principal

7. Implementar `agents/forecast-order-agent/` con su orquestador y sub-agentes
8. Conectar agentes con MCP servers para acceso a datos en vivo

### Prioridad 5 — Dashboards

9. Crear `uis/backoffice/` con dashboard de operaciones y panel de supply chain
10. Conectar dashboards con la API

---

## 5. Hitos y Modificaciones

| Fecha      | Hito / Cambio              | Descripción                                                                             |
| ---------- | -------------------------- | --------------------------------------------------------------------------------------- |
| 2026-10-15 | 🏁 Inicio del proyecto     | Creación de la memoria del proyecto, revisión de estructura y definición de prioridades |
| 2026-10-15 | 📁 `agents/skills/` creado | Catálogo de skills reutilizables para Brasaland con 4 skills definidos                  |
| 2026-10-15 | 📁 `memory-bank/` creado   | Documento de memoria movido de `docs/` a `memory-bank/` en la raíz del proyecto         |
| Próximo    | 🎯 Skills SKILL.md         | Crear los archivos `SKILL.md` de cada skill con inputs, proceso y outputs               |
| Próximo    | 📊 Datos sintéticos        | Generar datasets de ejemplo para ventas, proveedores, escandallos e inventario          |
| Próximo    | ⚙️ API FastAPI             | Implementar backend centralizado con routers de operaciones y supply chain              |
| Próximo    | 🤖 Agente IA               | Implementar Forecast & Order AI Agent con arquitectura multi-sub-agente                 |

---

> **Nota:** Este documento debe actualizarse con cada hito completado o cambio significativo en la arquitectura del proyecto.
