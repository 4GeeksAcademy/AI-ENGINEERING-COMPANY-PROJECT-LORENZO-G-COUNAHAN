# `agents/skills` — Skills reutilizables para agentes de Brasaland

Skills específicos del dominio de Brasaland, empaquetados como capacidades reutilizables que los agentes pueden invocar.

## Catálogo de Skills

| Skill                    | Propósito                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `forecast-skill`         | Predecir ventas usando histórico + variables externas (clima, deportes, calendario) |
| `inventory-skill`        | Consultar stock, escandallos y calcular necesidades de producto                     |
| `order-validation-skill` | Validar o generar pedidos a proveedor según forecast + reglas de negocio            |
| `weather-calendar-skill` | Obtener datos climáticos, eventos deportivos y efecto calendario                    |

## Estructura de un Skill

Cada skill sigue una estructura simple:

```
skill-name/
├── SKILL.md         ← Instrucciones detalladas del skill
└── examples/        ← Ejemplos de uso (opcional)
```

> Los skills se diferencian de `agents/tools/` en que son **capacidades completas** (instrucciones + lógica), no llamadas atómicas a APIs o funciones. Para más contexto sobre skills, consulta [`skills/`](../../skills/README.md) en la raíz del repo.
