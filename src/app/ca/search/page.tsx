"use client";

import { useState, useEffect } from "react";
import { Input } from "@/ui/Input.ui";
import { CACard } from "@/components/features/search/CACard.component";
import { supabase } from "@/lib/supabase";
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";

interface CAProfile {
  id: string;
  name: string;
  profile_picture: string;
  about: string;
  years_of_experience: number;
  city: string;
  state: string;
  areas_of_expertise: string;
  rating?: number;
}

interface DatabaseProfile {
  id: string;
  name: string;
  profile_picture: string;
  about: string;
  years_of_experience: number;
  address: {
    city: string;
    state: string;
  } | null;
  social_profile: {
    areas_of_expertise: string;
  } | null;
}

export default function CASearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [expertise, setExpertise] = useState("");
  const [cas, setCAs] = useState<CAProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCAs();
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, location, expertise]);

  const fetchCAs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          profile_picture,
          about,
          years_of_experience,
          address (
            city,
            state
          ),
          social_profile (
            areas_of_expertise
          )
        `)
        .eq('onboarding_completed', true);

      // Apply filters
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (location) {
        query = query.or(`(address.city.ilike.%${location}%,address.state.ilike.%${location}%)`);
      }

      if (expertise) {
        query = query.ilike('social_profile.areas_of_expertise', `%${expertise}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match our CAProfile interface
      const transformedData = (data as unknown as DatabaseProfile[]).map(ca => ({
        id: ca.id,
        name: ca.name,
        profile_picture: ca.profile_picture,
        about: ca.about,
        years_of_experience: ca.years_of_experience,
        city: ca.address?.city || '',
        state: ca.address?.state || '',
        areas_of_expertise: ca.social_profile?.areas_of_expertise || '',
      }));

      setCAs(transformedData);
    } catch (error) {
      console.error('Error fetching CAs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Find a CA Professional</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search for qualified Chartered Accountants in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MagnifyingGlass size={20} className="text-muted-foreground" />
            </div>
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FunnelSimple size={20} className="text-muted-foreground" />
            </div>
            <Input
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FunnelSimple size={20} className="text-muted-foreground" />
            </div>
            <Input
              placeholder="Area of expertise..."
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-b-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading results...</p>
          </div>
        ) : cas.length > 0 ? (
          cas.map((ca) => (
            <CACard key={ca.id} ca={ca} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 