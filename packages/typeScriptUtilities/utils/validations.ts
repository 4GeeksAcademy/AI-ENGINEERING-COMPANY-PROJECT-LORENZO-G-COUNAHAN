import type {
  Location,
  MenuItem,
  SaleTransaction,
  ValidationResult,
  WasteRecord,
} from "./models";

const isFiniteNumber = (value: number): boolean => Number.isFinite(value);

const validatePrice = (
  price: unknown,
  fieldName: string,
  errors: string[],
  minimum: "positive" | "nonNegative" | "any",
): void => {
  if (typeof price !== "object" || price === null) {
    errors.push(`${fieldName} debe contener importes USD y COP.`);
    return;
  }

  const amounts = price as Record<string, unknown>;
  (["USD", "COP"] as const).forEach((currency) => {
    const amount = amounts[currency];
    const minimumIsValid = typeof amount === "number" && (
      minimum === "any"
      || (minimum === "nonNegative" && amount >= 0)
      || (minimum === "positive" && amount > 0)
    );

    if (!minimumIsValid || !isFiniteNumber(amount as number)) {
      const comparator = minimum === "positive"
        ? "mayor que cero"
        : minimum === "nonNegative" ? "mayor o igual a cero" : "un número finito";
      errors.push(`${fieldName}.${currency} debe ser ${comparator}.`);
    }
  });
};

const validateRequiredString = (value: unknown, fieldName: string, errors: string[]): void => {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${fieldName} es obligatorio y no puede estar vacío.`);
  }
};

const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && Number.isFinite(value.getTime());

const createResult = (errors: string[]): ValidationResult => ({
  valid: errors.length === 0,
  errors,
});

export const validateMenuItem = (item: MenuItem): ValidationResult => {
  const errors: string[] = [];

  validateRequiredString(item.id, "id", errors);
  validateRequiredString(item.name, "name", errors);
  validatePrice(item.basePrice, "basePrice", errors, "positive");
  validatePrice(item.ingredientCost, "ingredientCost", errors, "positive");

  if (!isFiniteNumber(item.prepTimeMinutes) || item.prepTimeMinutes <= 0 || item.prepTimeMinutes > 60) {
    errors.push("prepTimeMinutes debe ser mayor que cero y menor o igual a 60.");
  }

  if (typeof item.isAvailableInColombia !== "boolean" || typeof item.isAvailableInUSA !== "boolean") {
    errors.push("La disponibilidad por país debe expresarse con valores booleanos.");
  } else if (!item.isAvailableInColombia && !item.isAvailableInUSA) {
    errors.push("El ítem debe estar disponible en al menos un país.");
  }

  if (!Array.isArray(item.allergens) || !item.allergens.every((allergen) => typeof allergen === "string")) {
    errors.push("allergens debe ser un array de cadenas.");
  }

  if (!["Meat", "Side", "Beverage", "Dessert", "Combo"].includes(item.category)) {
    errors.push("category no es un valor permitido.");
  }
  if (!["Active", "Seasonal", "Discontinued"].includes(item.status)) {
    errors.push("status no es un valor permitido.");
  }

  return createResult(errors);
};

export const validateSaleTransaction = (
  sale: SaleTransaction,
  menuItems: MenuItem[],
): ValidationResult => {
  const errors: string[] = [];

  validateRequiredString(sale.id, "id", errors);
  validateRequiredString(sale.locationId, "locationId", errors);
  validateRequiredString(sale.itemId, "itemId", errors);
  validateRequiredString(sale.waiterName, "waiterName", errors);

  if (!isFiniteNumber(sale.quantity) || sale.quantity <= 0) {
    errors.push("quantity debe ser mayor que cero.");
  }
  if (!Number.isInteger(sale.numberOfDiners) || sale.numberOfDiners <= 0) {
    errors.push("numberOfDiners debe ser un entero mayor que cero.");
  }
  validatePrice(sale.totalPrice, "totalPrice", errors, "nonNegative");

  if (!isValidDate(sale.timestamp)) {
    errors.push("timestamp debe ser una fecha válida.");
  }
  if (!["Cash", "Credit card", "Debit card", "Digital wallet"].includes(sale.paymentMethod)) {
    errors.push("paymentMethod no es un valor permitido.");
  }
  if (!menuItems.some((item) => item.id === sale.itemId)) {
    errors.push("itemId debe corresponder a un ítem existente en el catálogo.");
  }

  return createResult(errors);
};

export const validateLocation = (location: Location, currentYear: number): ValidationResult => {
  const errors: string[] = [];

  if (!Number.isInteger(currentYear) || currentYear < 2008) {
    errors.push("currentYear debe ser un año entero mayor o igual a 2008.");
  }

  validateRequiredString(location.id, "id", errors);
  validateRequiredString(location.name, "name", errors);
  validateRequiredString(location.city, "city", errors);
  validateRequiredString(location.manager, "manager", errors);

  if (!Number.isInteger(location.openingYear) || location.openingYear < 2008 || location.openingYear > currentYear) {
    errors.push(`openingYear debe ser un año entre 2008 y ${currentYear}.`);
  }
  if (!isFiniteNumber(location.seatingCapacity) || location.seatingCapacity <= 0) {
    errors.push("seatingCapacity debe ser mayor que cero.");
  }
  if (!Number.isInteger(location.staffCount) || location.staffCount <= 0) {
    errors.push("staffCount debe ser un entero mayor que cero.");
  }

  validatePrice(location.monthlyRentCost, "monthlyRentCost", errors, "positive");
  validatePrice(location.averageMonthlyUtilities, "averageMonthlyUtilities", errors, "positive");

  if (!["Colombia", "USA"].includes(location.country)) {
    errors.push("country no es un valor permitido.");
  }
  if (!["Active", "Temporarily closed", "Under renovation"].includes(location.status)) {
    errors.push("status no es un valor permitido.");
  }

  return createResult(errors);
};

export const validateWasteRecord = (record: WasteRecord): ValidationResult => {
  const errors: string[] = [];

  validateRequiredString(record.id, "id", errors);
  validateRequiredString(record.locationId, "locationId", errors);
  validateRequiredString(record.itemId, "itemId", errors);
  validateRequiredString(record.reportedBy, "reportedBy", errors);

  if (typeof record.quantity !== "number" || !isFiniteNumber(record.quantity)) {
    errors.push("quantity debe ser un número finito.");
  }
  validatePrice(record.cost, "cost", errors, "any");
  if (!isValidDate(record.timestamp)) {
    errors.push("timestamp debe ser una fecha válida.");
  }
  if (!["Expired", "Cooking error", "Customer return", "Damage", "Other"].includes(record.reason)) {
    errors.push("reason no es un valor permitido.");
  }

  return createResult(errors);
};
