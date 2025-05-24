import { supabase } from "@/helper/supabase.helper";
import { Lead, LeadEngagement } from "@/types/dashboard/lead.type";

/**
 * Interface for creating a new lead (matches database schema)
 */
interface CreateLeadData {
  customer_id: string;
  services: string[];
  urgency: string;
  contact_preference: string;
  status?: string;
  location_city: string;
  location_state: string;
  contact_info: string;
  notes?: string;
}

/**
 * Creates a new lead in the database
 * @param leadData - The lead data to create
 * @returns Promise with created lead data or error
 */
export const createLead = async (
  leadData: CreateLeadData
): Promise<{ data: Lead | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...leadData,
        status: leadData.status || "new",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        profiles!customer_id (
          name
        )
      `
      )
      .single();

    if (error) throw error;

    // Transform database response to match our TypeScript interface
    const transformedData: Lead = {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.profiles?.name || "Unknown Customer",
      services: data.services || [],
      urgency: data.urgency,
      location: {
        city: data.location_city,
        state: data.location_state,
      },
      contactPreference: data.contact_preference,
      contactInfo: data.contact_info,
      notes: data.notes,
      timestamp: data.created_at,
      status: data.status,
    };

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { data: null, error };
  }
};

/**
 * Updates an existing lead in the database
 * @param leadId - The ID of the lead to update
 * @param updates - The fields to update
 * @returns Promise with updated lead data or error
 */
export const updateLead = async (
  leadId: string,
  updates: Partial<CreateLeadData>
): Promise<{ data: Lead | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select(
        `
        *,
        profiles!customer_id (
          name
        )
      `
      )
      .single();

    if (error) throw error;

    // Transform database response to match our TypeScript interface
    const transformedData: Lead = {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.profiles?.name || "Unknown Customer",
      services: data.services || [],
      urgency: data.urgency,
      location: {
        city: data.location_city,
        state: data.location_state,
      },
      contactPreference: data.contact_preference,
      contactInfo: data.contact_info,
      notes: data.notes,
      timestamp: data.created_at,
      status: data.status,
    };

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error updating lead:", error);
    return { data: null, error };
  }
};

/**
 * Fetches all leads from the database
 * @returns Promise with leads data or error
 */
export const fetchLeads = async (): Promise<{ data: Lead[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select(
        `
        *,
        profiles!customer_id (
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform database response to match our TypeScript interface
    const transformedData: Lead[] =
      data?.map(item => ({
        id: item.id,
        customerId: item.customer_id,
        customerName: item.profiles?.name || "Unknown Customer",
        services: item.services || [],
        urgency: item.urgency,
        location: {
          city: item.location_city,
          state: item.location_state,
        },
        contactPreference: item.contact_preference,
        contactInfo: item.contact_info,
        notes: item.notes,
        timestamp: item.created_at,
        status: item.status,
      })) || [];

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return { data: null, error };
  }
};

/**
 * Creates a new lead engagement record
 * @param leadId - The ID of the lead being engaged with
 * @param caId - The ID of the CA engaging with the lead
 * @returns Promise with engagement data or error
 */
export const createLeadEngagement = async (
  leadId: string,
  caId: string
): Promise<{ data: LeadEngagement | null; error: any }> => {
  try {
    const engagement = {
      lead_id: leadId,
      ca_id: caId,
      viewed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("lead_engagements")
      .insert(engagement)
      .select()
      .single();

    if (error) throw error;

    // Transform database response to match our interface
    const transformedData: LeadEngagement = {
      id: data.id,
      leadId: data.lead_id,
      caId: data.ca_id,
      viewedAt: data.viewed_at,
    };

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error creating lead engagement:", error);
    return { data: null, error };
  }
};

/**
 * Gets all engagements for a specific lead
 * @param leadId - The ID of the lead
 * @returns Promise with engagements data or error
 */
export const getLeadEngagements = async (
  leadId: string
): Promise<{ data: LeadEngagement[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("lead_engagements")
      .select("*")
      .eq("lead_id", leadId);

    if (error) throw error;

    // Transform database response to match our interface
    const transformedData: LeadEngagement[] =
      data?.map(item => ({
        id: item.id,
        leadId: item.lead_id,
        caId: item.ca_id,
        viewedAt: item.viewed_at,
      })) || [];

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error fetching lead engagements:", error);
    return { data: null, error };
  }
};

/**
 * Gets the count of engagements for a specific lead
 * @param leadId - The ID of the lead
 * @returns Promise with engagement count or error
 */
export const getLeadEngagementCount = async (
  leadId: string
): Promise<{ count: number | null; error: any }> => {
  try {
    const { count, error } = await supabase
      .from("lead_engagements")
      .select("*", { count: "exact", head: true })
      .eq("lead_id", leadId);

    if (error) throw error;

    return { count, error: null };
  } catch (error) {
    console.error("Error getting lead engagement count:", error);
    return { count: null, error };
  }
};
