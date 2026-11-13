import type {
  Country,
  CountryComparison,
  CountryMetrics,
  Currency,
  Location,
  MenuItem,
  PaymentMethod,
  RankedLocation,
  SaleTransaction,
  SalesByPaymentMethod,
  TopSellingItem,
  WasteByReason,
  WasteReason,
  WasteRecord,
} from "./models";

const BUSINESS_TIME_ZONE = "America/Bogota";
const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "Credit card", "Debit card", "Digital wallet"];
const WASTE_REASONS: WasteReason[] = ["Expired", "Cooking error", "Customer return", "Damage", "Other"];

const roundToTwoDecimals = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const getBusinessDayKey = (date: Date): number | null => {
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
    ? Date.UTC(year, month - 1, day)
    : null;
};

const getLocalDayNumber = (year: number, month: number, day: number): number =>
  Date.UTC(year, month - 1, day) / 86_400_000;

const getLocalDateParts = (date: Date): { year: number; month: number; day: number } | null => {
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

const getItemMap = (menuItems: MenuItem[]): Map<string, MenuItem> =>
  new Map(menuItems.map((item) => [item.id, item]));

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  return roundToTwoDecimals(fromCurrency === "USD" ? amount * 4000 : amount / 4000);
};

export const calculateDailyRevenue = (
  sales: SaleTransaction[],
  date: Date,
  currency: Currency,
): number => {
  const requestedDay = getBusinessDayKey(date);
  if (requestedDay === null) {
    return 0;
  }

  const revenue = sales.reduce((total, sale) =>
    getBusinessDayKey(sale.timestamp) === requestedDay ? total + sale.totalPrice[currency] : total,
  0);
  return roundToTwoDecimals(revenue);
};

export const calculateLocationMargin = (
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  locationId: string,
  currency: Currency,
): number | null => {
  const itemById = getItemMap(menuItems);
  const locationSales = sales.filter((sale) => sale.locationId === locationId);
  const revenue = locationSales.reduce((total, sale) => total + sale.totalPrice[currency], 0);
  const ingredientCost = locationSales.reduce((total, sale) => {
    const item = itemById.get(sale.itemId);
    return item === undefined ? total : total + item.ingredientCost[currency] * sale.quantity;
  }, 0);

  if (revenue === 0) {
    return null;
  }

  return roundToTwoDecimals(((revenue - ingredientCost) / revenue) * 100);
};

export const calculateWasteCost = (
  wasteRecords: WasteRecord[],
  locationId: string,
  currency: Currency,
): number => roundToTwoDecimals(
  wasteRecords
    .filter((record) => record.locationId === locationId)
    .reduce((total, record) => total + record.cost[currency], 0),
);

export const countSalesByPaymentMethod = (sales: SaleTransaction[]): SalesByPaymentMethod => {
  const counts = Object.fromEntries(PAYMENT_METHODS.map((method) => [method, 0])) as SalesByPaymentMethod;
  sales.forEach((sale) => { counts[sale.paymentMethod] += 1; });
  return counts;
};

export const calculateAverageTicket = (sales: SaleTransaction[], currency: Currency): number =>
  sales.length === 0
    ? 0
    : roundToTwoDecimals(sales.reduce((total, sale) => total + sale.totalPrice[currency], 0) / sales.length);

export const findTopSellingItems = (
  sales: SaleTransaction[],
  menuItems: MenuItem[],
  topN: number,
): TopSellingItem[] => {
  if (topN <= 0) {
    return [];
  }

  const quantities = new Map<string, number>();
  sales.forEach((sale) => quantities.set(sale.itemId, (quantities.get(sale.itemId) ?? 0) + sale.quantity));
  const itemById = getItemMap(menuItems);

  return [...quantities.entries()]
    .flatMap(([itemId, totalSold]) => {
      const item = itemById.get(itemId);
      return item === undefined ? [] : [{ item, totalSold }];
    })
    .sort((left, right) => right.totalSold - left.totalSold)
    .slice(0, Math.floor(topN));
};

export const groupWasteByReason = (wasteRecords: WasteRecord[]): WasteByReason => {
  const grouped: WasteByReason = {
    Expired: [],
    "Cooking error": [],
    "Customer return": [],
    Damage: [],
    Other: [],
  };
  wasteRecords.forEach((record) => grouped[record.reason].push(record));
  return grouped;
};

