import { Trip, ItineraryItem } from '../types';

const STORAGE_KEY = 'trip-visualizer-data';

/**
 * Serializes dates when saving to localStorage
 */
const serializeTrips = (trips: Trip[]): string => {
  return JSON.stringify(trips, (key, value) => {
    // Convert Date objects to ISO strings
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
};

/**
 * Deserializes dates when loading from localStorage
 */
const deserializeTrips = (data: string): Trip[] => {
  const parsed = JSON.parse(data);

  return parsed.map((trip: any) => ({
    ...trip,
    startDate: new Date(trip.startDate),
    endDate: new Date(trip.endDate),
    createdAt: new Date(trip.createdAt),
    updatedAt: new Date(trip.updatedAt),
    items: trip.items.map((item: any) => {
      const baseItem = {
        ...item,
        startDate: new Date(item.startDate),
        endDate: item.endDate ? new Date(item.endDate) : undefined,
      };

      if (item.type === 'flight') {
        return {
          ...baseItem,
          departureTime: new Date(item.departureTime),
          arrivalTime: new Date(item.arrivalTime),
        };
      } else if (item.type === 'accommodation') {
        return {
          ...baseItem,
          checkIn: new Date(item.checkIn),
          checkOut: new Date(item.checkOut),
        };
      }

      return baseItem;
    }),
  }));
};

/**
 * Saves trips to localStorage
 */
export const saveTrips = (trips: Trip[]): void => {
  try {
    const serialized = serializeTrips(trips);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save trips to localStorage:', error);

    // Check if quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please delete some trips to free up space.');
    }
  }
};

/**
 * Loads trips from localStorage
 */
export const loadTrips = (): Trip[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return deserializeTrips(data);
  } catch (error) {
    console.error('Failed to load trips from localStorage:', error);
    return [];
  }
};

/**
 * Clears all trip data from localStorage
 */
export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

/**
 * Saves current trip ID to localStorage
 */
export const saveCurrentTripId = (tripId: string | null): void => {
  try {
    if (tripId) {
      localStorage.setItem('current-trip-id', tripId);
    } else {
      localStorage.removeItem('current-trip-id');
    }
  } catch (error) {
    console.error('Failed to save current trip ID:', error);
  }
};

/**
 * Loads current trip ID from localStorage
 */
export const loadCurrentTripId = (): string | null => {
  try {
    return localStorage.getItem('current-trip-id');
  } catch (error) {
    console.error('Failed to load current trip ID:', error);
    return null;
  }
};
