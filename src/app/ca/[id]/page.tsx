import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CAProfileWrapper from "@/components/features/profile/CAProfileWrapper";

// Generate static params for the CA profiles at build time
export async function generateStaticParams() {
  // Fetch all CA IDs from Supabase
  const { data: cas } = await supabase
    .from("profiles")
    .select("id");

  // Return array of params for static generation
  return cas?.map((ca) => ({
    id: ca.id,
  })) || [];
}

export default async function CAProfile({ params }: { params: { id: string } }) {
  try {
    // Fetch CA profile data
    const { data: caProfile, error: caError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", params.id)
      .single();

    if (caError || !caProfile) {
      throw new Error("CA profile not found");
    }

    // Fetch address data
    const { data: address } = await supabase
      .from("addresses")
      .select("*")
      .eq("ca_id", params.id)
      .single();

    // Fetch social profile data
    const { data: socialProfile } = await supabase
      .from("social_profiles")
      .select("*")
      .eq("ca_id", params.id)
      .single();

    // Fetch services data
    const { data: services } = await supabase
      .from("services")
      .select("*")
      .eq("ca_id", params.id)
      .eq("is_active", true);

    // Fetch experiences data
    const { data: experiences } = await supabase
      .from("experiences")
      .select("*")
      .eq("ca_id", params.id)
      .eq("is_active", true)
      .order("start_date", { ascending: false });

    // Fetch education data
    const { data: educations } = await supabase
      .from("educations")
      .select("*")
      .eq("ca_id", params.id)
      .eq("is_active", true)
      .order("start_date", { ascending: false });

    // Transform the data to match our CA type
    const transformedCA = {
      id: caProfile.id,
      name: caProfile.name,
      email: caProfile.email,
      phone: caProfile.phone,
      imageUrl: caProfile.profile_picture,
      about: caProfile.about,
      experience: caProfile.years_of_experience,
      location: address ? `${address.city}, ${address.state}` : "",
      city: address?.city || "",
      state: address?.state || "",
      specialization: socialProfile?.areas_of_expertise?.split(",") || [],
      qualification: socialProfile?.icai_membership_number ? "CA" : "",
      firm_name: socialProfile?.practice_license_number ? `${caProfile.name} & Associates` : "",
      member_since: new Date(caProfile.created_at).getFullYear().toString(),
      clients: "120+", // This should come from a separate table if available
      services: services?.map(service => service.service_name) || [
        "Income Tax Return Filing",
        "GST Registration & Filing",
        "Business Accounting",
        "Tax Planning",
        "Audit Services",
        "Financial Advisory",
      ],
      website: socialProfile?.professional_website,
      linkedin: socialProfile?.linkedin_profile,
      verified: true, // We'll handle verification status separately
      rating: 4.5, // This should come from a reviews table
      reviews: 0, // This should come from a reviews table
    };

    // Transform experiences data
    const transformedExperiences = experiences?.map(exp => ({
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
    const transformedEducations = educations?.map(edu => ({
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
      <CAProfileWrapper 
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
