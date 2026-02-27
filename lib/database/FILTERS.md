# Advanced Worker Search & Filter Documentation

The `searchWorkers()` function now supports advanced filtering by:

- Location (text search and radius-based)
- Category (single or multiple)
- Price range (hourly rate)
- Availability (status and schedule)
- Rating (min/max)
- Skills and general search

## Database Schema Changes

### Worker Table Fields Added

```typescript
interface Worker {
  // ... existing fields
  hourly_rate: number | null; // Hourly rate in base currency
  location: string | null; // City/area name
  latitude: number | null; // GPS coordinate for radius search
  longitude: number | null; // GPS coordinate for radius search
  availability_schedule: Json | null; // Weekly schedule object
  is_available: boolean | null; // Current availability status
}
```

### Availability Schedule Format

The `availability_schedule` field stores a JSON object with the following structure:

```json
{
  "monday": { "available": true, "hours": "9am-5pm" },
  "tuesday": { "available": true, "hours": "9am-5pm" },
  "wednesday": { "available": false },
  "thursday": { "available": true, "hours": "10am-6pm" },
  "friday": { "available": true, "hours": "9am-5pm" },
  "saturday": { "available": true, "hours": "10am-2pm" },
  "sunday": { "available": false }
}
```

## Filter Options

### WorkerFilters Interface

```typescript
interface WorkerFilters extends PaginationOptions {
  // Category filters
  category_id?: number; // Single category ID
  category_ids?: number[]; // Multiple category IDs (OR condition)

  // Status & availability
  status?: WorkerStatus; // 'available' | 'busy' | 'unavailable'
  is_available?: boolean; // Current availability flag

  // Skills & search
  skills?: string; // Search in skills field
  search?: string; // Full-text search (name, skills, location)

  // Rating filters
  min_rating?: number; // Minimum average rating (0-5)
  max_rating?: number; // Maximum average rating (0-5)

  // Price range filters
  min_hourly_rate?: number; // Minimum hourly rate
  max_hourly_rate?: number; // Maximum hourly rate

  // Location filters
  location?: string; // City/area name search
  latitude?: number; // For radius-based search
  longitude?: number; // For radius-based search
  radius?: number; // Search radius in kilometers

  // Availability filters
  available_on?: string; // ISO date string (future feature)
  available_days?: string[]; // ['monday', 'tuesday', ...]
  available_time?: string; // 'morning', 'afternoon', 'evening' (future)

  // Pagination & sorting
  page?: number;
  limit?: number;
  sort?: SortOptions;
}
```

## Usage Examples

### Example 1: Search by Location and Price Range

```typescript
import { searchWorkers } from "@/lib/database";

const { data: workers } = await searchWorkers({
  location: "New York",
  min_hourly_rate: 50,
  max_hourly_rate: 150,
  page: 1,
  limit: 20,
});
```

### Example 2: Radius-Based Location Search

```typescript
// Find workers within 10km of coordinates
const { data: workers } = await searchWorkers({
  latitude: 40.7128, // NYC coordinates
  longitude: -74.006,
  radius: 10, // 10 kilometers
  min_rating: 4.0,
});
```

### Example 3: Category and Rating Filter

```typescript
// Find top-rated plumbers and electricians
const { data: workers } = await searchWorkers({
  category_ids: [1, 2], // Plumber & Electrician category IDs
  min_rating: 4.5,
  is_available: true,
  sort: { column: "created_at", ascending: false },
});
```

### Example 4: Availability by Day

```typescript
// Find workers available on weekends
const { data: workers } = await searchWorkers({
  available_days: ["saturday", "sunday"],
  location: "Los Angeles",
  status: "available",
});
```

### Example 5: Full-Text Search with Filters

```typescript
// Search for "plumber" with price filter
const { data: workers } = await searchWorkers({
  search: "plumber", // Searches name, skills, location
  max_hourly_rate: 100,
  is_available: true,
  page: 1,
  limit: 10,
});
```

### Example 6: Combined Advanced Filters

```typescript
// Complex search: skilled workers nearby with good ratings
const { data: workers } = await searchWorkers({
  search: "certified",
  latitude: 34.0522,
  longitude: -118.2437,
  radius: 15,
  min_rating: 4.0,
  min_hourly_rate: 30,
  max_hourly_rate: 80,
  is_available: true,
  available_days: ["monday", "wednesday", "friday"],
  sort: { column: "created_at", ascending: false },
});
```

## Category Queries

New category management functions are available in `queries/categories.ts`:

### Get All Categories

```typescript
import { getAllCategories } from "@/lib/database";

const { data: categories } = await getAllCategories();
```

### Get Categories with Worker Count

```typescript
import { getCategoriesWithWorkerCount } from "@/lib/database";

const { data: categories } = await getCategoriesWithWorkerCount();
// Returns: [{ id: 1, name: 'Plumber', worker_count: 45 }, ...]
```

### Get Popular Categories

```typescript
import { getPopularCategories } from "@/lib/database";

const { data: popular } = await getPopularCategories(5); // Top 5
// Returns categories sorted by booking count
```

### Search Categories

