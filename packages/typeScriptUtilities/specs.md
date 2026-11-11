# Especificación funcional — Brasaland TypeScript Utilities

## 1. Propósito y alcance

Este documento especifica los requisitos funcionales, reglas de negocio y criterios de aceptación para las utilidades TypeScript de procesamiento de datos operativos de Brasaland. La implementación pertenece a `packages/typeScriptUtilities/utils/`.

El alcance comprende los modelos de datos, filtrado, ordenamiento, búsquedas lineal y binaria, cálculos financieros, scoring y ranking de locaciones, agregaciones de reportes y validaciones descritos aquí. No se agregan funcionalidades fuera de las requeridas en el README del paquete y sus aclaraciones.

## 2. Modelos de dominio

Las interfaces y los tipos deben definirse explícitamente en el módulo de modelos ubicado dentro de `utils/`.

### 2.1 `Price`

- `USD: number`
- `COP: number`

Los dos valores representan el importe en dólares estadounidenses y pesos colombianos, respectivamente.

### 2.2 `MenuItem`

- `id: string`
- `name: string`
- `category: MenuCategory`
- `basePrice: Price`
- `ingredientCost: Price`
- `prepTimeMinutes: number`
- `isAvailableInColombia: boolean`
- `isAvailableInUSA: boolean`
- `allergens: string[]`
- `status: MenuItemStatus`

Tipos asociados:

- `MenuCategory`: `"Meat" | "Side" | "Beverage" | "Dessert" | "Combo"`
- `MenuItemStatus`: `"Active" | "Seasonal" | "Discontinued"`

### 2.3 `SaleTransaction`

- `id: string`
- `locationId: string`
- `itemId: string`
- `quantity: number`
- `numberOfDiners: number`
- `totalPrice: Price`
- `paymentMethod: PaymentMethod`
- `timestamp: Date`
- `waiterName: string`

`PaymentMethod`: `"Cash" | "Credit card" | "Debit card" | "Digital wallet"`.

Cada venta debe referenciar un ítem del catálogo, incluyendo registros históricos. El ítem no necesita estar activo o disponible actualmente. Se permiten importes de venta cero para cortesías.
`numberOfDiners` es obligatorio, entero y mayor que cero; cuenta los comensales/asientos ocupados del ticket. El número de mesa no se utiliza en estos cálculos.

### 2.4 `Location`

- `id: string`
- `name: string`
- `city: string`
- `country: Country`
- `openingYear: number`
- `seatingCapacity: number`
- `staffCount: number`
- `monthlyRentCost: Price`
- `averageMonthlyUtilities: Price`
- `manager: string`
- `status: LocationStatus`

Tipos asociados:

- `Country`: `"Colombia" | "USA"`
- `LocationStatus`: `"Active" | "Temporarily closed" | "Under renovation"`

`seatingCapacity` es la capacidad máxima de asientos del local.

### 2.5 `WasteRecord`

- `id: string`
- `locationId: string`
- `itemId: string`
- `quantity: number`
- `reason: WasteReason`
- `cost: Price`
- `timestamp: Date`
- `reportedBy: string`

Todos los campos son obligatorios.

`WasteReason`: `"Expired" | "Cooking error" | "Customer return" | "Damage" | "Other"`.

### 2.6 Tipo de reporte

`CountryMetrics` contiene:

- `totalLocations: number`
- `totalRevenue: number`
- `averageRevenuePerLocation: number`
- `totalSales: number`
- `currency: Currency`, moneda común en la que se expresan ambos importes

`Currency` es el tipo unión `"USD" | "COP"`.

El reporte comparativo devuelve métricas para `Colombia` y `USA`.

## 3. Requisitos funcionales

Los nombres y firmas indicados son parte de la API requerida. Las funciones deben aceptar arrays vacíos sin fallar y no mutar las colecciones de entrada.

### 3.1 Colecciones — `utils/collections.ts`

