import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/auth.type";
import CAProfileDetails from "@/components/features/profile/CAProfileDetails.component";

// Required for static export
export async function generateStaticParams() {
  // Return an empty array to indicate no static paths
  // This will make the page dynamic at runtime
  return [];
}

// Use ISR with a 1 hour revalidation
export const revalidate = 3600;

// Enable fallback for non-generated paths
export const dynamicParams = true;

export default async function CAProfile({ params }: { params: { id: string } }) {
  try {
    // Validate the ID parameter
    if (!params.id || typeof params.id !== "string") {
      console.error("Invalid CA ID:", params.id);
      notFound();
    }

    // Fetch CA profile data with proper error handling
    const { data: caProfile, error: caError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", params.id)
      .eq("role", UserRole.ACCOUNTANT)
      .eq("onboarding_completed", true)
      .single();

    if (caError) {
      console.error("Error fetching CA profile:", caError);
      notFound();
    }

    if (!caProfile) {
      console.error("CA profile not found for ID:", params.id);
      notFound();
    }

    // Fetch related data with proper error handling
    const [
      addressResult,
      socialProfileResult,
      servicesResult,
      experiencesResult,
      educationsResult,
    ] = await Promise.all([
      supabase.from("address").select("*").eq("ca_id", params.id).single(),
      supabase.from("social_profile").select("*").eq("ca_id", params.id).single(),
      supabase.from("services").select("*").eq("ca_id", params.id).eq("is_active", true),
      supabase
        .from("experiences")
        .select("*")
        .eq("ca_id", params.id)
        .eq("is_active", true)
        .order("start_date", { ascending: false }),
      supabase
        .from("educations")
        .select("*")
        .eq("ca_id", params.id)
        .eq("is_active", true)
        .order("start_date", { ascending: false }),
    ]);

    // Handle any errors from related data fetches
    if (addressResult.error) console.error("Error fetching address:", addressResult.error);
    if (socialProfileResult.error)
      console.error("Error fetching social profile:", socialProfileResult.error);
    if (servicesResult.error) console.error("Error fetching services:", servicesResult.error);
    if (experiencesResult.error)
      console.error("Error fetching experiences:", experiencesResult.error);
    if (educationsResult.error) console.error("Error fetching educations:", educationsResult.error);

    // Transform the data to match our CA type
    const transformedCA = {
      id: params.id, // Use the URL parameter as the ID
      name: caProfile.name,
      email: caProfile.email,
      phone: caProfile.phone,
      imageUrl: caProfile.profile_picture,
      about: caProfile.about || "",
      experience: caProfile.years_of_experience,
      location: addressResult.data ? `${addressResult.data.city}, ${addressResult.data.state}` : "",
      city: addressResult.data?.city || "",
      state: addressResult.data?.state || "",
      specialization: socialProfileResult.data?.areas_of_expertise?.split(",") || [],
      qualification: socialProfileResult.data?.ica_membership_number ? "CA" : "",
      firm_name: socialProfileResult.data?.practice_license_number
        ? `${caProfile.name} & Associates`
        : "",
      member_since: new Date(caProfile.created_at).getFullYear().toString(),
      clients: "120+", // This should come from a separate table if available
      services: servicesResult.data?.map(service => service.service_name) || [],
      website: socialProfileResult.data?.professional_website,
      linkedin: socialProfileResult.data?.linkedin_profile,
      verified: caProfile.is_verified,
      rating: 4.5, // This should come from a reviews table
      reviews: 0, // This should come from a reviews table
    };

    // Transform experiences data
    const transformedExperiences =
      experiencesResult.data?.map(exp => ({
        id: exp.id,
        title: exp.title,
        employmentType: exp.employment_type,
        companyName: exp.company_name,
        location: exp.location,
        isCurrent: exp.is_current,
        startDate: exp.start_date,
        endDate: exp.end_date,
        industry: exp.industry,
        description: exp.description,
        recentService: exp.recent_service,
      })) || [];

    // Transform education data
    const transformedEducations =
      educationsResult.data?.map(edu => ({
        id: edu.id,
        instituteName: edu.institute_name,
        degree: edu.degree,
        fieldOfStudy: edu.field_of_study,
        startDate: edu.start_date,
        endDate: edu.end_date,
        grade: edu.grade,
        description: edu.description,
        isCurrent: edu.is_current,
      })) || [];

    return (
      <CAProfileDetails
        ca={transformedCA}
        experiences={transformedExperiences}
        educations={transformedEducations}
      />
    );
  } catch (error) {
    console.error("Error in CAProfile:", error);
    notFound();
  }
}