export const calculateCountryComparison = (
  sales: SaleTransaction[],
  locations: Location[],
  _menuItems: MenuItem[],
  currency: Currency,
): CountryComparison => {
  const countryMetrics = (country: Country): CountryMetrics => {
    const countryLocations = locations.filter((location) => location.country === country);
    const locationIds = new Set(countryLocations.map((location) => location.id));
    const locationById = new Map(countryLocations.map((location) => [location.id, location]));
    const totalRevenue = sales
      .filter((sale) => locationIds.has(sale.locationId))
      .reduce((total, sale) => {
        const location = locationById.get(sale.locationId);
        const sourceCurrency: Currency = location?.country === "Colombia" ? "COP" : "USD";
        return total + convertCurrency(sale.totalPrice[sourceCurrency], sourceCurrency, currency);
      }, 0);

    return {
      totalLocations: countryLocations.length,
      totalRevenue: roundToTwoDecimals(totalRevenue),
      averageRevenuePerLocation: countryLocations.length === 0
        ? 0
        : roundToTwoDecimals(totalRevenue / countryLocations.length),
      totalSales: sales.filter((sale) => locationIds.has(sale.locationId)).length,
      currency,
    };
  };

  return { Colombia: countryMetrics("Colombia"), USA: countryMetrics("USA") };
};

export interface RevenueReport {
  total: number;
  average: number;
  maximum: number;
  minimum: number;
}

export const summarizeRevenue = (amounts: number[]): RevenueReport => {
  if (amounts.length === 0) {
    return { total: 0, average: 0, maximum: 0, minimum: 0 };
  }

  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  return {
    total: roundToTwoDecimals(total),
    average: roundToTwoDecimals(total / amounts.length),
    maximum: Math.max(...amounts),
    minimum: Math.min(...amounts),
  };
};

export const scoreLocationPerformance = (
  location: Location,
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[],
  startDate: Date,
  endDate: Date,
  asOfDate: Date,
): number => {
  const start = getLocalDateParts(startDate);
  const end = getLocalDateParts(endDate);
  if (start === null || end === null) {
    return 0;
  }

  const startDay = getLocalDayNumber(start.year, start.month, start.day);
  const endDay = getLocalDayNumber(end.year, end.month, end.day);
  if (endDay < startDay) {
    return 0;
  }

  const locationSales = sales.filter((sale) => sale.locationId === location.id);
  const revenueUSD = locationSales.reduce((total, sale) => total + sale.totalPrice.USD, 0);
  const openingDay = getLocalDayNumber(location.openingYear, 1, 1);
  const today = getLocalDateParts(asOfDate);
  if (today === null) {
    return 0;
  }
  const elapsedDays = Math.max(1, getLocalDayNumber(today.year, today.month, today.day) - openingDay + 1);
  const revenuePoints = Math.min(40, (revenueUSD / elapsedDays / 1000) * 40);

  const diners = locationSales.reduce((total, sale) => {
    const saleDay = getBusinessDayKey(sale.timestamp);
    return saleDay !== null && saleDay >= startDay * 86_400_000 && saleDay <= endDay * 86_400_000
      ? total + sale.numberOfDiners
      : total;
  }, 0);
  const periodDays = endDay - startDay + 1;
  const seatCapacity = location.seatingCapacity * 2 * periodDays;
  const efficiencyPoints = seatCapacity > 0 ? Math.min(30, (diners / seatCapacity) * 30) : 0;

  const wasteCostUSD = wasteRecords
    .filter((record) => record.locationId === location.id)
    .reduce((total, record) => total + record.cost.USD, 0);
  const wastePoints = revenueUSD === 0 ? 0 : Math.max(0, 20 - (wasteCostUSD / revenueUSD) * 200);

  const margin = calculateLocationMargin(sales, menuItems, location.id, "USD");
  const marginPoints = margin === null ? 0 : Math.min(10, margin / 10);

  return roundToTwoDecimals(revenuePoints + efficiencyPoints + wastePoints + marginPoints);
};

export const rankLocationsByPerformance = (
  locations: Location[],
  sales: SaleTransaction[],
  wasteRecords: WasteRecord[],
  menuItems: MenuItem[],
  startDate: Date,
  endDate: Date,
  asOfDate: Date,
): RankedLocation[] => locations
  .map((location, inputIndex) => ({
    location,
    score: scoreLocationPerformance(location, sales, wasteRecords, menuItems, startDate, endDate, asOfDate),
    inputIndex,
  }))
  .sort((left, right) => right.score - left.score || left.inputIndex - right.inputIndex)
  .map(({ location, score }) => ({ location, score }));
