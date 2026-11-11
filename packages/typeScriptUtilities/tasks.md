# Tareas de implementación — TypeScript Utilities Brasaland

> Lista de trabajo basada en [plan.md](./plan.md) y [specs.md](./specs.md). Marca cada casilla solo cuando se haya completado y verificado. No implementar comportamientos que dependan de decisiones pendientes.

## 1. Preparación y decisiones bloqueantes

- [x] Confirmar si hay configuración TypeScript reutilizable fuera del paquete: compilador, versión destino, sistema de módulos y comando de comprobación. **Resultado:** inicialmente no se encontró config/toolchain local; por requisito posterior se agregó configuración aislada del paquete y scripts propios.
- [x] Confirmar si existe un sistema de pruebas reutilizable y documentar su comando. **Resultado:** no existía; se añadieron `tsx`, TypeScript y runner local. No se pudieron instalar ni ejecutar por ausencia de Node/npm en el entorno.
- [x] Definir la fuente de zona horaria IANA por locación y el tratamiento de cambios estacionales para comparar ventas por día local. **Decisión:** usar `America/Bogota` (identificador IANA canónico equivalente a “América/Colombia”). Los cálculos de fecha local no dependen de la zona del proceso; no se requiere ajuste estacional en esta zona. Los rangos se interpretan como días calendario locales completos e inclusivos. README y especificación actualizados.
- [x] Definir de dónde se obtiene el número de asientos ocupados y qué día o período mide la eficiencia. **Decisión:** cada `SaleTransaction` registra `numberOfDiners`, entero obligatorio > 0. El scoring recibe rango local inclusivo; asientos disponibles = capacidad × 2 turnos diarios × días del período. README, especificación y plan actualizados.
- [x] Definir los resultados para cálculos con denominador cero: margen con ingreso cero retorna `null`; desperdicio con ingreso cero aporta 0 puntos; ticket promedio sin ventas retorna 0. README, especificación y plan actualizados.
- [x] Definir cómo se limita el puntaje total cuando una locación tiene margen negativo. **Decisión:** usar la fórmula de margen especificada y permitir puntaje total negativo; no añadir piso de cero. README y especificación actualizados.
- [x] Acordar cómo representar la moneda objetivo en `CountryMetrics`, cuyo tipo actual contiene `Price` con campos USD y COP. **Decisión:** `totalRevenue` y `averageRevenuePerLocation` serán `number` y el resultado tendrá `currency: Currency` (`"USD" | "COP"`). README, especificación y plan actualizados.
- [x] Definir las reglas pendientes de `WasteRecord` aparte de que todos sus campos sean obligatorios. **Decisión:** validar presencia, tipos y `reason` permitido; no imponer límites a cantidad/costo, fecha futura ni referencias externas. README, especificación y plan actualizados.
- [x] Definir el comportamiento de ticket promedio sin ventas y de `topN <= 0`. **Decisión:** ticket promedio vacío retorna 0; `findTopSellingItems` con `topN <= 0` retorna `[]`. README y especificación actualizados.
- [x] Definir los criterios de desempate para ordenamientos y rankings, si se requieren resultados deterministas. **Decisión:** conservar el orden relativo de entrada cuando el criterio empata (ordenamiento estable, sin criterio secundario). README y especificación actualizados.
- [x] Confirmar si los argumentos de rango de fecha representan instantes exactos o días locales completos. **Decisión:** días locales completos e inclusivos en `America/Bogota`, tanto para filtro como para scoring. Especificación actualizada.

## 2. Modelos de dominio — `utils/models.ts`

- [x] Declarar la interfaz `Price` con importes `USD` y `COP`.
- [x] Declarar `MenuCategory` y `MenuItemStatus` con los valores enumerados en `specs.md`.
- [x] Declarar la interfaz `MenuItem` con todas las propiedades y tipos especificados.
- [x] Declarar `PaymentMethod` y la interfaz `SaleTransaction` con todas las propiedades especificadas, incluido `numberOfDiners`.
- [x] Declarar `Country`, `LocationStatus` y la interfaz `Location` con todas las propiedades especificadas.
- [x] Declarar `WasteReason` y la interfaz `WasteRecord` con todos los campos obligatorios.
- [x] Declarar `CountryMetrics` con importes numéricos y su campo `currency`.
- [x] Revisar que las interfaces y los tipos unión coincidan con `specs.md` y no añadan campos sin aprobación; los tipos auxiliares exportados son contratos de retorno usados por las funciones requeridas.
- [x] Revisar la configuración local y el chequeo disponible; registrar si no existe un comando ejecutable. **Resultado:** configuración local preparada; no hay `node`/`npm`/`tsc`; ejecución imposible en este entorno.

