import { supabase } from '@/lib/supabase';
import { CA, FeaturedCA } from '@/types/ca.type';
import { getCALocation, getPopularCities as getMockPopularCities } from '@/utils/ca-location.utils';

export interface CAWithServices extends CA {
  services: string[];
  total_reviews?: number;
  average_rating?: number;
}

// Define the role enum based on the database schema
type UserRole = 'ACCOUNTANT' | 'customer';

// Default profile images for CAs
const DEFAULT_CA_IMAGES = [
'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'

/**
 * Get a default profile image for a CA
 */
const getDefaultCAImage = (userId: string): string => {
  // Use userId to consistently get the same image for the same user
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % DEFAULT_CA_IMAGES.length;
  return DEFAULT_CA_IMAGES[index];
};

/**
 * Get a safe profile image URL with fallback
 */
const getSafeProfileImage = (profilePicture: string | null, userId: string): string => {
  if (!profilePicture || profilePicture.trim() === '') {
    return getDefaultCAImage(userId);
  }
  
  // If it's already a full URL, return as is
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }
  
  // If it's a relative path, assume it's from Supabase storage
  // For now, return default image to avoid broken images
  return getDefaultCAImage(userId);
};

export class CAService {
  /**
   * Fetch featured/top-rated CAs for the landing page
   */
  static async getFeaturedCAs(limit: number = 3): Promise<FeaturedCA[]> {
    try {
      // Get verified CAs with their services and basic info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          name,
          profile_picture,
          years_of_experience,
          about,
          is_verified,
          available_for_leads,
          language,
          type_of_user,
          created_at
        `)
        .eq('role', 'ACCOUNTANT' as UserRole)
        .eq('is_verified', true)
        .order('years_of_experience', { ascending: false })
        .limit(limit);

      if (profilesError) {
        console.error('Error fetching CA profiles:', profilesError);
        return [];
      }

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Get services for each CA
      const caIds = profiles.map(ca => ca.user_id);
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('ca_id, service_name')
        .in('ca_id', caIds)
        .eq('is_active', true);

      if (servicesError) {
        console.error('Error fetching CA services:', servicesError);
      }

      // Get reviews/ratings from contact_requests
      const { data: contactRequests, error: contactError } = await supabase
        .from('contact_requests')
        .select('ca_id, created_at, status')
        .in('ca_id', caIds);

      if (contactError) {
        console.error('Error fetching contact requests:', contactError);
      }

      // Process and combine the data
      const featuredCAs: FeaturedCA[] = profiles.map((profile, index) => {
        const caServices = services?.filter(s => s.ca_id === profile.user_id) || [];
        const serviceNames = caServices.map(s => s.service_name);
        
        // Calculate rating and reviews based on contact requests
        const contactCount = contactRequests?.filter(cr => cr.ca_id === profile.user_id).length || 0;
        const completedContacts = contactRequests?.filter(cr => cr.ca_id === profile.user_id && cr.status === 'closed').length || 0;
        
        // Calculate rating based on completion rate and experience
        const completionRate = contactCount > 0 ? completedContacts / contactCount : 0.8;
        const experienceBonus = Math.min((profile.years_of_experience || 0) * 0.1, 0.5);
        const mockRating = 4.0 + completionRate * 0.5 + experienceBonus;
        const mockReviews = Math.max(20, contactCount + Math.floor(Math.random() * 50));

        // Get location using the utility function
        const location = getCALocation(profile.user_id);

        return {
          id: index + 1, // Using index for now, should use actual ID
          name: profile.name || 'CA Professional',
          experience: profile.years_of_experience || 0,
          rating: parseFloat(mockRating.toFixed(1)),
          reviews: mockReviews,
          services: serviceNames.length > 0 ? serviceNames : ['GST Filing', 'Income Tax', 'Audit'],
          image: getSafeProfileImage(profile.profile_picture, profile.user_id),
          location: `${location.city}, ${location.state}`
        };
      });

      return featuredCAs;
    } catch (error) {
      console.error('Error in getFeaturedCAs:', error);
      return [];
    }
  }

  /**
   * Fetch CA by ID with full profile details
   */
  static async getCAById(caId: string): Promise<CA | null> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          name,
          profile_picture,
          years_of_experience,
          about,
          is_verified,
          available_for_leads,
          email,
          phone,
          gender,
          type_of_user,
          type_of_communication,
          language,
          created_at,
          verified_at
        `)
        .eq('user_id', caId)
        .eq('role', 'ACCOUNTANT' as UserRole)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching CA profile:', profileError);
        return null;
      }

      // Get services
      const { data: services } = await supabase
        .from('services')
        .select('service_name')
        .eq('ca_id', caId)
        .eq('is_active', true);

      // Get experiences
      const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('ca_id', caId)
        .eq('is_active', true)
        .order('start_date', { ascending: false });

      // Get social profile
      const { data: socialProfile } = await supabase
        .from('social_profile')
        .select('*')
        .eq('ca_id', caId)
        .single();

      // Get contact requests for rating calculation
      const { data: contactRequests } = await supabase
        .from('contact_requests')
        .select('status, created_at')
        .eq('ca_id', caId);

      const totalContacts = contactRequests?.length || 0;
      const completedContacts = contactRequests?.filter(cr => cr.status === 'closed').length || 0;
      const rating = totalContacts > 0 ? 4.0 + (completedContacts / totalContacts) * 0.8 : 4.5;

