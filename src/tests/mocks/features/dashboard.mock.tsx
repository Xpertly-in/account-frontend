import React from "react";

/**
 * Dashboard-specific mocks for testing
 */

/**
 * Creates a test wrapper component for dashboard tests that need Jotai mocks
 *
 * @param mockData Object containing dashboard mock data (leads, contact requests, etc.)
 * @returns A React component that wraps the provided component with mocked Jotai values
 *
 * @example
 * import { createDashboardTestWrapper } from "@/tests/mocks/features/dashboard.mock";
 * import { LeadsComponent } from "@/components/leads/Leads.component";
 *
 * jest.mock("jotai/react");
 *
 * const mockLeads = [{ id: "1", name: "Test Lead" }];
 * const TestWrapper = createDashboardTestWrapper({
 *   leads: mockLeads,
 *   leadsLoading: false
 * });
 *
 * render(
 *   <TestWrapper>
 *     <LeadsComponent />
 *   </TestWrapper>
 * );
 */
export const createDashboardTestWrapper = (mockData: {
  leads?: any[];
  leadsLoading?: boolean;
  contactRequests?: any[];
  contactRequestsLoading?: boolean;
  metrics?: any;
  [key: string]: any;
}) => {
  // Import here to avoid circular dependencies
  const { useAtom } = jest.requireMock("jotai/react");

  // Create wrapper component
  return ({ children }: { children: React.ReactNode }) => {
    // Ensure all necessary mock data has defaults
    const leads = mockData.leads ?? [];
    const leadsLoading = mockData.leadsLoading ?? false;
    const contactRequests = mockData.contactRequests ?? [];
    const contactRequestsLoading = mockData.contactRequestsLoading ?? false;
    const metrics = mockData.metrics ?? {};

    // Mock useAtom implementation
    (useAtom as jest.Mock).mockImplementation((atom: any) => {
      // Use the atom's .toString() representation to match it
      const atomString = atom.toString();

      // Handle different atom types based on their string representation
      if (atomString.includes("leadsDataAtom")) {
        return [leads, jest.fn()];
      }
      if (atomString.includes("leadsLoadingAtom")) {
        return [leadsLoading, jest.fn()];
      }
      if (atomString.includes("contactRequestsDataAtom")) {
        return [contactRequests, jest.fn()];
      }
      if (atomString.includes("contactRequestsLoadingAtom")) {
        return [contactRequestsLoading, jest.fn()];
      }
      if (atomString.includes("metricsDataAtom")) {
        return [metrics, jest.fn()];
      }

      // Return defensive defaults for any other atoms
      return [null, jest.fn()];
    });

    return <>{children}</>;
  };
};

/**
 * Helper function to render test-friendly lead elements directly in the DOM
 * This is used as a simpler alternative to mocking all the UI components that render leads
 *
 * @param container The DOM container to append leads to
 * @param leads Array of Lead objects to render for testing
 */
export const injectTestLeads = (container: HTMLElement, leads: any[]): void => {
  if (!leads?.length) return;

  const leadsList = document.createElement("div");
  leadsList.className = "test-leads-container";
  leadsList.setAttribute("data-testid", "leads-list");

  leads.forEach(lead => {
    leadsList.appendChild(
      document.createRange().createContextualFragment(
        `<div class="lead-item" data-testid="lead-${lead.id}">
        <div class="customer-name">${lead.customerName}</div>
        <div class="services">
          ${lead.services.map((s: string) => `<span class="service">${s}</span>`).join(" ")}
        </div>
        <div class="location">${lead.location.city}, ${lead.location.state}</div>
        <div class="urgency">${lead.urgency}</div>
        <div class="status">${lead.status}</div>
      </div>`
      )
    );
  });

  container.appendChild(leadsList);
};

/**
 * Sets up all the common mocks needed for Lead component tests
 * @returns Mock setup functions that can be used in tests
 */
export const setupMocksForLeadTests = () => {
  // Create a simple mock component for reuse
  const mockComponent = ({
    children,
    ...props
  }: React.PropsWithChildren<{ [key: string]: any }>) => <div {...props}>{children}</div>;

  // Setup Phosphor icon mocks
  const setupIconMocks = () => {
    jest.requireMock("@phosphor-icons/react").EnvelopeOpen = () => (
      <div data-testid="envelope-icon" />
    );
    jest.requireMock("@phosphor-icons/react").FunnelSimple = () => (
      <div data-testid="filter-icon" />
    );
    jest.requireMock("@phosphor-icons/react").MagnifyingGlass = () => (
      <div data-testid="search-icon" />
    );
    jest.requireMock("@phosphor-icons/react").X = () => <div data-testid="close-icon" />;
    jest.requireMock("@phosphor-icons/react").Plus = () => <div data-testid="plus-icon" />;
  };

  // Setup UI component mocks
  const setupUiMocks = () => {
    // Button mock
    jest.requireMock("@/ui/Button.ui").Button = mockComponent;

    // Input mock
    jest.requireMock("@/ui/Input.ui").Input = ({
      value,
      onChange,
      placeholder,
      ...props
    }: {
      value?: string;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
      placeholder?: string;
      [key: string]: any;
    }) => <input value={value} onChange={onChange} placeholder={placeholder} {...props} />;

    // Badge mock
    jest.requireMock("@/ui/Badge.ui").Badge = mockComponent;

    // Skeleton mock
    jest.requireMock("@/ui/Skeleton.ui").Skeleton = ({
      className,
      ...props
    }: {
      className?: string;
      [key: string]: any;
    }) => <div className={`${className} animate-pulse`} {...props} />;

    // Card mocks
    const CardMocks = {
      Card: mockComponent,
      CardHeader: mockComponent,
      CardTitle: mockComponent,
      CardDescription: mockComponent,
      CardContent: mockComponent,
      CardFooter: mockComponent,
    };
    Object.assign(jest.requireMock("@/ui/Card.ui"), CardMocks);

    // Select mocks
    const SelectMocks = {
      Select: mockComponent,
      SelectContent: mockComponent,
      SelectTrigger: mockComponent,
      SelectValue: mockComponent,
      SelectItem: mockComponent,
    };
    Object.assign(jest.requireMock("@/ui/SelectEnhanced.ui"), SelectMocks);
  };

  return {
    setupIconMocks,
    setupUiMocks,
    mockComponent,
  };
};