1. `filterSalesByLocation(sales, locationId)` devuelve todas y solo las transacciones cuyo `locationId` coincide con el argumento.
2. `filterSalesByDateRange(sales, startDate, endDate)` devuelve transacciones dentro del rango de fechas, inclusive. La interpretación del día debe respetar el horario local de la locación según la regla de fechas de la sección 4.
3. `filterMenuItemsByCategory(items, category)` devuelve los ítems cuya categoría coincide.
4. `filterActiveLocations(locations)` devuelve únicamente locaciones con estado `"Active"`.
5. `sortLocationsByCapacity(locations, order)` devuelve una nueva colección ordenada por `seatingCapacity` en orden ascendente o descendente.
6. `sortMenuItemsByPrice(items, currency, order)` devuelve una nueva colección ordenada por el precio base de la moneda indicada, en orden ascendente o descendente.
7. `filterMenuItems(items, filters)` permite combinar categoría, estado y rango inclusivo de precio. Para evaluar límites de precio debe especificarse `currency`; si falta la moneda, los criterios de precio no coinciden.
8. `filterLocations(locations, filters)` permite combinar estado, país y rango inclusivo de capacidad.

### 3.2 Búsquedas — `utils/search.ts`

1. `findLocationById(locations, id)` realiza búsqueda lineal en una colección no necesariamente ordenada. Devuelve la locación encontrada o `null`.
2. `findMenuItemByName(items, name)` realiza búsqueda lineal con comparación de nombre case-insensitive. Devuelve el primer ítem coincidente o `null`.
3. `binarySearchLocationByCapacity(sortedLocations, targetCapacity)` realiza búsqueda binaria sobre locaciones ordenadas ascendentemente por `seatingCapacity`. Devuelve el índice encontrado o `-1`.

### 3.3 Cálculos financieros — `utils/transformations.ts`

1. `calculateDailyRevenue(sales, date, currency)` suma `totalPrice` de las ventas correspondientes al día local solicitado en la moneda indicada y redondea el resultado a dos decimales.
2. `calculateLocationMargin(sales, menuItems, locationId, currency)` filtra las ventas por locación, une cada venta con su ítem y calcula:

   `((ingreso total - costo total de ingredientes) / ingreso total) * 100`

   El costo de ingredientes por unidad se multiplica por la cantidad vendida. Se permite un margen negativo para representar pérdidas. El resultado se redondea a dos decimales. Si el ingreso total es cero, retorna `null`, pues el porcentaje no está definido.
3. `calculateWasteCost(wasteRecords, locationId, currency)` suma el costo de desperdicio de la locación indicada y redondea a dos decimales.
4. `convertCurrency(amount, fromCurrency, toCurrency)` convierte con la tasa fija `1 USD = 4000 COP`, redondea a dos decimales y devuelve el importe original si las monedas coinciden.

### 3.4 Scoring y ranking — `utils/transformations.ts`

`scoreLocationPerformance(location, sales, wasteRecords, menuItems, startDate, endDate, asOfDate)` devuelve un puntaje redondeado a dos decimales, con máximo 100 puntos antes de considerar una contribución negativa de margen. `asOfDate` es una fecha explícita de referencia para mantener el cálculo determinista. Los componentes son:

- **Ingresos (máximo 40):** ingreso total en USD de la locación dividido por días operativos desde la apertura; la fecha inicial es el 1 de enero del `openingYear`. Todas las locaciones se consideran abiertas los 365 días, sin descontar cierres. Puntos: `(promedio diario USD / 1000) * 40`, con tope de 40.
- **Eficiencia de asientos (máximo 30):** suma `numberOfDiners` de los tickets de la locación cuyas fechas locales estén dentro del rango inclusivo `startDate`–`endDate`. Capacidad disponible = `seatingCapacity × 2 turnos diarios × días calendario inclusivos`. Puntos = `min(30, comensales / capacidad disponible × 30)`. Las fechas se interpretan en `America/Bogota`; no se infiere ocupación del número de tickets ni de artículos.
- **Control de desperdicio (máximo 20):** porcentaje de desperdicio `(costo total del desperdicio / ingreso total) * 100`; puntos `max(0, 20 - porcentaje * 2)`.
- **Control de desperdicio con ingreso cero:** aporta 0 puntos.
- **Margen (máximo 10):** se usa el margen calculado para la locación. Puntos `min(10, margen / 10)`. El margen subyacente puede ser negativo; si el margen devuelve `null`, aporta 0 puntos.

