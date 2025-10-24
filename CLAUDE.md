# Travel Itinerary Visualizer

## Project Overview

A web application that allows travelers to create, manage, and visualize their trip itineraries through an interactive map interface and organized timeline view. Users can add flights, accommodations, and activities, then see their entire journey plotted on a map with routes connecting each destination.

## Core Concept

The application addresses a common travel planning pain point: keeping track of all trip components (flights, hotels, activities) in one place while being able to visualize the geographic flow of the journey. Rather than managing booking confirmations across emails and apps, travelers can input their itinerary once and see everything organized chronologically and geographically.

## User Flow

1. **Create a Trip**: User creates a new trip with a name, start date, and end date
2. **Add Itinerary Items**: User adds three types of items:
   - **Flights**: Origin, destination, departure/arrival times, airline, confirmation numbers
   - **Accommodations**: Hotel name, address, check-in/check-out dates, booking reference
   - **Activities**: Restaurant reservations, tours, attractions with location, date/time, and notes
3. **Visualize on Map**: All locations appear as markers on an interactive map with lines connecting destinations in chronological order
4. **View Timeline**: Items are organized by day with times, showing the trip's flow from start to finish
5. **Edit & Manage**: Users can edit details, reorder items, or delete components as plans change
6. **Multiple Trips**: Users can create and switch between multiple trips, all saved in browser storage

## Key Features

### Trip Management
- Create multiple named trips with date ranges
- Switch between trips via dropdown selector
- Delete trips when no longer needed
- Automatic persistence using browser localStorage
- Each trip maintains its own collection of itinerary items

### Itinerary Item Types

**Flights**
- Origin and destination cities/airports
- Departure and arrival date/time
- Airline name (optional)
- Flight number (optional)
- Confirmation number (optional)
- Notes field for gate info, seat numbers, etc.

**Accommodations**
- Hotel/Airbnb name
- Full address with geocoding
- Check-in and check-out dates/times
- Booking reference number
- Notes for special requests or instructions

**Activities**
- Activity name (restaurant, tour, attraction)
- Activity type categorization
- Location with address
- Date and time
- Notes for reservation details, what to bring, etc.

### Map Visualization
- Interactive map powered by Leaflet (OpenStreetMap)
- Different colored markers for each item type
- Clickable markers that show item details in popup
- Polylines connecting locations in chronological order
- Auto-zoom and center to fit all trip locations
- Flight paths shown as lines between origin and destination
- Visual representation of the journey's geographic scope

### Timeline View
- Organized by day with clear date headers
- Day counter (Day 1, Day 2, etc.)
- Items sorted chronologically within each day
- Time display for each item
- Icons indicating item type (plane, hotel, map pin)
- Expandable cards showing all item details
- Quick edit and delete actions on each item

### Forms and Data Entry
- Clean, validated forms for each item type
- Address geocoding using OpenStreetMap Nominatim API
- Date and time pickers with validation
- Real-time form validation with error messages
- Optional fields clearly marked
- Form autofill for editing existing items
- Loading states during address geocoding

### Data Persistence
- All trips and items saved to browser localStorage
- Automatic saving on every change
- Data survives page refreshes and browser restarts
- JSON serialization with date handling
- No backend required for MVP

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe component development
- **Vite** as build tool for fast development experience
- **Tailwind CSS** for utility-first styling and responsive design
- **React Leaflet** for interactive map components
- **Leaflet** core library for mapping functionality
- **React Hook Form** for performant form management
- **Zod** for schema validation
- **date-fns** for date manipulation and formatting
- **Lucide React** for consistent iconography

### State Management
- React Context API for global trip state
- `useReducer` hook for complex state transitions
- Centralized actions for all state mutations
- Derived state for current trip
- Type-safe dispatch with TypeScript discriminated unions

### Data Models

**Trip Interface**
```typescript
interface Trip {
  id: string;                    // UUID
  name: string;                  // User-defined trip name
  startDate: Date;               // Trip start
  endDate: Date;                 // Trip end
  items: ItineraryItem[];        // All trip components
  createdAt: Date;               // Timestamp
  updatedAt: Date;               // Last modified
}
```

**Location Interface**
```typescript
interface Location {
  lat: number;                   // Latitude
  lng: number;                   // Longitude
  address: string;               // Human-readable address
}
```