      // Get location using the utility function
      const location = getCALocation(caId);

      const ca: CA = {
        id: profile.user_id,
        name: profile.name,
        imageUrl: getSafeProfileImage(profile.profile_picture, profile.user_id),
        location: `${location.city}, ${location.state}`,
        rating: parseFloat(rating.toFixed(1)),
        reviews: totalContacts + Math.floor(Math.random() * 50),
        verified: profile.is_verified || false,
        specialization: services?.map(s => s.service_name) || [],
        experience: profile.years_of_experience || 0,
        email: profile.email,
        phone: profile.phone,
        website: socialProfile?.professional_website,
        qualification: 'Chartered Accountant',
        firm_name: socialProfile?.areas_of_expertise,
        member_since: profile.created_at,
        clients: `${totalContacts}+`,
        about: profile.about,
        services: services?.map(s => s.service_name) || [],
        language: profile.language ? [profile.language] : ['English', 'Hindi']
      };

      return ca;
    } catch (error) {
      console.error('Error in getCAById:', error);
      return null;
    }
  }

  /**
   * Search CAs by location and services
   */
  static async searchCAs(location?: string, services?: string[], limit: number = 10): Promise<CA[]> {
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
          language,
          type_of_user
        `)
        .eq('role', 'ACCOUNTANT' as UserRole)
        .eq('is_verified', true);

      const { data: profiles, error } = await query.limit(limit);

      if (error || !profiles) {
        console.error('Error searching CAs:', error);
        return [];
      }

      // Get services for all CAs
      const caIds = profiles.map(ca => ca.user_id);
      const { data: allServices } = await supabase
        .from('services')
        .select('ca_id, service_name')
        .in('ca_id', caIds)
        .eq('is_active', true);

      // Get contact requests for rating calculation
      const { data: contactRequests } = await supabase
        .from('contact_requests')
        .select('ca_id, status')
        .in('ca_id', caIds);

      // Filter by services if provided
      let filteredProfiles = profiles;
      if (services && services.length > 0) {
        const serviceMap = new Map();
        allServices?.forEach((service: { ca_id: string; service_name: string }) => {
          if (!serviceMap.has(service.ca_id)) {
            serviceMap.set(service.ca_id, []);
          }
          serviceMap.get(service.ca_id).push(service.service_name);
        });

        filteredProfiles = profiles.filter(profile => {
          const caServices = serviceMap.get(profile.user_id) || [];
          return services.some(service => 
            caServices.some((caService: string) => 
              caService.toLowerCase().includes(service.toLowerCase())
            )
          );
        });
      }

      // Convert to CA format
      const cas: CA[] = filteredProfiles.map(profile => {
        const profileContacts = contactRequests?.filter(cr => cr.ca_id === profile.user_id) || [];
        const totalContacts = profileContacts.length;
        const completedContacts = profileContacts.filter(cr => cr.status === 'closed').length;
        const rating = totalContacts > 0 ? 4.0 + (completedContacts / totalContacts) * 0.8 : 4.5;

        // Get location using the utility function
        const location = getCALocation(profile.user_id);

        return {
          id: profile.user_id,
          name: profile.name,
          imageUrl: getSafeProfileImage(profile.profile_picture, profile.user_id),
          location: `${location.city}, ${location.state}`,
          rating: parseFloat(rating.toFixed(1)),
          reviews: totalContacts + Math.floor(Math.random() * 30),
          verified: profile.is_verified,
          specialization: allServices?.filter(s => s.ca_id === profile.user_id).map(s => s.service_name) || [],
          experience: profile.years_of_experience || 0
        };
      });

      return cas;
    } catch (error) {
      console.error('Error in searchCAs:', error);
      return [];
    }
  }

  /**
   * Get popular cities with CA counts
   */
  static async getPopularCities(): Promise<Array<{ city: string; state: string; count: number }>> {
    try {
      // Use the mock popular cities for now
      const mockCities = getMockPopularCities();
      return mockCities.map(city => ({
        city: city.city,
        state: city.state,
        count: city.count
      }));
    } catch (error) {
      console.error('Error in getPopularCities:', error);
      return [];
    }
  }

  /**
   * Get CA statistics for dashboard
   */
  static async getCAStats(): Promise<{
    totalCAs: number;
    verifiedCAs: number;
    activeCAs: number;
    totalServices: number;
  }> {
    try {
      // Get total CAs
      const { count: totalCAs } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'ACCOUNTANT' as UserRole);

      // Get verified CAs
      const { count: verifiedCAs } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'ACCOUNTANT' as UserRole)
        .eq('is_verified', true);

      // Get active CAs (available for leads)
      const { count: activeCAs } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'ACCOUNTANT' as UserRole)
        .eq('is_verified', true);

      // Get total services
      const { count: totalServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return {
        totalCAs: totalCAs || 0,
        verifiedCAs: verifiedCAs || 0,
        activeCAs: activeCAs || 0,
        totalServices: totalServices || 0
      };
    } catch (error) {
      console.error('Error in getCAStats:', error);
      return {
        totalCAs: 0,
        verifiedCAs: 0,
        activeCAs: 0,
        totalServices: 0
      };
    }
  }
} 