`rankLocationsByPerformance(locations, sales, wasteRecords, menuItems, startDate, endDate, asOfDate)` calcula el puntaje de cada locación para el período indicado y devuelve una nueva lista ordenada de mayor a menor puntuación. Cada elemento tiene `{ location, score }`.

### 3.5 Agregaciones y reportes — `utils/transformations.ts`

1. `countSalesByPaymentMethod(sales)` devuelve un `Record<PaymentMethod, number>` con el conteo de transacciones por método de pago.
2. `calculateAverageTicket(sales, currency)` calcula el promedio de `totalPrice` por transacción en la moneda indicada y redondea a dos decimales. Para un array vacío, retorna 0.
3. `findTopSellingItems(sales, menuItems, topN)` agrupa las ventas por `itemId`, suma `quantity`, asocia cada grupo al ítem de menú y devuelve hasta `topN` elementos ordenados de mayor a menor cantidad. Cada elemento contiene `{ item, totalSold }`. Para `topN <= 0`, devuelve `[]`.
4. `groupWasteByReason(wasteRecords)` devuelve registros agrupados por cada valor de `WasteReason`.
5. `calculateCountryComparison(sales, locations, menuItems, currency)` devuelve para Colombia y USA el número de locaciones, ingresos totales, promedio de ingreso por locación y número total de ventas. Para normalizar la moneda, las ventas de locaciones en Colombia se leen desde el campo COP y las ventas de locaciones en USA desde USD; cada importe se convierte a la moneda común antes de agregarse mediante la tasa fija de `convertCurrency`.
6. `summarizeRevenue(amounts)` devuelve una agregación `{ total, average, maximum, minimum }`; para una entrada vacía, todos los valores son 0.

### 3.6 Validaciones — `utils/validations.ts`

Cada función devuelve `{ valid: boolean, errors: string[] }`. `valid` es `true` si no hay errores; en ese caso `errors` es vacío.

1. `validateMenuItem(item)` aplica las reglas de menú de la sección 4.
2. `validateSaleTransaction(sale, menuItems)` aplica las reglas de venta y confirma que `itemId` corresponde a un ítem del catálogo proporcionado, sin exigir que esté activo o disponible.
3. `validateLocation(location, currentYear)` aplica las reglas de locación de la sección 4, recibiendo el año de referencia explícitamente para mantener la función determinista.
4. `validateWasteRecord(record)` comprueba presencia de todos los campos obligatorios, tipos de datos y que `reason` sea uno de los valores de `WasteReason`. No impone límites adicionales a cantidad/costo, fecha futura ni referencias a catálogos/locales.

## 4. Reglas de negocio y límites

### 4.1 Menú

- `basePrice.USD > 0` y `basePrice.COP > 0`.
- `ingredientCost.USD > 0` y `ingredientCost.COP > 0`.
- `prepTimeMinutes > 0` y `prepTimeMinutes <= 60`.
- `name` no está vacío.
- Al menos uno de `isAvailableInColombia` o `isAvailableInUSA` es `true`.

### 4.2 Ventas

- `quantity > 0`.
- `numberOfDiners` es un entero mayor que cero.
- `totalPrice.USD >= 0` y `totalPrice.COP >= 0`; cero representa una cortesía.
- `waiterName` no está vacío.
- `itemId` debe existir en el catálogo consultado, incluidos ítems descontinuados o conservados como registros históricos.
- El ingreso debe asociarse a un producto; no se admiten ventas sin producto.

### 4.3 Locaciones

