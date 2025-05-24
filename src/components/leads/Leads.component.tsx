"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";
import { leadsDataAtom, leadsLoadingAtom, fetchLeadsAtom } from "@/store/jotai/dashboard.store";
import { useAuth } from "@/store/context/Auth.provider";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { LeadCard } from "./LeadCard.component";
import { LeadFilterComponent } from "./LeadFilter.component";
import { LeadSkeleton } from "./LeadSkeleton.component";
import { LeadEmptyState } from "./LeadEmptyState.component";

export const LeadsComponent = () => {
  const { auth } = useAuth();

  // State from Jotai store
  const [leads] = useAtom(leadsDataAtom);
  const [isLoading] = useAtom(leadsLoadingAtom);
  const [, fetchLeads] = useAtom(fetchLeadsAtom);

  // Fetch leads with CA ID when component mounts
  useEffect(() => {
    if (auth.user) {
      fetchLeads(auth.user.id);
    }
  }, [auth.user, fetchLeads]);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<LeadFilter>({});
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentSort, setCurrentSort] = useState<LeadSort>({
    field: "timestamp",
    direction: "desc",
  });

  // Filter leads based on search term
  const filteredLeads =
    leads?.filter(
      lead =>
        lead?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead?.services?.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
        lead?.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-4">
      {/* Header with title and search */}
      <div className="rounded-xl bg-blue-50/80 p-4 shadow-sm dark:bg-blue-900/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Leads Management</h2>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlass className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-10 rounded-lg border-gray-200 pl-9 pr-9 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="h-10 gap-1 rounded-lg border-gray-200 bg-white px-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <FunnelSimple className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter section */}
      {showFilterMenu && (
        <LeadFilterComponent
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          currentSort={currentSort}
          setCurrentSort={setCurrentSort}
          onClose={() => setShowFilterMenu(false)}
        />
      )}

      {/* Leads content */}
      {isLoading ? (
        <LeadSkeleton />
      ) : filteredLeads.length === 0 ? (
        <LeadEmptyState searchTerm={searchTerm} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onLeadUpdate={() => auth.user && fetchLeads(auth.user.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
