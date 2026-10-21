# Project Brief — Brasaland AI Engineering

> **Visión general del proyecto:** descripción del negocio, objetivos, usuarios y problemas a resolver.
> _Última actualización: 2026-10-15_

---

## 1. El Negocio: Brasaland

Brasaland es una cadena de restaurantes de cocina a la brasa fundada en 2008 en Medellín, Colombia. Hoy cuenta con **14 locales propios** en dos países:

| Mercado | Locales | Moneda |
|---|---|---|
| Colombia | 10 | COP (peso colombiano) |
| Estados Unidos (Florida) | 4 | USD (dólar estadounidense) |

**Empleados:** ~115 personas
**Facturación:** ~6 millones USD anuales
**CEO:** Mariana Restrepo (hija del fundador, desde 2019)

La marca se sustenta en tres pilares:
1. Comida consistente — sabe igual en Medellín que en Miami
2. Experiencia de servicio cálida y consistente
3. Cocina que se mueve rápido (operaciones eficientes)

## 2. Situación Actual

Brasaland es rentable pero opera con herramientas heredadas:

- Pedidos a proveedores por WhatsApp / teléfono
- Programa de fidelización con tarjetas físicas de sello (60% de clientes no las usan)
- Web estática de 2019, app desactualizada
- Sin visibilidad en tiempo real de ventas por local
- TPV/POS diferente en cada país, sin integración
- Hojas de Excel como sistema de gestión
- Decisiones basadas en llamadas telefónicas e informes PDF semanales

Mariana ha creado el equipo **Brasaland Digital** para construir la plataforma digital de la empresa desde cero.

## 3. Objetivos del Proyecto

### Objetivo general
Construir las herramientas, sistemas y automatizaciones que permitan a Brasaland operar como una empresa moderna, cubriendo los hitos del programa (Web, Programación, Backend, Telemetría, RAG, Agentes, Workflows, Tiempo Real).

### Objetivos específicos (fase inicial: Operaciones + Supply Chain)

| Departamento | Problema | Solución |
|---|---|---|
| **Operaciones** (Felipe Guerrero) | Sin visibilidad de ventas en tiempo real. Pedidos manuales por WhatsApp. Exceso/rotura de stock. | Dashboard ventas tiempo real (COP/USD). Sistema inteligente de pedidos. Alertas automáticas de local inactivo. |
| **Supply Chain** (Lucía Fernández) | ~20 proveedores sin datos consolidados. Precios negociados por email/Excel. Sin alertas de cambios de precio. | Plataforma gestión proveedores con historial de precios y alertas. Visibilidad consolidada de compras. FoodCost dinámico. |
| **Dirección** (Mariana Restrepo) | Sin dashboard unificado. Decisiones sin datos en tiempo real. | Dashboard ejecutivo con ventas totales cadena (COP/USD). Asistente IA consultable en lenguaje natural. Informe semanal automatizado. |

## 4. Usuarios Clave

| Rol | Usuario | Necesidad principal |
|---|---|---|
| Director de Operaciones | Felipe Guerrero | Supervisar 14 locales en tiempo real |
| Responsable de Compras | Lucía Fernández | Gestionar 20 proveedores en 2 mercados |
| CTO | Nicolás Park | Construir API central, telemetría y pipeline de datos |
| CEO | Mariana Restrepo | Visibilidad ejecutiva y toma de decisiones basada en datos |
| Cocinero / Staff | — | Recibir pedidos optimizados y mise en place calculada |

## 5. Agente IA Principal

**Forecast & Order AI Agent** — Sistema autónomo que integra:

1. **Previsión de ventas** usando 4 variables:
   - Histórico de ventas + product mix
   - Variables atmosféricas (OpenWeather / AEMET)
   - Efecto calendario (festivos, puentes, estacionalidad)
   - Eventos deportivos (fútbol liga local / MLS)

2. **Validación y generación de pedidos** a proveedor:
   - Cruce forecast + inventario actual + escandallos
   - Reglas de negocio (stock mínimo, rotación, frescura)
   - Pedidos optimizados o rechazo/ajuste de pedidos entrantes

3. **Auto-aprendizaje**:
   - Retroalimentación del error de predicción vs ventas reales
   - Ajuste automático de pesos de las variables (recalibración cada 30 días)

### Outputs del agente
- 📊 Dashboard de previsión de ventas (forecast + bandas de confianza)
- 📋 Recomendación de pedidos a proveedor
- 👨‍🍳 Propuesta de mise en place (cantidades por producto)
- 👥 Staff mínimo recomendado
- ✅ Validación automática de pedidos

## 6. Departamentos Involucrados (visión completa)

| # | Departamento | Responsable | Área |
|---|---|---|---|
| 1 | 🍖 Operaciones de restaurante | Felipe Guerrero | 14 locales, 2 países |
| 2 | 🛒 Compras y proveedores | Lucía Fernández | ~20 proveedores COL + USA |
| 3 | 📱 Marketing y experiencia digital | Camila Ospina | Web, fidelización, CRM |
| 4 | 🧑‍🤝‍🧑 Personas y cultura | Ashley Turner | RRHH 115 empleados |
| 5 | 🎓 Formación y estándares de calidad | Jake Morrison | Recetas, formación multi-idioma |
| 6 | 💻 Tecnología | Nicolás Park | Plataforma digital |
| 7 | 📊 Dirección ejecutiva | Mariana Restrepo | Estrategia y reporting |

> **Nota:** Este documento es la fuente única de verdad sobre el qué y el porqué del proyecto. Cualquier cambio en el alcance o los objetivos debe reflejarse aquí primero.