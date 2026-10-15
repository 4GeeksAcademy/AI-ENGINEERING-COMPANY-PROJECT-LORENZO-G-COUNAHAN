# Carpeta `agents`

Esta carpeta contiene los **agentes de IA** del monorepo (asistentes, copilotos internos, agentes de soporte/operaciones, etc.) que se construyen como parte de los hitos transversales de AI Engineering.

Cada subcarpeta dentro de `agents/` debería representar **un agente concreto** (por ejemplo `support-agent`, `onboarding-agent`, `sales-assistant`) con su propia documentación: objetivo, capacidades, fuentes de conocimiento/memoria, herramientas disponibles y cómo probarlo.

- **Propósito principal**: centralizar el desarrollo de agentes reutilizables para la compañía dentro del monorepo.
- **Recomendación**: documenta aquí el catálogo de agentes que se vaya creando y enlaza a los READMEs de cada agente.

## Catálogo de agentes

| Agente | Propósito | Documentación |
|---|---|---|
| `sdd-workflow-agent` | Convierte solicitudes de automatización en especificaciones revisables, planes de implementación y, cuando se solicite, exportaciones n8n mediante Spec-Driven Development. | [README](./sdd-workflow-agent/README.es.md) |
