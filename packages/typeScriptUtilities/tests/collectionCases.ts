import type { Location, MenuItem, SaleTransaction } from "../utils/models";
import {
  filterActiveLocations,
  filterLocations,
  filterMenuItems,
  filterMenuItemsByCategory,
  filterSalesByDateRange,
  filterSalesByLocation,
  sortLocationsByCapacity,
  sortMenuItemsByPrice,
} from "../utils/collections";

const locations: Location[] = [
  {
    id: "LOC-80", name: "Eighty", city: "Bogota", country: "Colombia", openingYear: 2020,
    seatingCapacity: 80, staffCount: 8, monthlyRentCost: { USD: 100, COP: 400000 },
    averageMonthlyUtilities: { USD: 10, COP: 40000 }, manager: "A", status: "Active",
  },
  {
    id: "LOC-40", name: "Forty", city: "Cali", country: "Colombia", openingYear: 2021,
    seatingCapacity: 40, staffCount: 4, monthlyRentCost: { USD: 100, COP: 400000 },
    averageMonthlyUtilities: { USD: 10, COP: 40000 }, manager: "B", status: "Temporarily closed",
  },
];

const menuItems: MenuItem[] = [
  {
    id: "ITEM-1", name: "Side", category: "Side", basePrice: { USD: 2, COP: 8000 },
    ingredientCost: { USD: 1, COP: 4000 }, prepTimeMinutes: 5,
    isAvailableInColombia: true, isAvailableInUSA: true, allergens: [], status: "Active",
  },
  {
    id: "ITEM-2", name: "Drink", category: "Beverage", basePrice: { USD: 3, COP: 12000 },
    ingredientCost: { USD: 1, COP: 4000 }, prepTimeMinutes: 2,
    isAvailableInColombia: true, isAvailableInUSA: true, allergens: [], status: "Seasonal",
  },
];

const sales: SaleTransaction[] = [
  {
    id: "SALE-START", locationId: "LOC-80", itemId: "ITEM-1", quantity: 1, numberOfDiners: 1,
    totalPrice: { USD: 2, COP: 8000 }, paymentMethod: "Cash",
    timestamp: new Date("2025-01-01T05:00:00.000Z"), waiterName: "A",
  },
  {
    id: "SALE-END", locationId: "LOC-40", itemId: "ITEM-2", quantity: 1, numberOfDiners: 1,
    totalPrice: { USD: 3, COP: 12000 }, paymentMethod: "Cash",
    timestamp: new Date("2025-01-02T04:59:59.000Z"), waiterName: "B",
  },
];

const originalLocationIds = locations.map(({ id }) => id);
const originalMenuIds = menuItems.map(({ id }) => id);
const dateRangeResults = filterSalesByDateRange(sales, new Date("2025-01-01T12:00:00Z"), new Date("2025-01-01T12:00:00Z"));

export const collectionCaseResults = [
  { name: "filter by location", passed: filterSalesByLocation(sales, "LOC-80").length === 1 },
  { name: "empty location filter", passed: filterSalesByLocation([], "LOC-80").length === 0 },
  { name: "Bogota local-day inclusive boundaries", passed: dateRangeResults.length === 2 },
  { name: "empty date filter", passed: filterSalesByDateRange([], new Date(), new Date()).length === 0 },
  { name: "filter category", passed: filterMenuItemsByCategory(menuItems, "Side").length === 1 },
  {
    name: "combine menu category, status, and inclusive COP price range",
    passed: filterMenuItems(menuItems, {
      category: "Beverage", status: "Seasonal", currency: "COP", minPrice: 12000, maxPrice: 12000,
    }).length === 1,
  },
  {
    name: "combine location status, country, and capacity range",
    passed: filterLocations(locations, {
      status: "Temporarily closed", country: "Colombia", minCapacity: 40, maxCapacity: 40,
    }).length === 1,
  },
  { name: "filter active locations", passed: filterActiveLocations(locations).length === 1 },
  { name: "sort capacity ascending", passed: sortLocationsByCapacity(locations, "asc")[0].seatingCapacity === 40 },
  { name: "sort capacity descending", passed: sortLocationsByCapacity(locations, "desc")[0].seatingCapacity === 80 },
  { name: "sort price by COP", passed: sortMenuItemsByPrice(menuItems, "COP", "desc")[0].basePrice.COP === 12000 },
  {
    name: "sorting does not mutate input arrays",
    passed: locations.map(({ id }) => id).join() === originalLocationIds.join()
      && menuItems.map(({ id }) => id).join() === originalMenuIds.join(),
  },
];
