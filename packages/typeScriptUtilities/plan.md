# Plan de implementación — TypeScript Utilities Brasaland

## Objetivo

Implementar las funciones definidas en [README.md](./README.md) y [specs.md](./specs.md), manteniendo la solución en `packages/typeScriptUtilities/utils/`. Se usarán interfaces, objetos literales, arrays y funciones puras; las transformaciones se expresarán con métodos de arrays (`filter`, `map`, `reduce`, `sort`, `slice`, entre otros) en vez de bucles explícitos, cuando el algoritmo lo permita.

Los cambios adicionales solicitados durante la implementación (filtros combinables, reporte máximo/mínimo y fechas de referencia explícitas para mantener pureza) se incorporan a README y `specs.md` antes de implementarse.

## Estructura objetivo

| Archivo | Responsabilidad |
|---|---|
| `utils/models.ts` | Interfaces, tipos unión y tipos de reporte del dominio. |
| `utils/validations.ts` | Validar menú, ventas, locaciones y registros de desperdicio. |
| `utils/collections.ts` | Filtrar y ordenar colecciones sin mutar los arrays de entrada. |
| `utils/search.ts` | Búsquedas lineales y binaria. |
| `utils/transformations.ts` | Cálculos financieros, scoring/ranking y reportes agregados. |

## Orden de implementación y verificación

### Etapa 0 — Confirmar configuración y decisiones bloqueantes

**Archivos afectados:** ninguno; revisión de configuración existente y documentación.

**Trabajo:**

- Confirmar compilador, versión objetivo de TypeScript, módulos y comandos de prueba ya configurados antes de ejecutar verificaciones.
- Registrar la zona IANA `America/Bogota` para los cálculos de fecha local. La ocupación se deriva del entero obligatorio `numberOfDiners` de cada venta. Para scoring se reciben fechas inclusivas y se calcula capacidad como `seatingCapacity × 2 turnos diarios × días calendario`. El puntaje puede ser negativo por margen. `CountryMetrics` contiene importes `number` etiquetados con `currency: Currency`. Aún debe aclararse si la validación de desperdicio comprobará solo campos/tipos o también valores.
- Se confirmó que no había configuración reutilizable. Tras la solicitud explícita de un comando claro de validación, se añadieron configuración mínima local, scripts de typecheck/test y runner; el entorno no tiene Node/npm y no permitió ejecutarlos.

**Verificación:** registrar qué configuración fue encontrada y qué decisiones siguen pendientes. No declarar compilación o pruebas automatizadas exitosas si no existe una herramienta/configuración que las ejecute.

### Etapa 1 — Modelos de dominio

**Archivo:** `utils/models.ts`.

**Trabajo:**

- Definir `Price`, `MenuItem`, `SaleTransaction`, `Location`, `WasteRecord`, `CountryMetrics` y sus tipos unión según `specs.md`.
- Mantener propiedades explícitamente tipadas; usar objetos literales como datos de prueba locales cuando se necesiten fixtures.
- No agregar campos de zona horaria: se aplica `America/Bogota`. `numberOfDiners` queda aprobado como campo obligatorio de venta.

**Verificación:** revisar que los nombres, propiedades, tipos de moneda, categorías, estados y firmas exportadas coincidan con la especificación. Ejecutar el chequeo TypeScript disponible una vez confirmada la configuración.

### Etapa 2 — Validaciones de negocio

**Archivo:** `utils/validations.ts`.

**Trabajo:**

- Implementar `validateMenuItem`, `validateSaleTransaction`, `validateLocation` y `validateWasteRecord`.
- Aplicar primero las reglas explícitas de `specs.md`: precios de menú positivos; venta con cantidad positiva, total no negativo y producto existente; límites de preparación; año, capacidad, personal y costos de locación.
- Mantener una validación como función pura que devuelve `{ valid, errors }`; para comprobar el catálogo, recibir `menuItems` como define la especificación.
- Para `WasteRecord`, verificar campos, tipos y `reason` permitido; no imponer límites numéricos, fecha futura o referencias externas.

**Verificación:** con objetos literales válidos e inválidos, comprobar cada regla explícita, la cortesía con total cero, la referencia a un producto histórico/descontinuado y que `valid` concuerde con si `errors` está vacío.

### Etapa 3 — Colecciones y búsquedas

**Archivos:** `utils/collections.ts`, `utils/search.ts`.

**Trabajo:**

- Implementar filtros con `.filter()`.
- Ordenar por capacidad o precio con copia del array antes de `.sort()` para preservar la entrada.
- Implementar búsqueda lineal para ID de locación y nombre de menú; comparación del nombre ignorando mayúsculas/minúsculas.
- Implementar búsqueda binaria por capacidad ascendente, devolviendo el índice o `-1`.
- Usar arrays vacíos y resultados sin coincidencia como casos normales, no como excepciones.

