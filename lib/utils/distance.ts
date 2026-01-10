/**
 * Calculate the distance between two geographical coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Server-side cache for geocoding results (in-memory, persists during server runtime)
// This makes repeated searches for the same location instant (0ms)
const geocodeCache = new Map<string, { lat: number; lon: number }>();

/**
 * Geocode a location string to latitude/longitude coordinates
 * Uses Geoapify Geocoding API for accurate worldwide coverage
 * Falls back to local cache for common Philippine locations
 */
export async function geocodeLocation(
  location: string,
): Promise<{ lat: number; lon: number } | null> {
  const normalizedLocation = location.toLowerCase().trim();

  // Check server-side cache first (fastest - instant hit)
  if (geocodeCache.has(normalizedLocation)) {
    return geocodeCache.get(normalizedLocation)!;
  }

  // Local cache for common Philippine locations (for faster lookup and reduced API calls)
  const knownLocations: Record<string, { lat: number; lon: number }> = {
    // Metro Manila
    manila: { lat: 14.5995, lon: 120.9842 },
    "manila city": { lat: 14.5995, lon: 120.9842 },
    "quezon city": { lat: 14.676, lon: 121.0437 },
    makati: { lat: 14.5547, lon: 121.0244 },
    "makati city": { lat: 14.5547, lon: 121.0244 },
    taguig: { lat: 14.5176, lon: 121.0509 },
    pasig: { lat: 14.5764, lon: 121.0851 },
    mandaluyong: { lat: 14.5794, lon: 121.0359 },

    // Cebu
    "cebu city": { lat: 10.3157, lon: 123.8854 },
    cebu: { lat: 10.3157, lon: 123.8854 },
    "mandaue city": { lat: 10.3237, lon: 123.9227 },
    mandaue: { lat: 10.3237, lon: 123.9227 },
    "lapu-lapu city": { lat: 10.3103, lon: 123.9494 },
    liloan: { lat: 10.3953, lon: 123.9922 },
    talisay: { lat: 10.2452, lon: 123.8492 },

    // Major Philippine Cities
    davao: { lat: 7.1907, lon: 125.4553 },
    "davao city": { lat: 7.1907, lon: 125.4553 },
    "baguio city": { lat: 16.4023, lon: 120.596 },
    baguio: { lat: 16.4023, lon: 120.596 },
    "iloilo city": { lat: 10.7202, lon: 122.5621 },
    iloilo: { lat: 10.7202, lon: 122.5621 },
    "bacolod city": { lat: 10.6767, lon: 122.95 },
    bacolod: { lat: 10.6767, lon: 122.95 },
    cagayan: { lat: 8.4542, lon: 124.6319 },
    "cagayan de oro": { lat: 8.4542, lon: 124.6319 },
  };

  // Try local cache first (instant response, no API call needed)
  if (knownLocations[normalizedLocation]) {
    return knownLocations[normalizedLocation];
  }

  // Try partial match in cache - prioritize longer/more specific matches
  const matchingKeys = Object.keys(knownLocations).filter(
    (key) => normalizedLocation.includes(key) || key.includes(normalizedLocation)
  );

  if (matchingKeys.length > 0) {
    // Sort by length (descending) to prioritize more specific matches
    // e.g., "liloan" (6 chars) should match before "cebu" (4 chars) in "liloan, cebu"
    matchingKeys.sort((a, b) => b.length - a.length);
    return knownLocations[matchingKeys[0]];
  }

  // Use Geoapify Geocoding API for accurate worldwide geocoding
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error("GEOAPIFY_API_KEY not configured in environment variables");
    return null;
  }

  try {
    // Geoapify Geocoding API with bias towards Philippines
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?` +
        `text=${encodeURIComponent(location)}&` +
        `filter=countrycode:ph&` + // Bias towards Philippines
        `limit=1&` +
        `apiKey=${apiKey}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        "Geoapify API error:",
        response.status,
        await response.text(),
      );
      return null;
    }

    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      const coords = { lat, lon };

      // Cache the result for future requests
      geocodeCache.set(normalizedLocation, coords);

      return coords;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  return null;
}

/**
 * Reverse geocode latitude/longitude coordinates to a human-readable address
 * Uses Geoapify Reverse Geocoding API
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error("NEXT_PUBLIC_GEOAPIFY_API_KEY not configured in environment variables");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?` +
        `lat=${lat}&lon=${lon}&` +
        `apiKey=${apiKey}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("Geoapify Reverse Geocode API error:", response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
      const props = data.features[0].properties;

      // Build location string: City, State format
      const parts: string[] = [];

      if (props.city) {
        parts.push(props.city);
      }

      if (props.state) {
        parts.push(props.state);
      }

      return parts.length > 0 ? parts.join(", ") : props.formatted || null;
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
  }

  return null;
}

/**
 * Get autocomplete suggestions for location input using Geoapify Autocomplete API
 * Provides fast, accurate location suggestions as the user types
 */
export async function getLocationSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error("GEOAPIFY_API_KEY not configured in environment variables");
    return [];
  }

  try {
    // Geoapify Autocomplete API with Philippines filter
    // Support all location types for precise location search
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?` +
        `text=${encodeURIComponent(query)}&` +
        `filter=countrycode:ph&` + // Only show Philippine locations
        `limit=10&` + // Increased limit for more precise results
        `apiKey=${apiKey}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Geoapify Autocomplete API error:", response.status, errorText);
      return [];
    }

    const data = await response.json();

    if (!data || !data.features || data.features.length === 0) {
      return [];
    }

    // Format results with detailed location hierarchy
    // Examples: "Barangay Lahug, Cebu City" or "IT Park, Cebu City" or "Osmena Boulevard, Cebu City"
    return data.features
      .map((feature: any) => {
        const props = feature.properties;

        // Build location string from most specific to general
        const parts: string[] = [];

        // Street or specific place name
        if (props.street || props.name) {
          parts.push(props.street || props.name);
        }

        // Suburb (often represents barangays in PH)
        if (props.suburb && props.suburb !== parts[0]) {
          parts.push(props.suburb);
        }

        // District
        if (props.district && !parts.includes(props.district)) {
          parts.push(props.district);
        }

        // City
        if (props.city && !parts.includes(props.city)) {
          parts.push(props.city);
        }

        // State/Province (for context)
        if (props.state && parts.length > 0) {
          // Only add if we have at least one other part
          parts.push(props.state);
        }

        // If no specific parts found, use formatted address
        if (parts.length === 0) {
          return props.formatted || props.address_line1 || "";
        }

        // Join parts with comma separator
        return parts.join(", ");
      })
      .filter((location: string) => location.length > 0)
      // Remove duplicates while preserving order
      .filter((location: string, index: number, self: string[]) => self.indexOf(location) === index);
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
}