**Item Types** (using TypeScript discriminated unions)
```typescript
type ItemType = 'flight' | 'accommodation' | 'activity';

interface BaseItem {
  id: string;
  type: ItemType;
  tripId: string;
  startDate: Date;
  endDate?: Date;
  location: Location;
  notes?: string;
}

interface Flight extends BaseItem {
  type: 'flight';
  origin: Location;
  destination: Location;
  airline?: string;
  flightNumber?: string;
  confirmationNumber?: string;
}

interface Accommodation extends BaseItem {
  type: 'accommodation';
  name: string;
  checkIn: Date;
  checkOut: Date;
  bookingReference?: string;
  address: string;
}

interface Activity extends BaseItem {
  type: 'activity';
  name: string;
  activityType: 'restaurant' | 'tour' | 'attraction' | 'other';
  time?: string;
}
```

### Component Structure

**Layout Components**
- `App.tsx`: Main application shell with header, view switcher, and routing
- `TripSelector`: Dropdown for switching between trips with create new trip option
- `Header`: Top navigation bar with branding and controls

**Trip Management**
- `TripForm`: Modal form for creating new trips
- `TripList`: Displays all user trips with delete options
- `TripProvider`: Context provider wrapping entire application

**Itinerary Forms**
- `ItemForm`: Parent component that switches between item type forms
- `FlightForm`: Specialized form for flight details
- `AccommodationForm`: Form for hotel/lodging information
- `ActivityForm`: Form for activities and events

**Map Components**
- `MapView`: Main Leaflet map container
- `ItemMarker`: Custom markers for each location
- `RoutePolyline`: Lines connecting destinations

**Timeline Components**
- `TimelineView`: Main timeline container with day grouping
- `DayCard`: Card for each day showing date and contained items
- `ItemCard`: Individual item display with edit/delete actions

**UI Components** (reusable)
- `Button`: Styled button with variants
- `Modal`: Overlay modal for forms
- `Card`: Container with consistent styling
- `Input`: Form input with label and error handling

### Utility Functions

**Date Helpers**
- `formatDate()`: Formats dates to "MMM d, yyyy"
- `formatDateTime()`: Full date and time formatting
- `formatTime()`: Time-only formatting
- `groupItemsByDay()`: Groups itinerary items by day
- `getTripDuration()`: Calculates number of days
- `isSameDay()`: Compares dates

**Geocoding**
- `geocodeAddress()`: Converts address string to lat/lng
- `reverseGeocode()`: Converts coordinates to address
- Uses OpenStreetMap Nominatim API (free, no key required)
- Rate limiting considerations
- Error handling for failed geocoding

**Itinerary Helpers**
- `sortItemsByDate()`: Chronological sorting
- `filterItemsByType()`: Filter by flight/hotel/activity
- `getItemsByDateRange()`: Items within date range
- `calculateTripBounds()`: Map bounds for all locations

**Storage**
- `saveTrips()`: Persist to localStorage
- `loadTrips()`: Retrieve and deserialize
- `clearStorage()`: Reset all data
- Date object serialization handling

### Form Validation

Using Zod schemas for runtime validation:

**Flight Schema**
- Required: origin, destination, departure date/time, arrival date/time
- Optional: airline, flight number, confirmation, notes
- Custom validation: arrival must be after departure
- Address validation before geocoding

**Accommodation Schema**
- Required: name, address, check-in, check-out
- Optional: booking reference, notes
- Custom validation: check-out must be after check-in
- Address must geocode successfully

**Activity Schema**
- Required: name, location, date, type
- Optional: time, notes
- Type must be one of predefined categories
- Location must be valid address

### Map Implementation

**Leaflet Configuration**
- OpenStreetMap tile layer for base map
- Custom marker icons for different item types
- Popup windows with item details
- Responsive map container
- Touch-friendly on mobile
- Zoom controls
- Scale indicator

**Marker System**
- Blue markers for flights (both origin and destination)
- Red markers for accommodations
- Green markers for activities
- Custom icons using Leaflet Icon class
- Click handlers opening info popups

**Route Visualization**
- Polyline connecting destinations in order
- Blue color with partial transparency
- Configurable line weight
- Smooth curves for flight paths (optional enhancement)
- Excludes accommodation markers from route

**Map Interaction**
- Pan and zoom with mouse/touch
- Click markers for details
- Auto-fit bounds to show all markers
- Recenter when items added/removed
- Responsive to window resize

### Timeline Implementation

**Day Grouping Algorithm**
1. Sort all items by start date
2. Group by calendar day (ignoring time)
3. Create Map with day string as key
4. Sort days chronologically
5. Render each day as card

**Within-Day Sorting**
- Items sorted by start time
- All-day items (accommodations) appear first
- Flights before activities at same time
- Stable sort maintains insertion order as tiebreaker

**Day Card Display**
- Header with day number and formatted date
- Border separating from other days
- Light background for visual grouping
- List of items with icons
- Compact view showing key details
- Expand for full details (optional)

