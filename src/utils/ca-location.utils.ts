/**
 * CA Location Utilities
 * 
 * This file provides utilities for handling CA location data.
 * Since the profiles table doesn't currently have location fields,
 * we use mock data and provide migration suggestions.
 */

export interface CALocation {
  city: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PopularCity {
  city: string;
  state: string;
  count: number;
  caIds: string[];
}

/**
 * Mock location data for CAs
 * In production, this should come from the database
 */
export const MOCK_CA_LOCATIONS: CALocation[] = [
  { city: 'Mumbai', state: 'Maharashtra', country: 'India', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { city: 'Delhi', state: 'Delhi', country: 'India', coordinates: { lat: 28.7041, lng: 77.1025 } },
  { city: 'Bangalore', state: 'Karnataka', country: 'India', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India', coordinates: { lat: 13.0827, lng: 80.2707 } },
  { city: 'Kolkata', state: 'West Bengal', country: 'India', coordinates: { lat: 22.5726, lng: 88.3639 } },
  { city: 'Pune', state: 'Maharashtra', country: 'India', coordinates: { lat: 18.5204, lng: 73.8567 } },
  { city: 'Hyderabad', state: 'Telangana', country: 'India', coordinates: { lat: 17.3850, lng: 78.4867 } },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India', coordinates: { lat: 23.0225, lng: 72.5714 } },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India', coordinates: { lat: 26.9124, lng: 75.7873 } },
  { city: 'Surat', state: 'Gujarat', country: 'India', coordinates: { lat: 21.1702, lng: 72.8311 } },
  { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', coordinates: { lat: 26.8467, lng: 80.9462 } },
  { city: 'Kanpur', state: 'Uttar Pradesh', country: 'India', coordinates: { lat: 26.4499, lng: 80.3319 } },
  { city: 'Nagpur', state: 'Maharashtra', country: 'India', coordinates: { lat: 21.1458, lng: 79.0882 } },
  { city: 'Indore', state: 'Madhya Pradesh', country: 'India', coordinates: { lat: 22.7196, lng: 75.8577 } },
  { city: 'Thane', state: 'Maharashtra', country: 'India', coordinates: { lat: 19.2183, lng: 72.9781 } },
  { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', coordinates: { lat: 23.2599, lng: 77.4126 } },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', coordinates: { lat: 17.6868, lng: 83.2185 } },
  { city: 'Patna', state: 'Bihar', country: 'India', coordinates: { lat: 25.5941, lng: 85.1376 } },
  { city: 'Vadodara', state: 'Gujarat', country: 'India', coordinates: { lat: 22.3072, lng: 73.1812 } }
];

/**
 * Get a random location for a CA based on their ID
 */
export function getCALocation(caId: string): CALocation {
  // Use the CA ID to deterministically assign a location
  const hash = caId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % MOCK_CA_LOCATIONS.length;
  return MOCK_CA_LOCATIONS[index];
}

/**
 * Get popular cities with CA counts
 */
export function getPopularCities(): PopularCity[] {
  return [
    { city: 'Mumbai', state: 'Maharashtra', count: 45, caIds: [] },
    { city: 'Delhi', state: 'Delhi', count: 38, caIds: [] },
    { city: 'Bangalore', state: 'Karnataka', count: 32, caIds: [] },
    { city: 'Chennai', state: 'Tamil Nadu', count: 28, caIds: [] },
    { city: 'Kolkata', state: 'West Bengal', count: 25, caIds: [] },
    { city: 'Pune', state: 'Maharashtra', count: 22, caIds: [] },
    { city: 'Hyderabad', state: 'Telangana', count: 20, caIds: [] },
    { city: 'Ahmedabad', state: 'Gujarat', count: 18, caIds: [] }
  ];
}

/**
 * Search locations by query
 */
export function searchLocations(query: string): CALocation[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_CA_LOCATIONS.filter(location => 
    location.city.toLowerCase().includes(lowerQuery) ||
    location.state.toLowerCase().includes(lowerQuery) ||
    location.country.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get location by city and state
 */
export function getLocationByCityState(city: string, state: string): CALocation | null {
  return MOCK_CA_LOCATIONS.find(location => 
    location.city.toLowerCase() === city.toLowerCase() &&
    location.state.toLowerCase() === state.toLowerCase()
  ) || null;
}

/**
 * SQL Migration Script to add location fields to profiles table
 * 
 * Run this in your Supabase SQL editor to add location support:
 */
export const LOCATION_MIGRATION_SQL = `
-- Add location fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN location_city text,
ADD COLUMN location_state text,
ADD COLUMN location_country text DEFAULT 'India',
ADD COLUMN location_lat numeric,
ADD COLUMN location_lng numeric;

-- Create index for location-based queries
CREATE INDEX idx_profiles_location_city ON public.profiles(location_city);
CREATE INDEX idx_profiles_location_state ON public.profiles(location_state);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.location_city IS 'City where the CA is located';
COMMENT ON COLUMN public.profiles.location_state IS 'State where the CA is located';
COMMENT ON COLUMN public.profiles.location_country IS 'Country where the CA is located';
COMMENT ON COLUMN public.profiles.location_lat IS 'Latitude coordinate of CA location';
COMMENT ON COLUMN public.profiles.location_lng IS 'Longitude coordinate of CA location';
`;

/**
 * Function to update CA location in database
 * Use this after running the migration
 */
export async function updateCALocation(
  supabase: any,
  caId: string, 
  location: CALocation
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        location_city: location.city,
        location_state: location.state,
        location_country: location.country,
        location_lat: location.coordinates?.lat,
        location_lng: location.coordinates?.lng
      })
      .eq('user_id', caId)
      .eq('role', 'ca');

    if (error) {
      console.error('Error updating CA location:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating CA location:', error);
    return false;
  }
}

/**
 * Get CAs by location
 * Use this after running the migration
 */
export async function getCAsByLocation(
  supabase: any,
  city?: string,
  state?: string,
  limit: number = 10
): Promise<any[]> {
  try {
    let query = supabase
      .from('profiles')
      .select(`
        user_id,
        name,
        profile_picture,
        years_of_experience,
        about,
        is_verified,
        available_for_leads,
        location_city,
        location_state,
        location_country
      `)
      .eq('role', 'ca')
      .eq('is_verified', true)

    if (city) {
      query = query.eq('location_city', city);
    }

    if (state) {
      query = query.eq('location_state', state);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching CAs by location:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching CAs by location:', error);
    return [];
  }
} 