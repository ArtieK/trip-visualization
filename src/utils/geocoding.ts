import { Location } from '../types';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'TripVisualizerApp/1.0';

// Rate limiting: wait at least 1 second between requests
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
};

/**
 * Geocodes an address string to latitude/longitude coordinates
 * Uses OpenStreetMap Nominatim API
 */
export const geocodeAddress = async (address: string): Promise<Location> => {
  if (!address || address.trim() === '') {
    throw new Error('Address cannot be empty');
  }

  await waitForRateLimit();

  const params = new URLSearchParams({
    q: address,
    format: 'json',
    limit: '1',
  });

  try {
    const response = await fetch(`${NOMINATIM_API}/search?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('Address not found. Please try a different address format.');
    }

    const result = data[0];

    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Geocoding error: ${error.message}`);
    }
    throw new Error('Failed to geocode address');
  }
};

/**
 * Reverse geocodes coordinates to an address
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  await waitForRateLimit();

  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: 'json',
  });

  try {
    const response = await fetch(`${NOMINATIM_API}/reverse?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.display_name) {
      throw new Error('Unable to find address for coordinates');
    }

    return data.display_name;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Reverse geocoding error: ${error.message}`);
    }
    throw new Error('Failed to reverse geocode coordinates');
  }
};