### Error Handling

**Geocoding Failures**
- Alert user if address cannot be found
- Suggest correcting address format
- Fallback to manual coordinate entry (enhancement)
- Log errors for debugging

**Form Validation Errors**
- Inline error messages below fields
- Red border on invalid inputs
- Prevent submission until valid
- Clear errors on user input

**Storage Errors**
- Catch localStorage quota exceeded
- Warn user if storage full
- Graceful degradation without persistence

**Network Errors**
- Handle geocoding API failures
- Retry logic for transient failures
- Offline mode considerations

## User Experience Considerations

### Visual Design
- Clean, minimal interface focused on content
- Consistent spacing and typography
- Blue primary color for actions and highlights
- Gray neutrals for backgrounds and borders
- White cards on light gray background
- Clear visual hierarchy

### Responsive Design
- Mobile-first approach
- Map takes full width on small screens
- Forms adapted for touch input
- Stacked layouts on mobile
- Horizontal layouts on desktop
- Touch-friendly button sizes

### Performance
- Lazy load map tiles
- Debounce geocoding requests
- Memoize expensive calculations
- Virtual scrolling for long timelines (enhancement)
- Optimistic UI updates

### Accessibility
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast meeting WCAG standards
- Screen reader friendly

### Empty States
- Helpful message when no trips exist
- Clear call-to-action to create first trip
- Empty timeline with add item prompt
- Map shows default view when no items

### Loading States
- Spinner during geocoding
- Skeleton screens for map loading
- Button disabled states during submission
- Progress indicators for multi-step processes

### Confirmation Dialogs
- Confirm before deleting trips
- Confirm before deleting items
- Warning for destructive actions
- Cancel option always available

## Development Considerations

### TypeScript Usage
- Strict mode enabled
- No implicit any
- Proper typing for all functions
- Interface exports for shared types
- Type guards for discriminated unions
- Utility types for DRY code

### Code Organization
- Feature-based folder structure
- Shared types in dedicated folder
- Utility functions separated by concern
- One component per file
- Co-located styles (Tailwind)
- Index files for clean imports

### Best Practices
- Small, focused components
- Custom hooks for reusable logic
- Proper dependency arrays in useEffect
- Cleanup in useEffect returns
- Key props on mapped elements
- Controlled form inputs

### Git Workflow
- Meaningful commit messages
- Feature branches
- Regular commits showing progress
- Clean commit history
- Good README with setup instructions

## Future Enhancements

### Phase 2 Features
- Drag-and-drop reordering in timeline
- Budget tracking with currency conversion
- Weather forecasts for destinations
- Sharing trips via unique URL
- PDF export of itinerary
- Print-optimized view

### Phase 3 Features
- User authentication
- Cloud sync across devices
- Collaborative trip planning
- Comments and chat
- Email/SMS booking confirmations
- Integration with booking sites

### Advanced Features
- AI-powered itinerary suggestions
- Automatic booking extraction from emails
- Real-time flight tracking
- Photo uploads and galleries
- Travel journal entries
- Social features (following, likes)

## Testing Strategy

### Unit Tests
- Utility functions (date helpers, geocoding)
- State reducer logic
- Form validation schemas
- Component rendering

### Integration Tests
- Form submission flows
- Trip creation and management
- Item CRUD operations
- Map interaction

### End-to-End Tests
- Complete user journey
- Multi-device testing
- Browser compatibility
- Accessibility compliance

## Deployment

### Build Configuration
- Vite production build
- Environment variables for API keys
- Asset optimization
- Code splitting

### Hosting Options
- **Netlify**: Simple drag-and-drop deployment
- **Vercel**: Automatic GitHub deployments
- **GitHub Pages**: Free static hosting
- **AWS S3**: Scalable cloud hosting

### Performance Optimization
- Tree shaking unused code
- Lazy loading routes
- Image optimization
- Caching strategies
- CDN for static assets

## Documentation

### README Contents
- Project description
- Screenshot gallery
- Tech stack list
- Setup instructions
- Usage guide
- Deployment steps
- Contributing guidelines

### Code Documentation
- JSDoc comments on complex functions
- Inline comments for non-obvious logic
- Type documentation
- Component prop documentation

## Success Metrics

For portfolio/interview purposes, success is measured by:
- **Code Quality**: Clean, typed, well-organized code
- **Feature Completeness**: Core features fully functional
- **User Experience**: Intuitive, responsive interface
- **Product Thinking**: Demonstrates understanding of user needs
- **Technical Execution**: Proper use of React patterns and TypeScript
- **Polish**: Attention to detail in UI/UX
- **Documentation**: Clear README and code comments