import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";
import { useAllFilterOptions } from "@/services/leads.service";
import { Button } from "@/ui/Button.ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/Card.ui";
import { Combobox, type ComboboxOption } from "@/ui/Combobox.ui";

interface LeadFilterProps {
  currentFilter: LeadFilter;
  setCurrentFilter: (filter: LeadFilter) => void;
  currentSort: LeadSort;
  setCurrentSort: (sort: LeadSort) => void;
  onClose: () => void;
}

export const LeadFilterComponent = ({
  currentFilter,
  setCurrentFilter,
  currentSort,
  setCurrentSort,
  onClose,
}: LeadFilterProps) => {
  // Base filter without the specific filter being calculated
  const baseFilter = {
    urgency: currentFilter.urgency,
    services: currentFilter.services,
    location: currentFilter.location,
  };

  const { statusOptions, urgencyOptions, servicesOptions, locationOptions, isLoading } =
    useAllFilterOptions(baseFilter);

  // Transform filter options to ComboboxOption format
  const statusComboboxOptions: ComboboxOption[] = statusOptions.map(option => ({
    value: option.value,
    label: option.label,
    count: option.count,
  }));

  const urgencyComboboxOptions: ComboboxOption[] = urgencyOptions.map(option => ({
    value: option.value,
    label: option.label,
    count: option.count,
  }));

  const servicesComboboxOptions: ComboboxOption[] = servicesOptions.map(option => ({
    value: option.value,
    label: option.label,
    count: option.count,
  }));

  const locationComboboxOptions: ComboboxOption[] = locationOptions.map(option => ({
    value: option.value,
    label: option.label,
    count: option.count,
  }));

  // Sort options for better UX
  const sortOptions: ComboboxOption[] = [
    { value: "timestamp", label: "Date" },
    { value: "urgency", label: "Urgency" },
  ];

  const resetFilters = () => {
    setCurrentFilter({});
    setCurrentSort({ field: "timestamp", direction: "desc" });
  };

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 pb-4 dark:border-gray-700 pt-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filter Leads
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Set filters to narrow down the lead list
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Show dependent filtering info when filters are applied */}
        {(currentFilter.status?.length ||
          currentFilter.urgency?.length ||
          currentFilter.services?.length ||
          currentFilter.location?.length) && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <p className="font-medium">Smart Filtering Active</p>
            <p className="text-xs opacity-80">
              Filter options are updated based on your current selections to show only available
              combinations.
            </p>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <Combobox
              options={statusComboboxOptions}
              value={currentFilter.status || []}
              onValueChange={value =>
                setCurrentFilter({
                  ...currentFilter,
                  status: Array.isArray(value) && value.length > 0 ? (value as any) : undefined,
                })
              }
              placeholder={isLoading ? "Updating options..." : "Select statuses..."}
              searchPlaceholder="Search status..."
              disabled={isLoading}
              multiple={true}
              maxSelectedDisplay={2}
              className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Urgency</label>
            <Combobox
              options={urgencyComboboxOptions}
              value={currentFilter.urgency || []}
              onValueChange={value =>
                setCurrentFilter({
                  ...currentFilter,
                  urgency: Array.isArray(value) && value.length > 0 ? (value as any) : undefined,
                })
              }
              placeholder={isLoading ? "Updating options..." : "Select urgencies..."}
              searchPlaceholder="Search urgency..."
              disabled={isLoading}
              multiple={true}
              maxSelectedDisplay={2}
              className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Services</label>
            <Combobox
              options={servicesComboboxOptions}
              value={currentFilter.services || []}
              onValueChange={value =>
                setCurrentFilter({
                  ...currentFilter,
                  services: Array.isArray(value) && value.length > 0 ? value : undefined,
                })
              }
              placeholder={isLoading ? "Updating options..." : "Select services..."}
              searchPlaceholder="Search services..."
              disabled={isLoading}
              multiple={true}
              maxSelectedDisplay={2}
              className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <Combobox
              options={locationComboboxOptions}
              value={currentFilter.location || []}
              onValueChange={value =>
                setCurrentFilter({
                  ...currentFilter,
                  location: Array.isArray(value) && value.length > 0 ? value : undefined,
                })
              }
              placeholder={isLoading ? "Updating options..." : "Select cities..."}
              searchPlaceholder="Search cities..."
              disabled={isLoading}
              multiple={true}
              maxSelectedDisplay={2}
              className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
            <Combobox
              options={sortOptions}
              value={currentSort.field}
              onValueChange={value => setCurrentSort({ ...currentSort, field: value as any })}
              placeholder="Select sort option..."
              searchPlaceholder="Search sort options..."
              multiple={false}
              className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-lg border-gray-200 text-sm dark:border-gray-700"
          onClick={resetFilters}
        >
          Reset
        </Button>
        <Button
          size="sm"
          className="h-9 rounded-lg bg-blue-600 text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={onClose}
        >
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
};
