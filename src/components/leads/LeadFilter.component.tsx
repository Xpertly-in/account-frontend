import { useState } from "react";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";
import { Button } from "@/ui/Button.ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/Card.ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/SelectEnhanced.ui";

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
  const resetFilters = () => {
    setCurrentFilter({});
    setCurrentSort({ field: "timestamp", direction: "desc" });
  };

  return (
    <Card className="rounded-xl border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 pb-4 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filter Leads
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Set filters to narrow down the lead list
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <Select
              onValueChange={value =>
                setCurrentFilter({
                  ...currentFilter,
                  status: value ? [value as any] : undefined,
                })
              }
              value={currentFilter.status?.[0] || ""}
            >
              <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Urgency</label>
            <Select
              onValueChange={value =>
                setCurrentFilter({
                  ...currentFilter,
                  urgency: value ? [value as any] : undefined,
                })
              }
              value={currentFilter.urgency?.[0] || ""}
            >
              <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <SelectItem value="">All Urgencies</SelectItem>
                <SelectItem value="Immediately">Immediately</SelectItem>
                <SelectItem value="Within a week">Within a week</SelectItem>
                <SelectItem value="This month">This month</SelectItem>
                <SelectItem value="Just exploring">Just exploring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
            <Select
              onValueChange={(value: any) => setCurrentSort({ ...currentSort, field: value })}
              value={currentSort.field}
            >
              <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <SelectItem value="timestamp">Date</SelectItem>
                <SelectItem value="urgency">Urgency</SelectItem>
                <SelectItem value="location.city">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
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
