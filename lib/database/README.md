# Database Query Utilities

Reusable, type-safe database query utilities for the Direktory platform.

## Features

✅ **Type-Safe** - Full TypeScript support with auto-completion
✅ **Error Handling** - Consistent error handling across all queries
✅ **Pagination** - Built-in pagination support
✅ **Realtime** - Supabase realtime subscriptions
✅ **Auth Integration** - Automatic user ID from Supabase Auth
✅ **Reusable** - DRY principles with base utilities

## Installation

The utilities are already set up in `lib/database/`. Just import and use!

## Quick Start

### Basic Usage

```typescript
import { getCurrentUser, getWorkerById, createBooking } from "@/lib/database";

// Get current user
const { data: user, error } = await getCurrentUser();

// Get worker details
const { data: worker } = await getWorkerById(123);

// Create booking
const { data: booking } = await createBooking({
  customer_id: user.id,
  worker_id: 123,
  category_id: 1,
  description: "Fix kitchen sink",
});
```

### With React

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/database'
import type { User } from '@/lib/database'

export function ProfileComponent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await getCurrentUser()
      if (data) setUser(data)
      setLoading(false)
    }
    loadUser()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <h1>{user.firstname} {user.lastname}</h1>
      <p>{user.bio}</p>
    </div>
  )
}
```

## API Reference

### User Queries

```typescript
// Get user by ID
const { data } = await getUserById(123);

// Get current authenticated user
const { data } = await getCurrentUser();

// Update current user
const { data } = await updateCurrentUser({
  firstname: "John",
  lastname: "Doe",
});

// Search users
const { data, pagination } = await searchUsers("john", {
  page: 1,
  limit: 10,
});

// Get online users
const { data } = await getOnlineUsers();

// Update online status
const { data } = await updateOnlineStatus(123, true);
```

### Worker Queries

```typescript
// Get worker by ID
const { data } = await getWorkerById(123);

// Get worker with full details (categories, ratings, stats)
const { data } = await getWorkerWithDetails(123);

// Search workers
const { data, pagination } = await searchWorkers({
  category_id: 1,
  status: "available",
  min_rating: 4.0,
  search: "plumber",
  page: 1,
  limit: 10,
});

// Get workers by category
const { data } = await getWorkersByCategory(1, {
  status: "available",
  page: 1,
});

// Get top rated workers
const { data } = await getTopRatedWorkers(10);

// Check if user is a worker
const isWorker = await isUserAWorker(123);

// Update worker status
const { data } = await updateWorkerStatus(123, "busy");
```

### Booking Queries

```typescript
// Get booking by ID
const { data } = await getBookingById(123);

// Get my bookings
const { data, pagination } = await getMyBookings({
  status: "pending",
  page: 1,
  limit: 10,
});

// Get bookings as worker
const { data } = await getWorkerBookings(123, {
  status: ["pending", "accepted"],
});

// Create booking
const { data } = await createBooking({
  customer_id: 1,
  worker_id: 2,
  category_id: 3,
  description: "Fix sink",
});

// Accept booking
const { data } = await acceptBooking(123);

// Complete booking
const { data } = await completeBooking(123);

// Cancel booking
const { data } = await cancelBooking(123);

// Get booking statistics
const { data } = await getWorkerBookingStats(123);

// Check if booking can be rated
const canRate = await canRateBooking(123);
```

### Message Queries

```typescript
// Get my chats
const { data } = await getMyChats()

// Get chat by ID
const { data } = await getChatById(123)

// Get or create chat
const { data } = await getOrCreateChat(
  bookingId: 1,
  customerId: 2,
  workerId: 3
)

// Get chat messages
const { data, pagination } = await getChatMessages(123, {
  page: 1,
  limit: 50
})

// Send message
const { data } = await sendMessage(
  chatId: 123,
  senderId: 1,
  receiverId: 2,
  'Hello!'
)

// Mark message as read
const { data } = await markMessageAsRead(123)

// Mark all chat messages as read
const { data } = await markChatAsRead(123)

// Get unread count
const count = await getUnreadMessageCount()

// Subscribe to chat (realtime)
const unsubscribe = subscribeToChat(123, (message) => {
  console.log('New message:', message)
})

// Clean up subscription
unsubscribe()
```

### Favorite Queries

```typescript
// Get my favorites
const { data, pagination } = await getMyFavorites({
  page: 1,
  limit: 10,
});

// Add to favorites
const { data } = await addFavorite(123);

// Remove from favorites
const { data } = await removeFavorite(123);

// Check if favorited
const isFav = await isFavorite(123);

// Toggle favorite
const { data } = await toggleFavorite(123);
```

## Response Types

All queries return a consistent response structure:

```typescript
// Single item response
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

// Paginated response
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
```

## Error Handling

```typescript
const { data, error } = await getUserById(123);

if (error) {
  console.error("Error:", error.message);
  // Handle error
  return;
}

// Use data safely
console.log(data.firstname);
```

## Pagination

```typescript
const { data, pagination } = await searchWorkers({
  page: 1,
  limit: 10,
});

console.log("Total results:", pagination.total);
console.log("Total pages:", pagination.total_pages);
console.log("Current page:", pagination.page);
```

## Sorting

```typescript
const { data } = await searchWorkers({
  sort: {
    column: "created_at",
    ascending: false, // descending
  },
});
```

## Realtime Subscriptions

```typescript
// Subscribe to chat messages
useEffect(() => {
  const unsubscribe = subscribeToChat(chatId, (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  return () => unsubscribe(); // Cleanup
}, [chatId]);
```

## Custom React Hooks

Create reusable hooks for common patterns:

```typescript
// hooks/useCurrentUser.ts
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/database";
import type { User } from "@/lib/database";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await getCurrentUser();
      setUser(data);
      setError(error);
      setLoading(false);
    }
    load();
  }, []);

  return { user, loading, error };
}

// Usage
const { user, loading, error } = useCurrentUser();
```

## Best Practices

1. **Always check for errors**

   ```typescript
   const { data, error } = await getWorkerById(id);
   if (error) {
     // Handle error
     return;
   }
   // Use data safely
   ```

2. **Use pagination for large datasets**

   ```typescript
   const { data, pagination } = await searchWorkers({ limit: 20 });
   ```

3. **Clean up subscriptions**

   ```typescript
   useEffect(() => {
     const unsubscribe = subscribeToChat(id, callback);
     return () => unsubscribe();
   }, [id]);
   ```

4. **Handle loading states**

   ```typescript
   const [loading, setLoading] = useState(true);
   // ... fetch data
   setLoading(false);
   ```

5. **Use TypeScript types**
   ```typescript
   import type { User, Worker, Booking } from "@/lib/database";
   ```

## File Structure

```
lib/database/
├── index.ts          # Main exports
├── types.ts          # TypeScript types
├── base-query.ts     # Base utilities
├── queries/
│   ├── users.ts      # User queries
│   ├── workers.ts    # Worker queries
│   ├── bookings.ts   # Booking queries
│   ├── messages.ts   # Message queries
│   └── favorites.ts  # Favorite queries
└── README.md         # This file
```

## Adding New Queries

1. Add types to `types.ts`
2. Create query file in `queries/`
3. Export from `index.ts`
4. Document in this README

## Support

For issues or questions, check:

- Type definitions in `types.ts`
- Base utilities in `base-query.ts`
- Example usage in this README
