export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export type ItemType = 'flight' | 'accommodation' | 'activity';
export type ActivityType = 'restaurant' | 'tour' | 'attraction' | 'other';

export interface BaseItem {
  id: string;
  type: ItemType;
  tripId: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface Flight extends BaseItem {
  type: 'flight';
  origin: Location;
  destination: Location;
  departureTime: Date;
  arrivalTime: Date;
  airline?: string;
  flightNumber?: string;
  confirmationNumber?: string;
}

export interface Accommodation extends BaseItem {
  type: 'accommodation';
  name: string;
  location: Location;
  checkIn: Date;
  checkOut: Date;
  bookingReference?: string;
}

export interface Activity extends BaseItem {
  type: 'activity';
  name: string;
  location: Location;
  activityType: ActivityType;
  time?: string;
}

export type ItineraryItem = Flight | Accommodation | Activity;

export interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  items: ItineraryItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TripState {
  trips: Trip[];
  currentTripId: string | null;
}

export type TripAction =
  | { type: 'SET_TRIPS'; payload: Trip[] }
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: Trip }
  | { type: 'DELETE_TRIP'; payload: string }
  | { type: 'SET_CURRENT_TRIP'; payload: string | null }
  | { type: 'ADD_ITEM'; payload: { tripId: string; item: ItineraryItem } }
  | { type: 'UPDATE_ITEM'; payload: { tripId: string; item: ItineraryItem } }
  | { type: 'DELETE_ITEM'; payload: { tripId: string; itemId: string } };
