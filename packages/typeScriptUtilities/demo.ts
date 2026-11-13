import type { Currency, Location, MenuItem, SaleTransaction, WasteRecord } from "./utils/models";
import {
  calculateAverageTicket,
  calculateCountryComparison,
  calculateDailyRevenue,
  calculateLocationMargin,
  calculateWasteCost,
  countSalesByPaymentMethod,
  convertCurrency,
  findTopSellingItems,
  rankLocationsByPerformance,
  scoreLocationPerformance,
  summarizeRevenue,
} from "./utils/transformations";
import {
  filterActiveLocations,
  filterMenuItemsByCategory,
  filterSalesByLocation,
  filterSalesByDateRange,
  sortLocationsByCapacity,
} from "./utils/collections";
import { findLocationById, findMenuItemByName, binarySearchLocationByCapacity } from "./utils/search";
import { validateLocation, validateMenuItem, validateSaleTransaction, validateWasteRecord } from "./utils/validations";

const menuItems: MenuItem[] = [
  {
    id: "ITEM-PICANHA",
    name: "Picanha 250g",
    category: "Meat",
    basePrice: { USD: 25, COP: 100_000 },
    ingredientCost: { USD: 10, COP: 40_000 },
    prepTimeMinutes: 25,
    isAvailableInColombia: true,
    isAvailableInUSA: true,
    allergens: [],
    status: "Active",
  },
  {
    id: "ITEM-LEMONADE",
    name: "Limonada",
    category: "Beverage",
    basePrice: { USD: 5, COP: 20_000 },
    ingredientCost: { USD: 1, COP: 4_000 },
    prepTimeMinutes: 5,
    isAvailableInColombia: true,
    isAvailableInUSA: true,
    allergens: [],
    status: "Active",
  },
];

const locations: Location[] = [
  {
    id: "LOC-BOG",
    name: "Brasaland Bogotá",
    city: "Bogotá",
    country: "Colombia",
    openingYear: 2018,
    seatingCapacity: 80,
    staffCount: 20,
    monthlyRentCost: { USD: 2_000, COP: 8_000_000 },
    averageMonthlyUtilities: { USD: 200, COP: 800_000 },
    manager: "Ana Pérez",
    status: "Active",
  },
  {
    id: "LOC-MIA",
    name: "Brasaland Miami",
    city: "Miami",
    country: "USA",
    openingYear: 2020,
    seatingCapacity: 60,
    staffCount: 16,
    monthlyRentCost: { USD: 2_500, COP: 10_000_000 },
    averageMonthlyUtilities: { USD: 250, COP: 1_000_000 },
    manager: "Sam Lee",
    status: "Active",
  },
];

const sales: SaleTransaction[] = [
  {
    id: "TXN-BOG-001",
    locationId: "LOC-BOG",
    itemId: "ITEM-PICANHA",
    quantity: 2,
    numberOfDiners: 2,
    totalPrice: { USD: 50, COP: 200_000 },
    paymentMethod: "Credit card",
    timestamp: new Date("2025-01-15T12:00:00-05:00"),
    waiterName: "Luis",
  },
  {
    id: "TXN-BOG-002",
    locationId: "LOC-BOG",
    itemId: "ITEM-LEMONADE",
    quantity: 2,
    numberOfDiners: 2,
    totalPrice: { USD: 10, COP: 40_000 },
    paymentMethod: "Cash",
    timestamp: new Date("2025-01-15T13:00:00-05:00"),
    waiterName: "Marta",
  },
  {
    id: "TXN-MIA-001",
    locationId: "LOC-MIA",
    itemId: "ITEM-PICANHA",
    quantity: 1,
    numberOfDiners: 2,
    totalPrice: { USD: 25, COP: 100_000 },
    paymentMethod: "Digital wallet",
    timestamp: new Date("2025-01-15T14:00:00-05:00"),
    waiterName: "Chris",
  },
];

const wasteRecords: WasteRecord[] = [
  {
    id: "WASTE-BOG-001",
    locationId: "LOC-BOG",
    itemId: "ITEM-PICANHA",
    quantity: 1,
    reason: "Cooking error",
    cost: { USD: 2.5, COP: 10_000 },
    timestamp: new Date("2025-01-15T15:00:00-05:00"),
    reportedBy: "Marta",
  },
];

const bogota = findLocationById(locations, "LOC-BOG");
const businessDay = new Date("2025-01-15T12:00:00-05:00");
const periodSales = filterSalesByDateRange(sales, businessDay, businessDay);
const rankedLocations = rankLocationsByPerformance(
  locations,
  sales,
  wasteRecords,
  menuItems,
  businessDay,
  businessDay,
  new Date("2025-01-16T12:00:00-05:00"),
);
const sortedLocations = sortLocationsByCapacity(locations, "asc");
const locationReports = locations.map((location) => {
  const currency: Currency = location.country === "Colombia" ? "COP" : "USD";
  const locationSales = filterSalesByLocation(sales, location.id);

  return {
    location,
    currency,
    revenue: calculateDailyRevenue(locationSales, businessDay, currency),
    averageTicket: calculateAverageTicket(locationSales, currency),
    margin: calculateLocationMargin(sales, menuItems, location.id, currency),
    wasteCost: calculateWasteCost(wasteRecords, location.id, currency),
    revenueUSD: calculateDailyRevenue(locationSales, businessDay, "USD"),
  };
});
const globalCountryComparison = calculateCountryComparison(sales, locations, menuItems, "USD");
const globalRevenueUSD = Object.values(globalCountryComparison)
  .reduce((total, metrics) => total + metrics.totalRevenue, 0);
