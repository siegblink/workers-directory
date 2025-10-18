# Category Autocomplete Query Example

## Database Query Function

The `autocompleteCategoriesByName()` function provides fast category lookups for autocomplete/dropdown functionality.

## Function Signature

```typescript
autocompleteCategoriesByName(
  searchText: string,
  limit?: number = 10
): Promise<ApiResponse<Category[]>>
```

## Usage Examples

### Example 1: Basic Autocomplete

```typescript
import { autocompleteCategoriesByName } from '@/lib/database'

// User types "plu"
const { data: categories, error } = await autocompleteCategoriesByName('plu', 10)

// Returns:
// [
//   { id: 1, name: 'Plumber', description: '...', created_at: '...' },
//   { id: 5, name: 'Plumbing Services', description: '...', created_at: '...' }
// ]
```

### Example 2: React Component with Autocomplete

```typescript
'use client'

import { useState, useEffect } from 'react'
import { autocompleteCategoriesByName } from '@/lib/database'
import type { Category } from '@/lib/database'

export function CategoryAutocomplete() {
  const [searchText, setSearchText] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      if (searchText.length === 0) {
        // Get initial list
        setLoading(true)
        const { data } = await autocompleteCategoriesByName('', 10)
        setCategories(data || [])
        setLoading(false)
        return
      }

      // Debounce search
      const timer = setTimeout(async () => {
        setLoading(true)
        const { data } = await autocompleteCategoriesByName(searchText, 10)
        setCategories(data || [])
        setLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    }

    fetchCategories()
  }, [searchText])

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search categories..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      {categories.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => {
                setSearchText(category.name || '')
                setCategories([])
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{category.name}</div>
              {category.description && (
                <div className="text-sm text-gray-600">{category.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-gray-300 rounded-full border-t-gray-600" />
        </div>
      )}
    </div>
  )
}
```

### Example 3: With shadcn/ui Command Component

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { autocompleteCategoriesByName } from '@/lib/database'
import type { Category } from '@/lib/database'

export function CategoryCommandSearch() {
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await autocompleteCategoriesByName(searchText, 10)
      setCategories(data || [])
    }

    const timer = setTimeout(fetchCategories, 300)
    return () => clearTimeout(timer)
  }, [searchText])

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search categories..."
        value={searchText}
        onValueChange={setSearchText}
      />
      <CommandList>
        <CommandEmpty>No categories found.</CommandEmpty>
        <CommandGroup heading="Categories">
          {categories.map((category) => (
            <CommandItem
              key={category.id}
              value={category.name || ''}
              onSelect={() => {
                setSelectedCategory(category)
                setSearchText(category.name || '')
              }}
            >
              <span>{category.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
```

### Example 4: Server-Side Usage (API Route)

```typescript
// app/api/categories/autocomplete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { autocompleteCategoriesByName } from '@/lib/database'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '10')

  const { data, error } = await autocompleteCategoriesByName(query, limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ categories: data })
}

// Client usage:
// const response = await fetch('/api/categories/autocomplete?q=plum&limit=5')
// const { categories } = await response.json()
```

### Example 5: Custom Hook for Autocomplete

```typescript
// hooks/use-category-autocomplete.ts
import { useState, useEffect } from 'react'
import { autocompleteCategoriesByName } from '@/lib/database'
import type { Category } from '@/lib/database'

export function useCategoryAutocomplete(searchText: string, limit: number = 10) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await autocompleteCategoriesByName(
          searchText,
          limit
        )

        if (isMounted) {
          if (fetchError) {
            setError(fetchError)
          } else {
            setCategories(data || [])
          }
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
          setLoading(false)
        }
      }
    }

    const timer = setTimeout(fetchCategories, 300)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchText, limit])

  return { categories, loading, error }
}

// Usage in component:
// const { categories, loading, error } = useCategoryAutocomplete(searchText)
```

### Example 6: Multi-Select with Autocomplete

```typescript
'use client'

import { useState } from 'react'
import { useCategoryAutocomplete } from '@/hooks/use-category-autocomplete'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { Category } from '@/lib/database'

export function CategoryMultiSelect() {
  const [searchText, setSearchText] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const { categories } = useCategoryAutocomplete(searchText)

  const addCategory = (category: Category) => {
    if (!selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category])
    }
    setSearchText('')
  }

  const removeCategory = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter(c => c.id !== categoryId))
  }

  return (
    <div className="space-y-2">
      {/* Selected Categories */}
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map((category) => (
          <Badge key={category.id} variant="secondary">
            {category.name}
            <button
              onClick={() => removeCategory(category.id)}
              className="ml-2 hover:text-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Add categories..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* Dropdown */}
        {searchText && categories.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {categories
              .filter(cat => !selectedCategories.find(sc => sc.id === cat.id))
              .map((category) => (
                <li
                  key={category.id}
                  onClick={() => addCategory(category)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {category.name}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```

## Query Behavior

1. **Empty Search**: Returns first 10 categories alphabetically
2. **With Search Text**: Returns categories where name contains the search text (case-insensitive)
3. **Always Sorted**: Results are always sorted alphabetically by name
4. **Limit**: Default limit is 10, can be customized

## Performance Tips

1. **Debouncing**: Always debounce user input (300ms recommended)
2. **Caching**: Consider caching results on the client side
3. **Limit**: Keep limit reasonable (5-15 items for good UX)
4. **Loading States**: Show loading indicators during fetch

## SQL Query Generated

```sql
-- Empty search
SELECT * FROM category
ORDER BY name ASC
LIMIT 10;

-- With search text "plum"
SELECT * FROM category
WHERE name ILIKE '%plum%'
ORDER BY name ASC
LIMIT 10;
```

## Response Format

```typescript
{
  data: Category[] | null,  // Array of matching categories
  error: Error | null,      // Error if query failed
  count?: number            // Optional count (not used in this query)
}

// Category interface:
interface Category {
  id: number
  name: string | null
  description: string | null
  created_at: string
}
```

## Error Handling

```typescript
const { data, error } = await autocompleteCategoriesByName('plumber')

if (error) {
  console.error('Failed to fetch categories:', error)
  // Show error message to user
  return
}

// Use data safely
const categories = data || []
```

## Integration with Search Filters

```typescript
import { searchWorkers, autocompleteCategoriesByName } from '@/lib/database'

// User selects category from autocomplete
const handleCategorySelect = async (category: Category) => {
  // Use the category ID to filter workers
  const { data: workers } = await searchWorkers({
    category_id: category.id,
    is_available: true,
    min_rating: 4.0
  })

  // Display filtered workers
}
```

---

**Related Files:**
- [queries/categories.ts](./queries/categories.ts) - Category query functions
- [FILTERS.md](./FILTERS.md) - Complete filter documentation
- [types.ts](./types.ts) - Type definitions
