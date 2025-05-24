/// <reference types="@testing-library/jest-dom" />
import {
  Lead,
  LeadEngagement,
  LeadStatus,
  LeadUrgency,
  ContactPreference,
} from "@/types/dashboard/lead.type";

// Mock the supabase helper
jest.mock("@/helper/supabase.helper", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Import after mocking
import {
  fetchLeads,
  createLeadEngagement,
  getLeadEngagements,
  getLeadEngagementCount,
} from "@/services/leads.service";
import { supabase } from "@/helper/supabase.helper";

// Get the mocked supabase instance
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("Leads Service Functions", () => {
  const mockLead: Lead = {
    id: "lead-1",
    customerId: "customer-1",
    customerName: "John Doe",
    services: ["Tax Filing", "GST Registration"],
    urgency: LeadUrgency.IMMEDIATELY,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    contactPreference: ContactPreference.EMAIL,
    contactInfo: "john@example.com",
    notes: "Urgent tax filing needed",
    timestamp: "2024-01-15T10:30:00Z",
    status: LeadStatus.NEW,
  };

  // Mock database response (snake_case fields)
  const mockDbLead = {
    id: "lead-1",
    customer_id: "customer-1",
    services: ["Tax Filing", "GST Registration"],
    urgency: "Immediately",
    location_city: "Mumbai",
    location_state: "Maharashtra",
    contact_preference: "Email",
    contact_info: "john@example.com",
    notes: "Urgent tax filing needed",
    created_at: "2024-01-15T10:30:00Z",
    status: "new",
    profiles: {
      name: "John Doe",
    },
  };

  const mockEngagement: LeadEngagement = {
    id: "engagement-1",
    leadId: "lead-1",
    caId: "ca-1",
    viewedAt: "2024-01-15T11:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchLeads", () => {
    it("should fetch leads successfully", async () => {
      // Arrange
      const mockResponse = { data: [mockDbLead], error: null };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue(mockResponse),
        }),
      } as any);

      // Act
      const result = await fetchLeads();

      // Assert
      expect(result.data).toEqual([mockLead]);
      expect(result.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith("leads");
    });

    it("should handle fetch leads error", async () => {
      // Arrange
      const mockError = new Error("Database error");
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      } as any);

      // Act
      const result = await fetchLeads();

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe("createLeadEngagement", () => {
    it("should create lead engagement successfully", async () => {
      // Arrange
      const mockDbResponse = {
        id: "engagement-1",
        lead_id: "lead-1",
        ca_id: "ca-1",
        viewed_at: "2024-01-15T11:00:00Z",
      };
      const mockResponse = { data: mockDbResponse, error: null };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue(mockResponse),
          }),
        }),
      } as any);

      // Act
      const result = await createLeadEngagement("lead-1", "ca-1");

      // Assert
      expect(result.data).toEqual(mockEngagement);
      expect(result.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith("lead_engagements");
    });

    it("should handle create engagement error", async () => {
      // Arrange
      const mockError = new Error("Insert failed");
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      } as any);

      // Act
      const result = await createLeadEngagement("lead-1", "ca-1");

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe("getLeadEngagements", () => {
    it("should fetch engagements for a lead", async () => {
      // Arrange
      const mockDbResponse = [
        {
          id: "engagement-1",
          lead_id: "lead-1",
          ca_id: "ca-1",
          viewed_at: "2024-01-15T11:00:00Z",
        },
      ];
      const mockResponse = { data: mockDbResponse, error: null };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue(mockResponse),
        }),
      } as any);

      // Act
      const result = await getLeadEngagements("lead-1");

      // Assert
      expect(result.data).toEqual([mockEngagement]);
      expect(result.error).toBeNull();
      expect(mockSupabase.from).toHaveBeenCalledWith("lead_engagements");
    });
  });

  describe("getLeadEngagementCount", () => {
    it("should return engagement count for a lead", async () => {
      // Arrange
      const mockResponse = { count: 3, error: null };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue(mockResponse),
        }),
      } as any);

      // Act
      const result = await getLeadEngagementCount("lead-1");

      // Assert
      expect(result.count).toBe(3);
      expect(result.error).toBeNull();
    });

    it("should handle count error", async () => {
      // Arrange
      const mockError = new Error("Count failed");
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ count: null, error: mockError }),
        }),
      } as any);

      // Act
      const result = await getLeadEngagementCount("lead-1");

      // Assert
      expect(result.count).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });
});
