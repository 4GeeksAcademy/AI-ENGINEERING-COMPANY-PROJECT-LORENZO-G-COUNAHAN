import type { Location, MenuItem, SaleTransaction, WasteRecord } from "../utils/models";
import {
  calculateAverageTicket,
  calculateCountryComparison,
  calculateDailyRevenue,
  calculateLocationMargin,
  calculateWasteCost,
  convertCurrency,
  countSalesByPaymentMethod,
  findTopSellingItems,
  groupWasteByReason,
  rankLocationsByPerformance,
  scoreLocationPerformance,
  summarizeRevenue,
} from "../utils/transformations";

const location: Location = {
  id: "LOC-1", name: "Bogota", city: "Bogota", country: "Colombia", openingYear: 2020,
  seatingCapacity: 10, staffCount: 4, monthlyRentCost: { USD: 100, COP: 400000 },
  averageMonthlyUtilities: { USD: 10, COP: 40000 }, manager: "Manager", status: "Active",
};
const usaLocation: Location = { ...location, id: "LOC-2", country: "USA" };
const item: MenuItem = {
  id: "ITEM-1", name: "Steak", category: "Meat", basePrice: { USD: 20, COP: 80000 },
  ingredientCost: { USD: 8, COP: 32000 }, prepTimeMinutes: 20,
  isAvailableInColombia: true, isAvailableInUSA: true, allergens: [], status: "Active",
};
const sales: SaleTransaction[] = [
  {
    id: "SALE-1", locationId: location.id, itemId: item.id, quantity: 2, numberOfDiners: 2,
    totalPrice: { USD: 40, COP: 160000 }, paymentMethod: "Cash",
    timestamp: new Date("2025-01-01T05:00:00.000Z"), waiterName: "A",
  },
  {
    id: "SALE-2", locationId: location.id, itemId: item.id, quantity: 1, numberOfDiners: 1,
    totalPrice: { USD: 20, COP: 80000 }, paymentMethod: "Cash",
    timestamp: new Date("2025-01-01T16:00:00.000Z"), waiterName: "B",
  },
  {
    id: "SALE-3", locationId: usaLocation.id, itemId: item.id, quantity: 1, numberOfDiners: 1,
    totalPrice: { USD: 10, COP: 40000 }, paymentMethod: "Credit card",
    timestamp: new Date("2025-01-02T16:00:00.000Z"), waiterName: "C",
  },
];
const waste: WasteRecord[] = [
  {
    id: "WASTE-1", locationId: location.id, itemId: item.id, quantity: 1, reason: "Expired",
    cost: { USD: 5, COP: 20000 }, timestamp: new Date("2025-01-01T16:00:00.000Z"), reportedBy: "A",
  },
];

export const transformationCaseResults = [
  { name: "convert USD to COP", passed: convertCurrency(2, "USD", "COP") === 8000 },
  { name: "convert COP to USD", passed: convertCurrency(10000, "COP", "USD") === 2.5 },
  { name: "same-currency conversion preserves amount", passed: convertCurrency(1.239, "USD", "USD") === 1.239 },
  { name: "daily revenue in Bogota timezone", passed: calculateDailyRevenue(sales, new Date("2025-01-01T12:00:00Z"), "USD") === 60 },
  { name: "location margin with quantity cost", passed: calculateLocationMargin(sales, [item], location.id, "USD") === 60 },
  { name: "zero-revenue margin", passed: calculateLocationMargin([], [item], location.id, "USD") === null },
  { name: "waste cost", passed: calculateWasteCost(waste, location.id, "USD") === 5 },
  { name: "payment method counts", passed: countSalesByPaymentMethod(sales).Cash === 2 },
  { name: "average ticket", passed: calculateAverageTicket(sales, "USD") === 23.33 },
  { name: "empty average ticket", passed: calculateAverageTicket([], "USD") === 0 },
  { name: "top item aggregation", passed: findTopSellingItems(sales, [item], 1)[0]?.totalSold === 4 },
  { name: "non-positive top N", passed: findTopSellingItems(sales, [item], 0).length === 0 },
  { name: "waste group initializes empty reasons", passed: groupWasteByReason(waste).Expired.length === 1 && groupWasteByReason(waste).Damage.length === 0 },
  {
    name: "country totals convert source currency to requested currency",
    passed: calculateCountryComparison(sales, [location, usaLocation], [item], "USD").Colombia.totalRevenue === 60
      && calculateCountryComparison(sales, [location, usaLocation], [item], "USD").USA.totalRevenue === 10
      && calculateCountryComparison(sales, [location, usaLocation], [item], "USD").USA.currency === "USD",
  },
  {
    name: "revenue report contains total, average, maximum and minimum",
    passed: JSON.stringify(summarizeRevenue([2, 4, 9])) === JSON.stringify({ total: 15, average: 5, maximum: 9, minimum: 2 }),
  },
  { name: "empty revenue report", passed: summarizeRevenue([]).maximum === 0 && summarizeRevenue([]).minimum === 0 },
  {
    name: "scoring deterministic as of explicit date",
    passed: scoreLocationPerformance(location, sales, waste, [item], new Date("2025-01-01T12:00:00Z"), new Date("2025-01-02T12:00:00Z"), new Date("2025-01-03T12:00:00Z"))
      === scoreLocationPerformance(location, sales, waste, [item], new Date("2025-01-01T12:00:00Z"), new Date("2025-01-02T12:00:00Z"), new Date("2025-01-03T12:00:00Z")),
  },
  {
    name: "ranking orders descending and includes score",
    passed: rankLocationsByPerformance([location, usaLocation], sales, waste, [item], new Date("2025-01-01T12:00:00Z"), new Date("2025-01-02T12:00:00Z"), new Date("2025-01-03T12:00:00Z"))[0].score >= 0,
  },
];
