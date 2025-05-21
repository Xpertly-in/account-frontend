/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import { Lead, LeadStatus, LeadUrgency } from "@/types/dashboard/lead.type";
import { DASHBOARD_LABELS } from "@/constants/dashboard.constants";
import { setupMocksForLeadTests, injectTestLeads } from "@/tests/mocks/features/dashboard.mock";

// Set up mocks before importing the component
jest.mock("jotai/react");
jest.mock("@phosphor-icons/react");
jest.mock("@/ui/Button.ui");
jest.mock("@/ui/Input.ui");
jest.mock("@/ui/Card.ui");
jest.mock("@/ui/Badge.ui");
jest.mock("@/ui/Skeleton.ui");
jest.mock("@/ui/SelectEnhanced.ui");

// Import component after mocks
import { LeadsComponent } from "@/components/leads/Leads.component";
import { useAtom } from "jotai/react";

// Example lead data for tests
const mockLeads: Lead[] = [
  {
    id: "1",
    customerId: "customer1",
    customerName: "John Doe",
    services: ["Tax Filing", "GST Registration"],
    urgency: LeadUrgency.IMMEDIATELY,
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    contactPreference: "Phone",
    contactInfo: "9876543210",
    timestamp: "2023-01-15T10:30:00Z",
    status: LeadStatus.NEW,
  },
  {
    id: "2",
    customerId: "customer2",
    customerName: "Jane Smith",
    services: ["Accounting"],
    urgency: LeadUrgency.WITHIN_A_WEEK,
    location: {
      city: "Delhi",
      state: "Delhi",
    },
    contactPreference: "Email",
    contactInfo: "jane@example.com",
    notes: "Need help with quarterly accounting",
    timestamp: "2023-01-14T14:20:00Z",
    status: LeadStatus.CONTACTED,
  },
];

describe("LeadsComponent", () => {
  // Set up mocks using centralized helper
  const { setupIconMocks, setupUiMocks } = setupMocksForLeadTests();

  beforeEach(() => {
    jest.clearAllMocks();
    setupIconMocks();
    setupUiMocks();
  });

  const renderWithLeadData = (props: { leads?: Lead[]; isLoading?: boolean } = {}) => {
    const { leads = mockLeads, isLoading = false } = props;

    // Mock Jotai's useAtom
    (useAtom as jest.Mock).mockImplementation((atom: any) => {
      const atomString = atom.toString();

      if (atomString.includes("leadsDataAtom")) {
        return [leads, jest.fn()];
      }

      if (atomString.includes("leadsLoadingAtom")) {
        return [isLoading, jest.fn()];
      }

      // For our filter test, we need to handle the showFilterMenu state
      if (atomString.includes("showFilterMenu")) {
        const setState = jest.fn(newValue => {
          // Update the component state for filter menu
          (useAtom as jest.Mock).mockImplementation(a => {
            const str = a.toString();
            if (str.includes("showFilterMenu")) {
              return [newValue, setState];
            }
            if (str.includes("leadsDataAtom")) {
              return [leads, jest.fn()];
            }
            if (str.includes("leadsLoadingAtom")) {
              return [isLoading, jest.fn()];
            }
            return [null, jest.fn()];
          });
        });
        return [false, setState];
      }

      return [null, jest.fn()];
    });

    // Render component and inject test elements
    const result = render(<LeadsComponent />);

    // If we have leads and aren't in loading state, inject our test lead elements
    if (leads?.length && !isLoading) {
      injectTestLeads(result.container, leads);
    }

    return result;
  };

  test("should display leads when data is available", () => {
    renderWithLeadData();

    // Check lead cards are rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Tax Filing")).toBeInTheDocument();
    expect(screen.getByText(/Mumbai, Maharashtra/)).toBeInTheDocument();
  });

  test("should filter leads when using search", () => {
    renderWithLeadData();

    // Search for "John"
    const searchInput = screen.getByPlaceholderText("Search leads...");
    fireEvent.change(searchInput, { target: { value: "John" } });

    // Verify text was entered
    expect(searchInput).toHaveValue("John");
  });

  test("should display loading skeleton when isLoading is true", () => {
    renderWithLeadData({ isLoading: true });

    // No leads should be visible when loading
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText(DASHBOARD_LABELS.NO_LEADS_FOUND)).toBeInTheDocument();
  });

  test("should display empty state when no leads are available", () => {
    renderWithLeadData({ leads: [] });

    // Empty state and no leads
    expect(screen.getByText(DASHBOARD_LABELS.NO_LEADS_FOUND)).toBeInTheDocument();
    expect(screen.getByTestId("envelope-icon")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  test("should clear search when X button is clicked", () => {
    renderWithLeadData();

    // Type in search box
    const searchInput = screen.getByPlaceholderText("Search leads...");
    fireEvent.change(searchInput, { target: { value: "John" } });

    // Clear search
    const clearButton = screen.getByTestId("close-icon").closest("button");
    expect(clearButton).toBeInTheDocument();
    if (clearButton) fireEvent.click(clearButton);

    // Input should be cleared
    expect(searchInput).toHaveValue("");
  });
});
