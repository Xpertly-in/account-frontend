import { supabase } from "./supabase.helper";
import { CAProfile, FormValues } from "@/store/jotai/onboarding.store";
import { transformFormValuesToProfile } from "./form.helper";

// Table name for CA profiles
const CA_PROFILES_TABLE = "ca_profiles";
const DOCUMENTS_TABLE = "ca_documents";

/**
 * Creates a new CA profile in Supabase
 * @param userId - The user ID from authentication
 * @param formValues - The form values from onboarding
 * @returns The created profile or error
 */
export const createCAProfile = async (
  userId: string,
  formValues: FormValues
): Promise<{ data: CAProfile | null; error: any }> => {
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
      .from(CA_PROFILES_TABLE)
      .insert(profile)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating CA profile:", error);
    return { data: null, error };
  }
};

/**
 * Updates an existing CA profile
 * @param profileId - The profile ID to update
 * @param formValues - The updated form values
 * @returns The updated profile or error
 */
export const updateCAProfile = async (
  profileId: string,
  formValues: FormValues
): Promise<{ data: CAProfile | null; error: any }> => {
  try {
    const profileData = transformFormValuesToProfile(formValues);

    const profile = {
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(CA_PROFILES_TABLE)
      .update(profile)
      .eq("id", profileId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating CA profile:", error);
    return { data: null, error };
  }
};

/**
 * Gets a CA profile by user ID
 * @param userId - The user ID from authentication
 * @returns The profile or error
 */
export const getCAProfileByUserId = async (
  userId: string
): Promise<{ data: CAProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from(CA_PROFILES_TABLE)
      .select("*")
      .eq("userId", userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching CA profile:", error);
    return { data: null, error };
  }
};

/**
 * Uploads a document file for a CA profile
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
    const filePath = `ca-documents/${profileId}/${documentType}/${Date.now()}_${file.name}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(filePath);

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
 * Gets all documents for a CA profile
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
