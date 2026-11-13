import type { Location, MenuItem, SaleTransaction, WasteRecord } from "../utils/models";
import {
  validateLocation,
  validateMenuItem,
  validateSaleTransaction,
  validateWasteRecord,
} from "../utils/validations";

const menuItem: MenuItem = {
  id: "ITEM-HISTORICAL",
  name: "Historical special",
  category: "Combo",
  basePrice: { USD: 10, COP: 40000 },
  ingredientCost: { USD: 4, COP: 16000 },
  prepTimeMinutes: 25,
  isAvailableInColombia: true,
  isAvailableInUSA: false,
  allergens: [],
  status: "Discontinued",
};

const validSale: SaleTransaction = {
  id: "SALE-COMPLIMENTARY",
  locationId: "LOC-01",
  itemId: menuItem.id,
  quantity: 1,
  numberOfDiners: 2,
  totalPrice: { USD: 0, COP: 0 },
  paymentMethod: "Digital wallet",
  timestamp: new Date("2025-06-15T18:00:00.000Z"),
  waiterName: "Test waiter",
};

const validLocation: Location = {
  id: "LOC-01",
  name: "Bogota Centro",
  city: "Bogota",
  country: "Colombia",
  openingYear: 2020,
  seatingCapacity: 80,
  staffCount: 12,
  monthlyRentCost: { USD: 1000, COP: 4000000 },
  averageMonthlyUtilities: { USD: 100, COP: 400000 },
  manager: "Test manager",
  status: "Active",
};

const validWasteRecord: WasteRecord = {
  id: "WASTE-01",
  locationId: validLocation.id,
  itemId: menuItem.id,
  quantity: 1,
  reason: "Expired",
  cost: { USD: 4, COP: 16000 },
  timestamp: new Date("2025-06-15T18:00:00.000Z"),
  reportedBy: "Test reporter",
};

const negativeWasteCostRecord: WasteRecord = {
  ...validWasteRecord,
  cost: { USD: -2, COP: -8000 },
};

const invalidMenuItem: MenuItem = {
  ...menuItem,
  name: "   ",
  prepTimeMinutes: 61,
  basePrice: { USD: 0, COP: -1 },
  isAvailableInColombia: false,
  isAvailableInUSA: false,
};

const invalidSale: SaleTransaction = {
  ...validSale,
  quantity: 0,
  numberOfDiners: 0,
  itemId: "UNKNOWN",
  totalPrice: { USD: -1, COP: 0 },
};

const invalidLocation: Location = {
  ...validLocation,
  openingYear: 2007,
  seatingCapacity: 0,
  staffCount: 0,
  monthlyRentCost: { USD: 0, COP: -1 },
};

const validationCases = [
  { name: "valid menu item", expectedValid: true, result: validateMenuItem(menuItem) },
  { name: "invalid menu item", expectedValid: false, result: validateMenuItem(invalidMenuItem) },
  { name: "complimentary historical-item sale", expectedValid: true, result: validateSaleTransaction(validSale, [menuItem]) },
  { name: "sale with invalid quantity, diners, amount and item", expectedValid: false, result: validateSaleTransaction(invalidSale, [menuItem]) },
  { name: "valid location", expectedValid: true, result: validateLocation(validLocation, 2025) },
  { name: "invalid location", expectedValid: false, result: validateLocation(invalidLocation, 2025) },
  { name: "valid waste record", expectedValid: true, result: validateWasteRecord(validWasteRecord) },
  {
    name: "waste cost accepts finite negative amounts because no sign restriction is specified",
    expectedValid: true,
    result: validateWasteRecord(negativeWasteCostRecord),
  },
] as const;

export const validationCaseResults = validationCases.map(({ name, expectedValid, result }) => ({
  name,
  passed: result.valid === expectedValid && result.valid === (result.errors.length === 0),
  errors: result.errors,
}));