**Verificación:** comprobar filtros con coincidencias y sin coincidencias, sensibilidad de fecha/localización conforme a las decisiones aprobadas, búsqueda de elementos presentes/ausentes, array vacío y capacidad en límites. Comparar el array original antes/después de los ordenamientos. Para búsqueda binaria, incluir capacidades que sí/no existen y una lista de una sola locación.

### Etapa 4 — Transformaciones financieras fundamentales

**Archivo:** `utils/transformations.ts`.

**Trabajo:**

- Implementar conversión USD/COP con la tasa fija 1 USD = 4000 COP y redondeo especificado.
- Implementar suma de ingresos diarios, costo de desperdicio y margen de locación mediante `.filter()`, `.map()` cuando se requiera transformar valores, y `.reduce()` para acumulaciones.
- Calcular costo de ingredientes como costo por unidad multiplicado por `quantity`.
- Preservar márgenes negativos.
- Para ingreso diario, aplicar el intervalo local de negocio en `America/Bogota`; no sustituirlo por la zona del proceso que ejecuta el código.

**Verificación:** validar importes conocidos en USD y COP, conversión en ambos sentidos, misma moneda, redondeo, separación por locación/fecha, costo por cantidad, margen positivo y negativo, `null` para margen con ingreso cero y 0 para ticket vacío.

### Etapa 5 — Agregaciones y reportes

**Archivo:** `utils/transformations.ts`.

**Trabajo:**

- Implementar conteo por método de pago, ticket promedio, productos más vendidos, agrupación de desperdicio y comparación por país.
- Preferir `.reduce()` para conteos y agrupaciones, `.map()` para construir resultados y `.sort()`/`.slice()` para ordenar y limitar productos.
- Convertir los ingresos de cada venta a la moneda común antes de agregarlos en el reporte por país.
- Enlazar cada venta con el catálogo por `itemId`; no asumir que una venta sin producto puede incorporarse a los agregados de producto.

**Verificación:** usar los ejemplos del README más objetos literales de desperdicio; comparar conteos, cantidades, totales, promedios y grupos con resultados calculados a mano. Comprobar que el reporte contiene ambos países y que el total agregado y el promedio por locación usan la moneda de destino acordada. Revisar arrays vacíos y `topN` cuando su comportamiento haya sido definido.

### Etapa 6 — Scoring y ranking

**Archivo:** `utils/transformations.ts`.

**Trabajo:**

- Implementar componentes de ingreso, desperdicio y margen exactamente según las fórmulas de `specs.md`, con los topes expresamente definidos.
- Implementar `rankLocationsByPerformance` como transformación que asocia locación y puntaje y ordena una copia por puntaje descendente.
- Implementar scoring con `numberOfDiners`, rango inclusivo recibido y capacidad `seatingCapacity × 2 turnos × días`; no sustituir comensales por transacciones o productos.
- Permitir puntaje total negativo cuando así resulte de la fórmula explícita del margen, sin aplicar un piso no especificado.

**Verificación:** comprobar cada componente por separado contra cálculos de referencia, topes de ingreso y desperdicio, margen negativo, redondeo y orden descendente. El scoring recibe `asOfDate` para ser determinista; su ejecución requiere `npm run check` en un entorno con dependencias instaladas.

### Etapa 7 — Revisión final de contrato

**Archivos:** los cinco módulos de `utils/`.

**Trabajo:**

- Revisar exportaciones, nombres, firmas y responsabilidad de cada módulo contra README/specs.
- Confirmar que los métodos de arrays no alteran entradas; los cálculos no dependen de estado global.
- Identificar expresamente cualquier función que siga bloqueada por decisiones de negocio.

**Verificación:** ejecutar exclusivamente comandos del TypeScript y del sistema de pruebas ya presentes en el repositorio, si existen; revisar los resultados funcionales de las etapas y confirmar que no se introdujeron archivos de configuración o dependencias adicionales.

## Criterio de uso de arrays y bucles

- Los filtros, ordenamientos, agrupaciones, cálculos, rankings y proyecciones se expresarán mediante métodos de arrays y funciones puras; para ordenar se creará una copia antes de `.sort()`.
- La búsqueda binaria es un algoritmo iterativo por definición. Su implementación puede usar una iteración explícita breve sobre índices; se mantiene separada de las transformaciones funcionales para cumplir el requisito didáctico de comparar búsqueda lineal y binaria.
- Los datos de ejemplo se representarán con interfaces y objetos literales. No hace falta una matriz bidimensional: los datos especificados son colecciones de objetos y agregar una matriz no aporta una operación requerida.

## Configuración existente y límite de verificación

En la revisión inicial del repositorio no existían `tsconfig`, configuración de pruebas ni `package.json` para el paquete. Se agregó una configuración local aislada con TypeScript y `tsx`; el comando documentado es `npm run check` luego de `npm install` en `packages/typeScriptUtilities`. No se pudo instalar ni ejecutar en este entorno porque Node.js y npm no están disponibles.
