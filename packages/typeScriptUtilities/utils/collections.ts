import type {
  Currency,
  Location,
  MenuCategory,
  MenuItem,
  MenuItemStatus,
  SaleTransaction,
  SortOrder,
} from "./models";

const BUSINESS_TIME_ZONE = "America/Bogota";

const datePartsInBusinessZone = (date: Date): { year: number; month: number; day: number } | null => {
  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);

  return Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
    ? { year, month, day }
    : null;
};

const toDayKey = (parts: { year: number; month: number; day: number }): number =>
  Date.UTC(parts.year, parts.month - 1, parts.day);

const compareByOrder = (left: number, right: number, order: SortOrder): number =>
  order === "asc" ? left - right : right - left;

export interface MenuItemFilters {
  category?: MenuCategory;
  status?: MenuItemStatus;
  currency?: Currency;
  minPrice?: number;
  maxPrice?: number;
}

export interface LocationFilters {
  status?: Location["status"];
  country?: Location["country"];
  minCapacity?: number;
  maxCapacity?: number;
}

export const filterSalesByLocation = (
  sales: SaleTransaction[],
  locationId: string,
): SaleTransaction[] => sales.filter((sale) => sale.locationId === locationId);

export const filterSalesByDateRange = (
  sales: SaleTransaction[],
  startDate: Date,
  endDate: Date,
): SaleTransaction[] => {
  const startParts = datePartsInBusinessZone(startDate);
  const endParts = datePartsInBusinessZone(endDate);

  if (startParts === null || endParts === null) {
    return [];
  }

  const startKey = toDayKey(startParts);
  const endKey = toDayKey(endParts);
  if (startKey > endKey) {
    return [];
  }

  return sales.filter((sale) => {
    const saleParts = datePartsInBusinessZone(sale.timestamp);
    if (saleParts === null) {
      return false;
    }

    const saleKey = toDayKey(saleParts);
    return saleKey >= startKey && saleKey <= endKey;
  });
};

export const filterMenuItemsByCategory = (
  items: MenuItem[],
  category: MenuCategory,
): MenuItem[] => items.filter((item) => item.category === category);

export const filterActiveLocations = (locations: Location[]): Location[] =>
  locations.filter((location) => location.status === "Active");

export const filterLocations = (
  locations: Location[],
  filters: LocationFilters,
): Location[] => locations.filter((location) => {
  const matchesStatus = filters.status === undefined || location.status === filters.status;
  const matchesCountry = filters.country === undefined || location.country === filters.country;
  const matchesMinimumCapacity = filters.minCapacity === undefined
    || location.seatingCapacity >= filters.minCapacity;
  const matchesMaximumCapacity = filters.maxCapacity === undefined
    || location.seatingCapacity <= filters.maxCapacity;

  return matchesStatus && matchesCountry && matchesMinimumCapacity && matchesMaximumCapacity;
});

export const filterMenuItems = (
  items: MenuItem[],
  filters: MenuItemFilters,
): MenuItem[] => items.filter((item) => {
  const matchesCategory = filters.category === undefined || item.category === filters.category;
  const matchesStatus = filters.status === undefined || item.status === filters.status;
  const price = filters.currency === undefined ? undefined : item.basePrice[filters.currency];
  const matchesMinimumPrice = filters.minPrice === undefined
    || (price !== undefined && price >= filters.minPrice);
  const matchesMaximumPrice = filters.maxPrice === undefined
    || (price !== undefined && price <= filters.maxPrice);

  return matchesCategory && matchesStatus && matchesMinimumPrice && matchesMaximumPrice;
});

export const sortLocationsByCapacity = (
  locations: Location[],
  order: SortOrder,
): Location[] =>
  [...locations].sort((left, right) =>
    compareByOrder(left.seatingCapacity, right.seatingCapacity, order),
  );

export const sortMenuItemsByPrice = (
  items: MenuItem[],
  currency: Currency,
  order: SortOrder,
): MenuItem[] =>
  [...items].sort((left, right) =>
    compareByOrder(left.basePrice[currency], right.basePrice[currency], order),
  );
