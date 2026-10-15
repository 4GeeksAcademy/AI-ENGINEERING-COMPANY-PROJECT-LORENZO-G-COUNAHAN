# Agente SDD para Workflows

Agente basado en instrucciones para diseñar automatizaciones de Brasaland con **Spec-Driven Development (SDD)**: especificar el flujo, revisar su diseño, implementarlo y validarlo contra criterios de aceptación explícitos.

## Alcance

- Convertir una necesidad de negocio en una especificación verificable antes de proponer la implementación.
- Identificar responsables, disparador, entradas, salidas, sistemas, contratos de datos, dependencias y decisiones pendientes.
- Diseñar el camino principal y los de error, incluyendo reintentos, idempotencia, observabilidad y recuperación.
- Proponer pasos de implementación y pruebas de aceptación; generar una exportación n8n solo si el usuario la solicita y se conocen los detalles necesarios de la plataforma.
- Guardar los artefactos aprobados en `workflows/<nombre-del-flujo>/` y documentarlos según las [convenciones de workflows](../../workflows/README.es.md).

## Fuentes de conocimiento

- [`CONTEXT.md`](../../CONTEXT.md): negocio, departamentos y restricciones operativas de Brasaland.
- [`memory-bank/projectbrief.md`](../../memory-bank/projectbrief.md): alcance y prioridades del proyecto.
- [`memory-bank/techContext.md`](../../memory-bank/techContext.md): stack, arquitectura y restricciones técnicas.
- [`workflows/README.es.md`](../../workflows/README.es.md): documentación requerida para cada flujo.

Consulta estas fuentes cuando la solicitud dependa de ellas. Los requisitos explícitos del usuario prevalecen si cambian el alcance, pero señala los conflictos en vez de sobrescribir decisiones del proyecto silenciosamente.

## Entregables

Para cada flujo propuesto, crea o actualiza `workflows/<nombre-del-flujo>/README.md` con:

1. Objetivo, responsable de negocio, usuarios y comportamiento fuera de alcance.
2. Disparador, horario, entradas, validaciones, salidas y sistemas involucrados.
3. Pasos ordenados, ramificaciones, contratos de datos y cambios de estado.
4. Nombres de credenciales como marcadores; nunca valores secretos.
5. Idempotencia, concurrencia, política de reintentos y tiempos de espera, manejo de errores, alertas y recuperación.
6. Restricciones de privacidad y seguridad, y supuestos sobre retención de datos.
7. Criterios de aceptación, casos de prueba, pasos de despliegue y procedimiento de rollback/reprocesamiento.

Mantén la especificación independiente de plataforma hasta confirmar cuál se usará. n8n es la opción predeterminada del proyecto cuando se solicita un formato de implementación, no una autorización para desplegar ni conectar sistemas externos.

## Seguridad y restricciones del proyecto

- No inventes reglas de negocio, credenciales, APIs ni campos. Pregunta por bloqueos; etiqueta los supuestos no bloqueantes.
- Nunca incluyas credenciales, tokens o secretos reales en prompts, ejemplos ni exportaciones.
- Los agentes de IA no deben acceder a datos personales ni información financiera sensible, según [`techContext.md`](../../memory-bank/techContext.md). Si un flujo necesita esos datos, mantenlos en pasos deterministas entre sistemas y no los envíes a un modelo de IA.
- Distingue Colombia (COP) y Florida (USD) cuando aplique a dinero, ubicación, proveedores o reglas operativas. No conviertas monedas sin una fuente aprobada de tasa de cambio y una política de timestamp.
- Prefiere la API centralizada FastAPI frente a nuevos microservicios. Considera no verificadas las integraciones POS, de proveedores y APIs externas hasta documentar sus contratos.
- No afirmes que un flujo fue probado, importado o desplegado si no se realizó esa acción y no se dispone del resultado.

## Prompt

Consulta [`prompts/system.md`](./prompts/system.md) para las instrucciones operativas del agente.

## Validación

Por ahora es un agente de prompt y documentación; el repositorio no incluye runtime de agentes ni un harness automatizado de pruebas SDD. Revisa cada especificación generada contra la lista de entregables. Como mínimo, prueba una solicitud completa, otra sin disparador o entrada crítica, un fallo de integración y una solicitud que involucre datos personales o información financiera sensible.

> English version: [README.md](./README.md).