```typescript
import { searchCategories } from "@/lib/database";

const { data: categories } = await searchCategories({
  search: "electric",
  page: 1,
  limit: 10,
});
```

### Manage Worker Categories

```typescript
import {
  getWorkerCategories,
  addWorkerCategory,
  removeWorkerCategory,
  updateWorkerCategories,
} from "@/lib/database";

// Get categories for a worker
const { data: categories } = await getWorkerCategories(workerId);

// Add a category
await addWorkerCategory(workerId, categoryId);

// Remove a category
await removeWorkerCategory(workerId, categoryId);

// Replace all categories
await updateWorkerCategories(workerId, [1, 2, 3]);
```

## Filter Implementation Details

### SQL-Based Filters (Applied at Database Level)

- `status` - Worker status
- `is_available` - Availability flag
- `skills` - Skills text search
- `min_hourly_rate` / `max_hourly_rate` - Price range
- `location` - Location text search
- `search` - Full-text search across multiple fields

### Post-Query Filters (Applied in Application)

- `category_id` / `category_ids` - Category filtering
- `min_rating` / `max_rating` - Rating range
- `latitude` / `longitude` / `radius` - Geolocation filtering
- `available_days` - Weekly schedule filtering

Post-query filters are applied after fetching from the database because they require:

1. Computed values (ratings are calculated from related tables)
2. Complex joins (categories are in a separate many-to-many table)
3. Geographic calculations (Haversine formula for distance)
4. JSON parsing (availability schedule)

## Distance Calculation

The radius-based location search uses the Haversine formula to calculate distances:

```typescript
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  // ... Haversine calculation
  return distance;
}
```

Results are in kilometers. To convert to miles, multiply by 0.621371.

## Pagination

All search results support pagination:

```typescript
const result = await searchWorkers({
  // ... filters
  page: 2, // Page number (starts at 1)
  limit: 20, // Results per page
});

console.log(result.pagination);
// {
//   page: 2,
//   limit: 20,
//   total: 150,
//   total_pages: 8
// }
```

## Sorting

Sort results by any worker field:

```typescript
const { data: workers } = await searchWorkers({
  sort: {
    column: "hourly_rate",
    ascending: true,
  },
});

// Common sort options:
// - 'created_at' (newest/oldest)
// - 'hourly_rate' (price low to high)
// - 'status' (by availability)
```

Note: Computed fields like `average_rating` need to be sorted post-query.

## Performance Considerations

1. **SQL-Level Filtering**: Always prefer filters that can be applied at the database level for better performance

2. **Post-Query Filtering**: Rating and category filters require fetching full details for each worker, which can be slow for large result sets. Use `limit` to control this.

3. **Radius Search**: Geographic distance calculations are performed in-memory after the database query. For large datasets, consider using PostGIS or similar database extensions.

4. **Caching**: Consider caching category lists and popular workers since they don't change frequently.

## Migration Notes

To add the new fields to your Supabase database, run these SQL migrations:

```sql
-- Add new columns to workers table
ALTER TABLE workers
ADD COLUMN hourly_rate DECIMAL(10, 2),
ADD COLUMN location TEXT,
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN availability_schedule JSONB,
ADD COLUMN is_available BOOLEAN DEFAULT true;

-- Add indexes for better query performance
CREATE INDEX idx_workers_location ON workers(location);
CREATE INDEX idx_workers_hourly_rate ON workers(hourly_rate);
CREATE INDEX idx_workers_is_available ON workers(is_available);
CREATE INDEX idx_workers_coordinates ON workers(latitude, longitude);
```

## Future Enhancements

Potential improvements to consider:

1. **Time-Based Availability**: Filter by specific time slots
2. **Date-Specific Availability**: Check availability on specific dates
3. **PostGIS Integration**: Use database-level geographic queries
4. **Full-Text Search**: PostgreSQL full-text search for better search results
5. **Saved Searches**: Allow users to save filter combinations
6. **Search History**: Track popular search queries
7. **Smart Filters**: Suggest filters based on user behavior
8. **Price Estimates**: Calculate estimated costs based on job type

## API Response Format

```typescript
type SearchResult = PaginatedResponse<WorkerWithDetails>;

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  error: Error | null;
}

interface WorkerWithDetails extends Worker {
  user?: User;
  categories?: Category[];
  ratings?: Rating[];
  average_rating?: number;
  total_bookings?: number;
}
```

## Error Handling

All query functions return an error object if something goes wrong:

```typescript
const { data, error } = await searchWorkers(filters);

if (error) {
  console.error("Search failed:", error);
  // Handle error appropriately
}
```

## Testing

Example test cases to implement:

1. Search with no filters (should return all workers)
2. Price range filter (min and max)
3. Location radius search
4. Multiple category filter
5. Rating range filter
6. Combined filters
7. Pagination boundaries
8. Invalid coordinates handling
9. Empty result sets

---

For more information, see:

- [lib/database/types.ts](./types.ts) - Type definitions
- [lib/database/queries/workers.ts](./queries/workers.ts) - Worker queries
- [lib/database/queries/categories.ts](./queries/categories.ts) - Category queries
- [lib/database/base-query.ts](./base-query.ts) - Base query utilities
