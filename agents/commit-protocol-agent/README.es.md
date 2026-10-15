# Agente de Protocolo de Commits

Agente basado en instrucciones que aplica el **protocolo obligatorio previo a cada commit** en Brasaland. Antes de cada commit verifica que el cambio preserva la integridad funcional del proyecto. Actúa como barrera de calidad: un cambio que no supere el protocolo no debe commitearse hasta corregirse.

## Alcance

- Revisar todos los cambios acumulados (staged y unstaged) antes de cada commit.
- Verificar que no se rompe la funcionalidad existente del área modificada.
- Hacer cumplir las reglas del proyecto y las decisiones registradas en `memory-bank/`.
- Proponer un mensaje de commit conforme a Conventional Commits cuando el cambio esté aprobado.

## Protocolo obligatorio (resumen)

Todo commit debe superar, en orden:

1. **Inspeccionar** — revisar `git status`/`git diff` y clasificar el cambio por área y criticidad.
2. **Integridad y secretos** — rechazar secretos reales, PII, datos financieros sensibles, artefactos de build y archivos accidentales.
3. **Calidad de código** — lint/tipado de cambios Python y TypeScript; validar enlaces Markdown.
4. **Pruebas** — ejecutar la suite del área afectada; exigir evidencia de ejecución.
5. **Reglas del proyecto** — multi-moneda (COP/USD), sin PII en agentes, sin microservicios no justificados y especificación SDD para cambios en `workflows/`.
6. **Mensaje de commit** — Conventional Commits con un único propósito cohesivo.
7. **Veredicto** — **APROBADO** ✔️ o **RECHAZADO** ❌ con la lista de bloqueos y correcciones.

El protocolo completo está en [`prompts/system.md`](./prompts/system.md).

## Fuentes de conocimiento

- [`CONTEXT.md`](../../CONTEXT.md): negocio, departamentos y restricciones operativas de Brasaland.
- [`memory-bank/projectbrief.md`](../../memory-bank/projectbrief.md): alcance y prioridades del proyecto.
- [`memory-bank/techContext.md`](../../memory-bank/techContext.md): stack, arquitectura y restricciones técnicas.
- [`agents/sdd-workflow-agent/README.es.md`](../sdd-workflow-agent/README.es.md): convenciones SDD referidas por los cambios en workflows.

## Cumplimiento mecánico

Un script `pre-commit` independiente automatiza los pasos que no requieren IA: escaneo de secretos, bloqueo de archivos sensibles/de artefactos y comprobación de que los cambios en workflows llevan su especificación `workflows/<nombre>/README.md`.

```bash
cp agents/commit-protocol-agent/scripts/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

O apunta Git directamente al directorio de scripts:

```bash
git config core.hooksPath agents/commit-protocol-agent/scripts
```

Las comprobaciones semánticas (calidad de código, tests, reglas del proyecto, veredicto) siguen siendo responsabilidad del agente durante la revisión del commit.

## Seguridad y restricciones del proyecto

- Nunca apruebes un commit que contenga secretos, datos personales (PII), información financiera sensible, tests rotos o errores de tipos.
- No afirmes que una prueba, lint o comando se ejecutó sin una herramienta disponible y evidencia observable.
- Respeta las reglas de multi-moneda (COP/USD), multi-país, sin PII en agentes y sin microservicios no justificados.
- Editar archivos del cambio del usuario requiere permiso explícito.

## Prompt

Consulta [`prompts/system.md`](./prompts/system.md) para las instrucciones operativas del agente.

## Validación

Por ahora es un agente de prompt y documentación más un hook de Git opcional; el repositorio no tiene runtime de agentes. Valida el protocolo contra: un commit con un secreto filtrado, un commit con tests rotos, un cambio de workflow sin su especificación y un commit limpio conforme.

> English version: [README.md](./README.md).