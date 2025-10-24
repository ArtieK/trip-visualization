import { ItineraryItem, ItemType, Location } from '../types';
import { LatLngBounds } from 'leaflet';

/**
 * Filters items by type
 */
export const filterItemsByType = (
  items: ItineraryItem[],
  type: ItemType
): ItineraryItem[] => {
  return items.filter(item => item.type === type);
};

/**
 * Filters items within a date range
 */
export const getItemsByDateRange = (
  items: ItineraryItem[],
  startDate: Date,
  endDate: Date
): ItineraryItem[] => {
  return items.filter(item => {
    return item.startDate >= startDate && item.startDate <= endDate;
  });
};

/**
 * Gets all unique locations from items
 */
export const getAllLocations = (items: ItineraryItem[]): Location[] => {
  const locations: Location[] = [];

  items.forEach(item => {
    if (item.type === 'flight') {
      locations.push(item.origin);
      locations.push(item.destination);
    } else if (item.type === 'accommodation' || item.type === 'activity') {
      locations.push(item.location);
    }
  });

  return locations;
};

/**
 * Calculates the bounding box for all trip locations
 * Returns undefined if there are no locations
 */
export const calculateTripBounds = (items: ItineraryItem[]): LatLngBounds | undefined => {
  const locations = getAllLocations(items);

  if (locations.length === 0) {
    return undefined;
  }

  const bounds = new LatLngBounds(
    [locations[0].lat, locations[0].lng],
    [locations[0].lat, locations[0].lng]
  );

  locations.forEach(loc => {
    bounds.extend([loc.lat, loc.lng]);
  });

  return bounds;
};

/**
 * Gets the chronological route for map visualization
 * Returns an array of locations in the order they should be visited
 */
export const getRouteLocations = (items: ItineraryItem[]): Location[] => {
  const sortedItems = [...items].sort((a, b) =>
    a.startDate.getTime() - b.startDate.getTime()
  );

  const route: Location[] = [];

  sortedItems.forEach(item => {
    if (item.type === 'flight') {
      route.push(item.origin);
      route.push(item.destination);
    } else if (item.type === 'activity') {
      route.push(item.location);
    }
    // Accommodations are excluded from route but shown as markers
  });

  return route;
};

/**
 * Generates a unique ID for items
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
