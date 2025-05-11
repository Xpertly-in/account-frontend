"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container.component";
import { SearchBar } from "@/components/features/search";
import { CACard } from "@/components/features/common";
import { supabase } from "@/lib/supabase";
import { CA } from "@/types/ca.type";

interface DatabaseProfile {
  id: string;
  name: string;
  profile_picture: string;
  about: string;
  years_of_experience: number;
  ca_address: {
    city: string;
    state: string;
  } | null;
  ca_social_profile: {
    areas_of_expertise: string;
  } | null;
}

export default function Search() {
  const [cas, setCAs] = useState<CA[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    fetchCAs();
  }, []);

  const fetchCAs = async (location?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('ca_profiles')
        .select(`
          id,
          name,
          profile_picture,
          about,
          years_of_experience,
          ca_address (
            city,
            state
          ),
          ca_social_profile (
            areas_of_expertise
          )
        `)
        .eq('onboarding_completed', true);

      if (location) {
        query = query.or(`ca_address.city.ilike.%${location}%,ca_address.state.ilike.%${location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match our CA interface
      const transformedData = (data as unknown as DatabaseProfile[]).map(ca => ({
        id: ca.id,
        name: ca.name,
        imageUrl: ca.profile_picture,
        location: `${ca.ca_address?.city || ''}, ${ca.ca_address?.state || ''}`.trim(),
        rating: 0, // Default rating
        reviews: 0, // Default reviews
        verified: true, // Assuming all completed profiles are verified
        specialization: ca.ca_social_profile?.areas_of_expertise?.split(',').map(s => s.trim()) || [],
        experience: ca.years_of_experience
      }));

      setCAs(transformedData);
    } catch (error) {
      console.error('Error fetching CAs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    fetchCAs(location);
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50/70 via-blue-50/30 to-background min-h-screen py-8 md:py-12 lg:py-16 dark:from-blue-900/40 dark:via-blue-800/20 dark:to-gray-900/80 overflow-hidden">
      {/* Decorative glowing elements for dark mode */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 dark:block hidden pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl opacity-60 -translate-x-1/2 dark:block hidden pointer-events-none"></div>

      <Container className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-white">
              Find a CA
            </h1>
            <p className="text-lg text-muted-foreground dark:text-blue-100/80 max-w-2xl">
              Connect with verified CAs in your area for all your financial needs
            </p>
          </div>

          <div className="w-full">
            <SearchBar onSearch={handleSearch} />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-b-transparent"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading results...</p>
            </div>
          ) : cas.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {cas.map(ca => (
                <CACard key={ca.id} ca={ca} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchLocation ? `No CAs found in ${searchLocation}` : 'Try searching for a location'}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