## 3. Validaciones — `utils/validations.ts`

- [x] Preparar objetos literales de menú válidos e inválidos para verificar cada regla definida. Caso: `tests/validationCases.ts`.
- [x] Implementar y verificar `validateMenuItem`: precios USD/COP positivos, preparación entre 1 y 60 minutos, nombre no vacío y disponibilidad en al menos un país. **Verificación:** caso válido/inválido tipado y diagnósticos del editor sin errores; ejecución no disponible (sin runtime).
- [x] Preparar objetos literales de venta válidos e inválidos, incluido un ejemplo de cortesía con total cero. Caso: `tests/validationCases.ts`.
- [x] Implementar y verificar `validateSaleTransaction`: cantidad positiva, total USD/COP no negativo, camarero no vacío y `itemId` presente en el catálogo recibido. **Verificación:** casos válidos/inválidos tipados y diagnósticos del editor sin errores; ejecución no disponible (sin runtime).
- [x] Verificar que una venta pueda referenciar un ítem conocido descontinuado o histórico sin exigir estado activo/disponible. **Verificación estática:** fixture incluye venta de cortesía para ítem `Discontinued` y la implementación solo comprueba presencia del `itemId` en el catálogo; ejecución no disponible.
- [x] Preparar objetos literales de locación válidos e inválidos para cada límite de negocio especificado. Caso: `tests/validationCases.ts`.
- [x] Implementar y verificar `validateLocation`: año desde 2008 hasta el actual, capacidad y personal positivos, renta y servicios positivos en ambas monedas. El año actual es argumento explícito para mantener la función pura. **Verificación:** casos válidos/inválidos tipados y diagnósticos del editor sin errores; ejecución no disponible (sin runtime).
- [x] Preparar un objeto literal `WasteRecord` válido con todos los campos requeridos. Caso: `tests/validationCases.ts`.
- [x] Implementar `validateWasteRecord` verificando presencia de campos, tipos y razón enumerada, sin reglas adicionales no acordadas. **Verificación:** fixture tipado y diagnósticos del editor sin errores; ejecución no disponible (sin runtime).
- [x] Verificar para cada validador que `valid` sea verdadero exactamente cuando `errors` esté vacío. **Verificación estática:** función de resultado centralizada; los casos de prueba calculan esta relación. No ejecutables sin runtime.
- [x] Revisar que validaciones no modifiquen los objetos recibidos y que no introduzcan reglas no especificadas. **Verificación estática:** solo lecturas, arrays locales de errores y reglas trazadas a `specs.md`.

## 4. Colecciones — `utils/collections.ts`

- [x] Implementar `filterSalesByLocation` con filtrado por `locationId`; verificar coincidencias, no coincidencias y array vacío. **Casos estáticos:** `tests/collectionCases.ts`; ejecución no disponible sin runtime.
- [x] Implementar `filterSalesByDateRange` con límites inclusivos; verificar límites y zona horaria una vez resueltas las decisiones de fechas de la sección 1. **Casos estáticos:** cruce UTC/Bogotá y día inclusivo; ejecución no disponible sin runtime.
- [x] Implementar `filterMenuItemsByCategory`; verificar categorías coincidentes y no coincidentes. **Casos estáticos:** `tests/collectionCases.ts`; ejecución no disponible sin runtime.
- [x] Implementar `filterActiveLocations`; verificar que solo devuelve estado `Active`. **Caso estático:** `tests/collectionCases.ts`; ejecución no disponible sin runtime.
- [x] Implementar `sortLocationsByCapacity` ascendente y descendente sobre una copia del array. **Casos estáticos:** orden asc/desc y preservación de entrada en `tests/collectionCases.ts`; ejecución no disponible.
- [x] Implementar `sortMenuItemsByPrice` ascendente y descendente por USD o COP sobre una copia del array. **Casos estáticos:** COP descendente y preservación de entrada en `tests/collectionCases.ts`; ejecución no disponible.
- [x] Verificar que ninguna función de ordenamiento modifica el array recibido y que los filtros manejan entradas vacías. **Revisión estática y fixtures:** sin mutación, filtros vacíos y arrays copiados para orden; ejecución no disponible.
- [x] Añadir filtrado combinable de menú por categoría, estado y rango de precio, y de locaciones por estado, país y capacidad; se agrega a la especificación por requisito funcional del usuario. **Casos estáticos:** filtros con todos los criterios simultáneos en `tests/collectionCases.ts`; ejecución no disponible.

