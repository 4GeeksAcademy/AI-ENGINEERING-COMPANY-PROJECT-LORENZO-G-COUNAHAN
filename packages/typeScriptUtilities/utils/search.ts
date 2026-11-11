import type { Location, MenuItem } from "./models";

export const findLocationById = (locations: Location[], id: string): Location | null =>
  locations.find((location) => location.id === id) ?? null;

export const findMenuItemByName = (items: MenuItem[], name: string): MenuItem | null => {
  const normalizedName = name.trim().toLocaleLowerCase("en-US");
  return items.find((item) => item.name.trim().toLocaleLowerCase("en-US") === normalizedName) ?? null;
};

export const binarySearchLocationByCapacity = (
  sortedLocations: Location[],
  targetCapacity: number,
): number => {
  let low = 0;
  let high = sortedLocations.length - 1;

  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const capacity = sortedLocations[middle].seatingCapacity;

    if (capacity === targetCapacity) {
      return middle;
    }
    if (capacity < targetCapacity) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return -1;
};