const globalSalesCount = Object.values(globalCountryComparison)
  .reduce((total, metrics) => total + metrics.totalSales, 0);
const globalMarginUSD = globalRevenueUSD === 0
  ? null
  : locationReports.reduce(
    (total, report) => total + report.revenueUSD * (report.margin ?? 0) / 100,
    0,
  ) / globalRevenueUSD * 100;
const globalWasteUSD = locationReports.reduce(
  (total, report) => total + convertCurrency(report.wasteCost, report.currency, "USD"),
  0,
);

console.log("=== Demo de utilidades TypeScript de Brasaland ===");

console.log("\n1. Validaciones");
console.log("Ítem válido:", validateMenuItem(menuItems[0]).valid);
console.log("Locación válida:", bogota === null ? false : validateLocation(bogota, 2025).valid);
console.log("Venta válida:", validateSaleTransaction(sales[0], menuItems).valid);
console.log("Registro de desperdicio válido:", validateWasteRecord(wasteRecords[0]).valid);

console.log("\n2. Filtros y búsquedas");
console.log("Locaciones activas:", filterActiveLocations(locations).map(({ name }) => name));
console.log(
  "Ítems de carne:",
  filterMenuItemsByCategory(menuItems, "Meat").map(({ name }) => name),
);
console.log("Ventas del día:", periodSales.length);
console.log("Ítem encontrado:", findMenuItemByName(menuItems, " picanha 250g ")?.name ?? "No encontrado");
console.log(
  "Búsqueda binaria de capacidad 80:",
  binarySearchLocationByCapacity(sortedLocations, 80),
  "(índice en la lista ordenada)",
);

console.log("\n3. Métricas y reportes");
console.log(
  "Ingresos de Bogotá ese día:",
  `${calculateDailyRevenue(filterSalesByLocation(sales, "LOC-BOG"), businessDay, "COP")} COP`,
);
console.log("Margen de Bogotá:", `${calculateLocationMargin(sales, menuItems, "LOC-BOG", "COP")}%`);
console.log("Desperdicio de Bogotá:", `${calculateWasteCost(wasteRecords, "LOC-BOG", "COP")} COP`);
console.log("Ticket promedio:", `${calculateAverageTicket(sales, "USD")} USD`);
console.log("Ventas por método de pago:", countSalesByPaymentMethod(sales));
console.log(
  "Ítems más vendidos:",
  findTopSellingItems(sales, menuItems, 2).map(({ item, totalSold }) => `${item.name}: ${totalSold}`),
);
console.log("Comparación por país (USD):", calculateCountryComparison(sales, locations, menuItems, "USD"));
console.log("Resumen de ingresos (USD):", summarizeRevenue(sales.map(({ totalPrice }) => totalPrice.USD)));

console.log("\n4. Scoring y ranking");
console.log(
  "Puntaje de Bogotá:",
  `${scoreLocationPerformance(
    locations[0],
    sales,
    wasteRecords,
    menuItems,
    businessDay,
    businessDay,
    new Date("2025-01-16T12:00:00-05:00"),
  )} puntos`,
);
console.log("Ranking:", rankedLocations.map(({ location, score }) => `${location.name}: ${score}`));

console.log("\n5. Resultados por locación (datos de ejemplo, no cifras operativas reales)");
locationReports.forEach((report) => {
  const margin = report.margin === null ? "N/D" : `${report.margin.toFixed(2)}%`;
  console.log(
    `${report.location.name} (${report.location.country}) — ${report.currency}:`,
    `ingresos ${report.revenue.toLocaleString("es-CO")} ${report.currency},`,
    `ticket promedio ${report.averageTicket.toLocaleString("es-CO")} ${report.currency},`,
    `margen ${margin},`,
    `desperdicio ${report.wasteCost.toLocaleString("es-CO")} ${report.currency}`,
  );
});

console.log("\n6. Resumen global consolidado (USD)");
console.log("Locaciones:", locations.length);
console.log("Ventas:", globalSalesCount);
console.log("Ingresos totales:", `${globalRevenueUSD.toFixed(2)} USD`);
console.log(
  "Ticket promedio global:",
  `${(globalSalesCount === 0 ? 0 : globalRevenueUSD / globalSalesCount).toFixed(2)} USD`,
);
console.log(
  "Margen bruto global estimado:",
  globalMarginUSD === null ? "N/D" : `${globalMarginUSD.toFixed(2)}%`,
);
console.log("Desperdicio total:", `${globalWasteUSD.toFixed(2)} USD`);
console.log("Ingresos por país:", {
  Colombia: `${globalCountryComparison.Colombia.totalRevenue.toFixed(2)} USD`,
  USA: `${globalCountryComparison.USA.totalRevenue.toFixed(2)} USD`,
});