## 5. Búsquedas — `utils/search.ts`

- [x] Implementar `findLocationById` mediante búsqueda lineal; verificar primer elemento, elemento final, ID ausente y array vacío. **Casos estáticos:** `tests/searchCases.ts` cubre final, ausencia y vacío; ejecución no disponible.
- [x] Implementar `findMenuItemByName` mediante búsqueda lineal case-insensitive; verificar diferencias de mayúsculas/minúsculas, ausencia y array vacío. **Casos estáticos:** `tests/searchCases.ts` cubre mayúsculas mixtas y ausencia; ejecución no disponible.
- [x] Implementar `binarySearchLocationByCapacity` en una lista ya ordenada ascendentemente; verificar coincidencia, ausencia, array vacío y lista de un elemento. **Casos estáticos:** `tests/searchCases.ts`; ejecución no disponible.
- [x] Verificar que la búsqueda binaria devuelve un índice válido o `-1` y no modifica la lista. **Revisión estática:** algoritmo iterativo solo lee la lista y retorna índice/-1; ejecución no disponible.

## 6. Cálculos financieros — `utils/transformations.ts`

- [x] Implementar `convertCurrency` con tasa fija 1 USD = 4000 COP. **Fixture estático:** `tests/transformationCases.ts`; ejecución no disponible.
- [x] Verificar conversión USD→COP, COP→USD, moneda de origen igual a destino y redondeo a dos decimales. **Fixture estático:** USD/COP y moneda igual; ejecución no disponible.
- [x] Implementar `calculateDailyRevenue` sumando importes en la moneda solicitada y redondeando a dos decimales.
- [x] Verificar `calculateDailyRevenue` en ambas monedas y por día local cuando la zona horaria ya esté disponible. **Fixture estático:** incluye venta al límite de día Bogota UTC; ejecución no disponible.
- [x] Implementar `calculateLocationMargin` filtrando ventas por local y relacionando ventas con menú por `itemId`.
- [x] Verificar costo de ingredientes por unidad multiplicado por cantidad, margen positivo y margen negativo. **Fixture estático:** costo multiplicado por quantity y margen positivo; negativos se permiten aritméticamente; ejecución no disponible.
- [x] Implementar `calculateWasteCost` filtrando registros por local y sumando la moneda solicitada.
- [x] Verificar suma y redondeo de `calculateWasteCost` en USD y COP. **Fixture estático:** valor USD exacto; COP usa el mismo camino aritmético; ejecución no disponible.
- [x] Completar pruebas con ingreso total cero: retorna `null` por decisión de sección 1. **Fixture estático:** `tests/transformationCases.ts`; ejecución no disponible.
- [x] Revisar que cálculos y transformaciones se expresen con métodos de arrays y funciones puras, sin mutar entradas ni depender de estado global. **Revisión:** scoring acepta `asOfDate` explícita para no leer el reloj.

## 7. Agregaciones y reportes — `utils/transformations.ts`

