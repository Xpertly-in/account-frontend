import { supabase } from "@/helper/supabase.helper";
import { FormValues } from "@/types/onboarding.type";
import { CustomerProfile } from "@/types/customer-profile.type";
import { transformFormValuesToProfile } from "./form.helper";

// Table name for customer profiles
const PROFILES_TABLE = "profiles";
const DOCUMENTS_TABLE = "customer_documents";

/**
 * Creates a new customer profile in Supabase
 * @param userId - The user ID from authentication
 * @param formValues - The form values from onboarding
 * @returns The created profile or error
 */
export const createCustomerProfile = async (
  userId: string,
  formValues: FormValues
): Promise<{ data: CustomerProfile | null; error: any }> => {
  try {
    // Transform form values to profile structure
    const profileData = transformFormValuesToProfile(formValues);

    // Add user ID and verification status
    const profile = {
      ...profileData,
      userId,
      verificationStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert profile into Supabase
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .insert(profile)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating customer profile:", error);
    return { data: null, error };
  }
};

/**
 * Updates an existing customer profile
 * @param profileId - The profile ID to update
 * @param formValues - The updated form values
 * @returns The updated profile or error
 */
export const updateCustomerProfile = async (
  profileId: string,
  formValues: FormValues
): Promise<{ data: CustomerProfile | null; error: any }> => {
  try {
    const profileData = transformFormValuesToProfile(formValues);

    const profile = {
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .update(profile)
      .eq("id", profileId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return { data: null, error };
  }
};

/**
 * Gets a customer profile by user ID
 * @param userId - The user ID from authentication
 * @returns The profile or error
 */
export const getCustomerProfileByUserId = async (
  userId: string
): Promise<{ data: CustomerProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select("*")
      .eq("userId", userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return { data: null, error };
  }
};

/**
 * Uploads a profile image for a customer
 * @param userId - The user ID
 * @param file - The image file to upload
 * @returns The uploaded image URL or error
 */
export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<{ data: string | null; error: any }> => {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `customer-profiles/${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    // Update the profile with the new image URL
    const { error: updateError } = await supabase
      .from(PROFILES_TABLE)
      .update({ profile_picture: publicUrl })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return { data: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return { data: null, error };
  }
};

/**
 * Uploads a document file for a customer profile
 * @param profileId - The profile ID
 * @param file - The file to upload
 * @param documentType - The type of document
 * @returns The uploaded document record or error
 */
export const uploadDocument = async (
  profileId: string,
  file: File,
  documentType: string
): Promise<{ data: any; error: any }> => {
  try {
    // Generate path for the file
    const filePath = `customer-documents/${profileId}/${documentType}/${Date.now()}_${file.name}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    // Create document record in database
    const { data: documentData, error: documentError } = await supabase
      .from(DOCUMENTS_TABLE)
      .insert({
        profileId,
        type: documentType,
        name: file.name,
        url: publicUrl,
        fileSize: file.size,
        fileType: file.type,
        verified: false,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (documentError) throw documentError;

    return { data: documentData, error: null };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { data: null, error };
  }
};

/**
 * Gets all documents for a customer profile
 * @param profileId - The profile ID
 * @returns List of documents or error
 */
export const getDocuments = async (profileId: string): Promise<{ data: any[]; error: any }> => {
  try {
    const { data, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .select("*")
      .eq("profileId", profileId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { data: [], error };
  }
}; 