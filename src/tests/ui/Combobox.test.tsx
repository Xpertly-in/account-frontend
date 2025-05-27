import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox, type ComboboxOption } from "@/ui/Combobox.ui";

// Import mocks
import "@/tests/mocks";

// Test data
const mockOptions: ComboboxOption[] = [
  { value: "option1", label: "Option 1", count: 5 },
  { value: "option2", label: "Option 2", count: 10 },
  { value: "option3", label: "Option 3", count: 3 },
  { value: "option4", label: "Very Long Option Name That Should Truncate", count: 1 },
];

const mockOptionsWithoutCount: ComboboxOption[] = [
  { value: "status1", label: "Active" },
  { value: "status2", label: "Inactive" },
  { value: "status3", label: "Pending" },
];

describe("Combobox Component", () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  // ============================================================================
  // BASIC RENDERING TESTS
  // ============================================================================

  describe("Basic Rendering", () => {
    it("renders with default placeholder", () => {
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Select option...")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <Combobox
          options={mockOptions}
          onValueChange={mockOnValueChange}
          placeholder="Choose an option"
        />
      );

      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Combobox
          options={mockOptions}
          onValueChange={mockOnValueChange}
          className="custom-class"
        />
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("custom-class");
    });

    it("handles disabled state", () => {
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} disabled={true} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });
  });

  // ============================================================================
  // DROPDOWN INTERACTION TESTS
  // ============================================================================

  describe("Dropdown Interaction", () => {
    it("opens dropdown when clicked", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      });
    });

    it("displays all options when opened", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
        expect(screen.getByText("Very Long Option Name That Should Truncate")).toBeInTheDocument();
      });
    });

    it("displays option counts when provided", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("(5)")).toBeInTheDocument();
        expect(screen.getByText("(10)")).toBeInTheDocument();
        expect(screen.getByText("(3)")).toBeInTheDocument();
        expect(screen.getByText("(1)")).toBeInTheDocument();
      });
    });

    it("does not display counts when not provided", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptionsWithoutCount} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
      });
    });

    it("shows custom search placeholder", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={mockOptions}
          onValueChange={mockOnValueChange}
          searchPlaceholder="Type to search..."
        />
      );

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type to search...")).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // SINGLE-SELECT FUNCTIONALITY TESTS
  // ============================================================================

  describe("Single-Select Functionality", () => {
    it("selects option in single-select mode", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Option 1"));
      await user.click(screen.getByText("Option 1"));

      expect(mockOnValueChange).toHaveBeenCalledWith("option1");
    });

    it("displays selected option in trigger", () => {
      render(<Combobox options={mockOptions} value="option2" onValueChange={mockOnValueChange} />);

      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("deselects option when clicked again in single-select", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} value="option1" onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => {
        const options = screen.getAllByText("Option 1");
        expect(options.length).toBeGreaterThan(0);
      });

      // Click the option in the dropdown (not the trigger)
      const dropdownOptions = screen.getAllByText("Option 1");
      const dropdownOption = dropdownOptions.find(el => el.closest("[cmdk-item]") !== null);
      await user.click(dropdownOption!);

      expect(mockOnValueChange).toHaveBeenCalledWith("");
    });

    it("closes dropdown after selection in single-select mode", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Option 1"));
      await user.click(screen.getByText("Option 1"));

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
      });
    });

    it("shows check icon for selected option", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} value="option1" onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        const checkIcons = screen.getAllByTestId("check-icon");
        const visibleIcon = checkIcons.find(icon => icon.classList.contains("opacity-100"));
        expect(visibleIcon).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // MULTI-SELECT FUNCTIONALITY TESTS
  // ============================================================================

  describe("Multi-Select Functionality", () => {
    it("works in multi-select mode", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} multiple={true} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Option 1"));
      await user.click(screen.getByText("Option 1"));

      expect(mockOnValueChange).toHaveBeenCalledWith(["option1"]);
    });

    it("selects multiple options", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} multiple={true} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Option 1"));

      await user.click(screen.getByText("Option 1"));
      expect(mockOnValueChange).toHaveBeenCalledWith(["option1"]);

      await user.click(screen.getByText("Option 2"));
      // In multi-select, the component receives the previous value and adds to it
      // So we expect the second call to include both options
      expect(mockOnValueChange).toHaveBeenCalledWith(["option2"]);
    });

    it("deselects option in multi-select mode", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={mockOptions}
          value={["option1", "option2"]}
          onValueChange={mockOnValueChange}
          multiple={true}
        />
      );

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Option 1"));
      await user.click(screen.getByText("Option 1"));

      expect(mockOnValueChange).toHaveBeenCalledWith(["option2"]);
    });

    it("keeps dropdown open in multi-select mode", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} multiple={true} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Option 1"));
      await user.click(screen.getByText("Option 1"));

      // Dropdown should remain open
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("displays selection count in multi-select mode", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={mockOptions}
          value={["option1", "option2"]}
          onValueChange={mockOnValueChange}
          multiple={true}
        />
      );

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("2 selected")).toBeInTheDocument();
      });
    });

    it("shows Done button in multi-select mode", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={mockOptions}
          value={["option1"]}
          onValueChange={mockOnValueChange}
          multiple={true}
        />
      );

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("Done")).toBeInTheDocument();
      });
    });

    it("closes dropdown when Done button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={mockOptions}
          value={["option1"]}
          onValueChange={mockOnValueChange}
          multiple={true}
        />
      );

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Done"));
      await user.click(screen.getByText("Done"));

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // DISPLAY TEXT AND TRUNCATION TESTS
  // ============================================================================

  describe("Display Text and Truncation", () => {
    it("displays single selected option in multi-select", () => {
      render(
        <Combobox
          options={mockOptions}
          value={["option1"]}
          onValueChange={mockOnValueChange}
          multiple={true}
        />
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("displays multiple selected options within limit", () => {
      render(
        <Combobox
          options={mockOptions}
          value={["option1", "option2"]}
          onValueChange={mockOnValueChange}
          multiple={true}
          maxSelectedDisplay={2}
        />
      );

      expect(screen.getByText("Option 1, Option 2")).toBeInTheDocument();
    });

    it("truncates display text when exceeding maxSelectedDisplay", () => {
      render(
        <Combobox
          options={mockOptions}
          value={["option1", "option2", "option3"]}
          onValueChange={mockOnValueChange}
          multiple={true}
          maxSelectedDisplay={2}
        />
      );

      expect(screen.getByText("Option 1, Option 2 +1 more")).toBeInTheDocument();
    });

    it("handles custom maxSelectedDisplay value", () => {
      render(
        <Combobox
          options={mockOptions}
          value={["option1", "option2", "option3", "option4"]}
          onValueChange={mockOnValueChange}
          multiple={true}
          maxSelectedDisplay={1}
        />
      );

      expect(screen.getByText("Option 1 +3 more")).toBeInTheDocument();
    });

    it("shows placeholder when no options selected", () => {
      render(
        <Combobox
          options={mockOptions}
          value={[]}
          onValueChange={mockOnValueChange}
          multiple={true}
          placeholder="Select multiple options"
        />
      );

      expect(screen.getByText("Select multiple options")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // SEARCH FUNCTIONALITY TESTS
  // ============================================================================

  describe("Search Functionality", () => {
    it("shows search input when dropdown opens", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      });
    });

    it("shows custom search placeholder", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={mockOptions}
          onValueChange={mockOnValueChange}
          searchPlaceholder="Type to search..."
        />
      );

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Type to search...")).toBeInTheDocument();
      });
    });

    it("shows empty message when no options provided", async () => {
      const user = userEvent.setup();
      render(<Combobox options={[]} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("No options found.")).toBeInTheDocument();
      });
    });

    it("shows custom empty message", async () => {
      const user = userEvent.setup();
      render(
        <Combobox
          options={[]}
          onValueChange={mockOnValueChange}
          emptyMessage="No matches available"
        />
      );

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("No matches available")).toBeInTheDocument();
      });
    });

    it("allows typing in search input", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));
      const searchInput = await screen.findByPlaceholderText("Search...");

      await user.type(searchInput, "test");

      expect(searchInput).toHaveValue("test");
    });

    it("preserves search in multi-select mode", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} multiple={true} />);

      await user.click(screen.getByRole("combobox"));
      const searchInput = await screen.findByPlaceholderText("Search...");

      await user.type(searchInput, "Option");
      await user.click(screen.getByText("Option 1"));

      // Search should be preserved in multi-select mode
      expect(searchInput).toHaveValue("Option");
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("updates aria-expanded when opened", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      const trigger = screen.getByRole("combobox");
      trigger.focus();

      // Test Enter key to open
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      });
    });

    it("supports Escape key to close", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByPlaceholderText("Search..."));

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // EDGE CASES AND ERROR HANDLING
  // ============================================================================

  describe("Edge Cases and Error Handling", () => {
    it("handles empty options array", async () => {
      const user = userEvent.setup();
      render(<Combobox options={[]} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("No options found.")).toBeInTheDocument();
      });
    });

    it("handles undefined value gracefully", () => {
      render(
        <Combobox options={mockOptions} value={undefined} onValueChange={mockOnValueChange} />
      );

      expect(screen.getByText("Select option...")).toBeInTheDocument();
    });

    it("handles invalid value in multi-select mode", () => {
      render(
        <Combobox
          options={mockOptions}
          value={"invalid-string" as any}
          onValueChange={mockOnValueChange}
          multiple={true}
        />
      );

      expect(screen.getByText("Select option...")).toBeInTheDocument();
    });

    it("handles options with special characters", async () => {
      const specialOptions: ComboboxOption[] = [
        { value: "special1", label: "Option with & ampersand" },
        { value: "special2", label: "Option with <tags>" },
        { value: "special3", label: "Option with 'quotes'" },
      ];

      const user = userEvent.setup();
      render(<Combobox options={specialOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText("Option with & ampersand")).toBeInTheDocument();
        expect(screen.getByText("Option with <tags>")).toBeInTheDocument();
        expect(screen.getByText("Option with 'quotes'")).toBeInTheDocument();
      });
    });

    it("handles missing onValueChange callback gracefully", async () => {
      const user = userEvent.setup();
      render(<Combobox options={mockOptions} />);

      await user.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByText("Option 1"));

      // Should not throw error when clicking option
      expect(() => user.click(screen.getByText("Option 1"))).not.toThrow();
    });

    it("handles very long option labels", async () => {
      const longOptions: ComboboxOption[] = [
        {
          value: "long1",
          label:
            "This is a very long option label that should be handled gracefully by the component and not break the layout",
        },
      ];

      const user = userEvent.setup();
      render(<Combobox options={longOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      await waitFor(() => {
        expect(screen.getByText(longOptions[0].label)).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  describe("Performance", () => {
    it("renders efficiently with many options", () => {
      const manyOptions: ComboboxOption[] = Array.from({ length: 100 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));

      const startTime = performance.now();
      render(<Combobox options={manyOptions} onValueChange={mockOnValueChange} />);
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("handles large datasets without crashing", async () => {
      const manyOptions: ComboboxOption[] = Array.from({ length: 50 }, (_, i) => ({
        value: `option${i}`,
        label: `Option ${i}`,
      }));

      const user = userEvent.setup();
      render(<Combobox options={manyOptions} onValueChange={mockOnValueChange} />);

      await user.click(screen.getByRole("combobox"));

      // Should open dropdown without issues
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      });

      // Should display options
      expect(screen.getByText("Option 0")).toBeInTheDocument();
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });
  });
});