- `openingYear >= 2008` y `openingYear <=` año actual.
- `seatingCapacity > 0`.
- `staffCount > 0`.
- Los valores USD y COP de `monthlyRentCost` y `averageMonthlyUtilities` son mayores que cero.
- La fecha inicial para los días desde apertura es el 1 de enero del `openingYear`.
- Se asume operación los 365 días y no se descuentan cierres ni estados de cierre temporal para el conteo de días.

### 4.4 Fechas locales

- Los cálculos por día usan la fecha calendario local en `America/Bogota`; los rangos de fechas son inclusivos y no excluyen instantes cercanos a medianoche.
- Los cálculos de fecha local usarán la zona IANA `America/Bogota`, equivalente al nombre indicado como “América/Colombia”. Debe usarse el identificador canónico aceptado por las APIs de fecha; el huso horario del proceso no debe alterar los resultados.
- No se requiere ajuste estacional para `America/Bogota` según las reglas horarias actuales.
- Los argumentos de fecha de `filterSalesByDateRange` y del scoring representan días calendario locales completos, con extremos inclusivos.

### 4.5 Moneda y redondeo

- Las funciones financieras que reciben `currency` usan la moneda solicitada.
- La tasa de conversión es fija: 1 USD = 4000 COP.
- Los cálculos financieros especificados se redondean a dos decimales, salvo conversión entre monedas iguales, que devuelve el importe sin conversión.
- Los reportes comparativos convierten a una única moneda objetivo, USD o COP, antes de sumar o promediar. Las ventas de locaciones de Colombia usan el campo COP como moneda de origen; las de USA usan USD.

### 4.6 Márgenes y scoring

- Los márgenes negativos son válidos y representan pérdidas; no se limitan a cero.
- El componente de margen y el puntaje final deben conservar el efecto de un margen negativo, sin inventar una regla de piso distinta de las fórmulas indicadas.
- El scoring de eficiencia utiliza el campo obligatorio `numberOfDiners` y las fechas inclusivas `startDate`–`endDate`, según la fórmula de la sección 3.4.

## 5. Criterios de aceptación

La implementación se acepta cuando:

1. **Seguridad de tipos:** las entidades, uniones, firmas y resultados están correctamente tipados en TypeScript.
2. **Comportamiento funcional:** cada función devuelve los resultados descritos en la sección 3 para entradas válidas.
3. **Casos límite:** las funciones manejan colecciones vacías y búsquedas sin coincidencia de forma controlada, siguiendo los tipos de retorno documentados.
4. **Validaciones:** se aplican todas las reglas explícitas de la sección 4 y se devuelven errores legibles cuando no se cumplen.
5. **Organización:** los módulos están en `packages/typeScriptUtilities/utils/` y separados en colecciones, búsqueda, transformaciones, validaciones y modelos.
6. **Nombres:** funciones, variables y tipos mantienen nombres descriptivos y convenciones TypeScript.
7. **Sin mutaciones:** las operaciones de ordenamiento y ranking no mutan sus arrays de entrada.
8. **Empates:** si el criterio es igual, se conserva el orden relativo de entrada mediante ordenamiento estable; no hay criterio secundario.
8. **Funciones puras:** los resultados dependen de los argumentos, sin estado global oculto.
9. **Precisión de moneda:** los cálculos se realizan en USD o COP de forma consistente con la tasa fija y el redondeo indicados.
10. **Trazabilidad de catálogo:** las ventas se enlazan al ítem correspondiente para cálculos de costo, agregaciones y validación.
11. **Límites conocidos explícitos:** las reglas de desempate requieren decisión; no se deben sustituir silenciosamente por aproximaciones.

## 6. Puntos no especificados que requieren decisión

Esta especificación no asigna comportamiento nuevo donde el README no lo define. Antes de poder cerrar las pruebas de aceptación de estos casos, deben acordarse:

- **Puntaje con pérdida:** se aplica la contribución del margen negativo según la fórmula, sin piso adicional; el puntaje final puede ser negativo.

Hasta resolver los puntos anteriores, la implementación y sus pruebas deben limitarse a los comportamientos inequívocos y evitar supuestos incompatibles con las reglas del negocio.
