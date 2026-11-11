import type { Location, MenuItem } from "../utils/models";
import {
  binarySearchLocationByCapacity,
  findLocationById,
  findMenuItemByName,
} from "../utils/search";

const locations: Location[] = [
  {
    id: "LOC-40", name: "Forty", city: "Bogota", country: "Colombia", openingYear: 2020,
    seatingCapacity: 40, staffCount: 4, monthlyRentCost: { USD: 100, COP: 400000 },
    averageMonthlyUtilities: { USD: 10, COP: 40000 }, manager: "A", status: "Active",
  },
  {
    id: "LOC-80", name: "Eighty", city: "Cali", country: "Colombia", openingYear: 2021,
    seatingCapacity: 80, staffCount: 8, monthlyRentCost: { USD: 100, COP: 400000 },
    averageMonthlyUtilities: { USD: 10, COP: 40000 }, manager: "B", status: "Active",
  },
];

const items: MenuItem[] = [
  {
    id: "ITEM-1", name: "Picanha", category: "Meat", basePrice: { USD: 18, COP: 72000 },
    ingredientCost: { USD: 7, COP: 28000 }, prepTimeMinutes: 15,
    isAvailableInColombia: true, isAvailableInUSA: true, allergens: [], status: "Active",
  },
];

export const searchCaseResults = [
  { name: "linear location search", passed: findLocationById(locations, "LOC-80")?.id === "LOC-80" },
  { name: "missing location", passed: findLocationById(locations, "UNKNOWN") === null },
  { name: "empty location search", passed: findLocationById([], "LOC-40") === null },
  { name: "case-insensitive menu search", passed: findMenuItemByName(items, "pIcAnHa")?.id === "ITEM-1" },
  { name: "missing menu item", passed: findMenuItemByName(items, "Unknown") === null },
  { name: "binary search middle value", passed: binarySearchLocationByCapacity(locations, 80) === 1 },
  { name: "binary search missing value", passed: binarySearchLocationByCapacity(locations, 60) === -1 },
  { name: "binary search empty array", passed: binarySearchLocationByCapacity([], 60) === -1 },
  { name: "binary search single element", passed: binarySearchLocationByCapacity(locations.slice(0, 1), 40) === 0 },
];