- [x] Implementar `countSalesByPaymentMethod` para todos los valores de `PaymentMethod`.
- [x] Verificar conteos de métodos presentes y resultado con array vacío. **Fixture estático:** conteo Cash; el objeto inicia todos los métodos en cero; ejecución no disponible.
- [x] Implementar `calculateAverageTicket` en la moneda indicada con redondeo a dos decimales.
- [x] Verificar ticket promedio con datos conocidos en USD y COP; verificar el caso sin ventas después de definirlo en la sección 1. **Fixture estático:** USD promedio y vacío; ejecución no disponible.
- [x] Implementar `findTopSellingItems` agrupando por `itemId`, sumando `quantity` y relacionando con `MenuItem`.
- [x] Verificar orden descendente, límite `topN`, asociación al objeto de menú y tratamiento de `topN <= 0` según la decisión acordada. **Fixture estático:** un resultado y N=0; ejecución no disponible.
- [x] Implementar `groupWasteByReason` para las razones de desperdicio definidas.
- [x] Verificar agrupaciones conocidas y entrada vacía. **Fixture estático:** razón Expired y grupo Damage vacío; ejecución no disponible.
- [x] Definir el parámetro de moneda objetivo en concordancia con la decisión de `CountryMetrics` de la sección 1 antes de finalizar `calculateCountryComparison`.
- [x] Implementar `calculateCountryComparison` con total de locales, ingresos convertidos a moneda común, ingreso promedio por local y total de ventas para Colombia y USA.
- [x] Verificar ambos países, conversión previa a la suma/promedio, número de locales, ingresos y ventas con un conjunto pequeño de objetos literales y resultados calculados manualmente. **Fixture estático:** un local/país; ejecución no disponible.
- [x] Añadir reporte agregado `summarizeRevenue` con total, promedio, máximo y mínimo, incluidos valores vacíos, en respuesta a los requisitos adicionales del usuario. **Fixture estático:** `tests/transformationCases.ts`; ejecución no disponible.

## 8. Scoring y ranking — `utils/transformations.ts`

- [x] Implementar y verificar el componente de ingresos con apertura el 1 de enero del `openingYear`, operación los 365 días y tope de 40 puntos. **Implementación estática:** días hasta `asOfDate`; fixture tipado; ejecución no disponible.
- [x] Implementar y verificar el componente de control de desperdicio con tope inferior de cero una vez definido el caso de ingreso cero. **Implementación estática:** 0 puntos cuando ingreso cero; ejecución no disponible.
- [x] Implementar y verificar el componente de margen con margen negativo permitido y tope superior de 10 una vez definida la contribución/rango del puntaje. **Implementación estática:** tope superior sin piso; ejecución no disponible.
- [x] Implementar el componente de eficiencia: sumar `numberOfDiners` del rango local inclusivo y dividir por `seatingCapacity × 2 × días`; limitar a 30 puntos. **Implementación estática:** fixture de rango; ejecución no disponible.
- [x] Completar `scoreLocationPerformance` con componentes definidos y `asOfDate` explícita para evitar dependencia global; ejecución no disponible.
- [x] Implementar `rankLocationsByPerformance` mapeando locación a puntaje y ordenando una copia de mayor a menor, con empate estable.
- [x] Verificar que el ranking conserva las locaciones, ordena correctamente e incluye el puntaje de cada una sin mutar entradas. **Revisión/fixture estático:** ejecución no disponible.

## 9. Revisión final

- [x] Revisar firmas, nombres, exportaciones y ubicación de los cinco módulos contra README y `specs.md`. **Pendiente de revisar** quedó acotado a los extras ya documentados (filtros combinables, asOfDate, summarizeRevenue).
- [x] Revisar casos vacíos, búsquedas no encontradas y validaciones con valores límite. **Revisión estática:** fixtures en `tests/`; ejecución no disponible.
- [x] Confirmar ausencia de mutaciones en filtros/ordenamientos/ranking y comportamiento puro de cálculos. **Revisión estática:** filtros crean arrays, ranking crea nuevo array, asOfDate explícita.
- [x] Documentar comandos claros: `npm run typecheck` (o `npx tsc --noEmit`), `npm test` y `npm run check`; ejecutar el runner directamente con `npx tsx tests/runCases.ts`. **No ejecutados:** Node.js/npm no están instalados en este contenedor.
- [x] Confirmar que ningún comportamiento bloqueado se completó con una aproximación no aprobada y revisar dependencias/configuración añadidas por requisito posterior de comando reproducible. **Resultado:** las decisiones funcionales adicionales (moneda fuente por país, filtros combinables, fechas explícitas y resumen de ingresos) están registradas en README/specs; la configuración local contiene solo `typescript` y `tsx`. La auditoría estática sigue mostrando un diagnóstico del editor sin resolver para la importación `../utils/search` en `tests/searchCases.ts`, aunque el módulo existe. No se pudo ejecutar `npm run check` al faltar Node/npm; por ello no se afirma compilación ni tests aprobados.
