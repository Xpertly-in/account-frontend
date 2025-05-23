/// <reference types="@testing-library/jest-dom" />
import { renderHook, act } from "@testing-library/react";
import { useAtom } from "jotai/react";
import { Lead, LeadStatus, LeadUrgency, ContactPreference } from "@/types/dashboard/lead.type";
import { leadsDataAtom, leadsLoadingAtom, fetchLeadsAtom } from "@/store/jotai/dashboard.store";

// Mock the leads service
jest.mock("@/services/leads.service", () => ({
  fetchLeads: jest.fn(),
}));

import { fetchLeads } from "@/services/leads.service";

describe("Dashboard Store - Leads", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchLeadsAtom", () => {
    it("should fetch leads successfully and update store", async () => {
      // Arrange
      const mockFetchLeads = fetchLeads as jest.MockedFunction<typeof fetchLeads>;
      mockFetchLeads.mockResolvedValue({ data: [mockLead], error: null });

      // Act
      const { result } = renderHook(() => {
        const [, fetchLeadsAction] = useAtom(fetchLeadsAtom);
        const [leadsData] = useAtom(leadsDataAtom);
        const [isLoading] = useAtom(leadsLoadingAtom);
        return { fetchLeadsAction, leadsData, isLoading };
      });

      await act(async () => {
        await result.current.fetchLeadsAction();
      });

      // Assert
      expect(mockFetchLeads).toHaveBeenCalledTimes(1);
      expect(result.current.leadsData).toEqual([mockLead]);
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle fetch leads error", async () => {
      // Arrange
      const mockError = new Error("Database error");
      const mockFetchLeads = fetchLeads as jest.MockedFunction<typeof fetchLeads>;
      mockFetchLeads.mockResolvedValue({ data: null, error: mockError });

      // Act
      const { result } = renderHook(() => {
        const [, fetchLeadsAction] = useAtom(fetchLeadsAtom);
        const [leadsData] = useAtom(leadsDataAtom);
        const [isLoading] = useAtom(leadsLoadingAtom);
        return { fetchLeadsAction, leadsData, isLoading };
      });

      await act(async () => {
        await result.current.fetchLeadsAction();
      });

      // Assert
      expect(mockFetchLeads).toHaveBeenCalledTimes(1);
      expect(result.current.leadsData).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it("should set loading state during fetch", async () => {
      // Arrange
      const mockFetchLeads = fetchLeads as jest.MockedFunction<typeof fetchLeads>;
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      mockFetchLeads.mockReturnValue(promise as any);

      // Act
      const { result } = renderHook(() => {
        const [, fetchLeadsAction] = useAtom(fetchLeadsAtom);
        const [isLoading] = useAtom(leadsLoadingAtom);
        return { fetchLeadsAction, isLoading };
      });

      act(() => {
        result.current.fetchLeadsAction();
      });

      // Assert loading state
      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolvePromise!({ data: [mockLead], error: null });
        await promise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
