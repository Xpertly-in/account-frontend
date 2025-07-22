import React from "react";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Badge } from "@/ui/Badge.ui";
import {
  MagnifyingGlass,
  FunnelSimple,
  X,
  ChatCenteredText,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterToggle: () => void;
  onClearSearch: () => void;
  hasActiveFilters: boolean;
  filterCount: number;
  newCount: number;
  repliedCount: number;
  totalCount: number;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onFilterToggle,
  onClearSearch,
  hasActiveFilters,
  filterCount,
  newCount,
  repliedCount,
  totalCount,
  isLoading,
}) => {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-blue-600 sticky top-0 z-10 shadow-sm">
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        {/* Header Row with Better Spacing */}
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/xpert/dashboard")}
            className="p-2 text-white hover:bg-white/10 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:h-9 sm:w-9">
            <ChatCenteredText className="h-4 w-4 text-white sm:h-5 sm:w-5" weight="bold" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white sm:text-xl">Contact Requests</h1>
            <p className="text-emerald-100 text-xs sm:text-sm hidden sm:block">
              Manage customer inquiries
            </p>
          </div>
          {/* Elegant Inline Stats for Mobile */}
          <div className="flex items-center gap-2 text-white/90 text-xs sm:hidden">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
              <Clock className="h-3 w-3" />
              <span>{newCount}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
              <CheckCircle className="h-3 w-3" />
              <span>{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Desktop Stats - More Elegant */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 sm:mb-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-orange-200" />
              <span className="text-xl font-bold text-white">{newCount}</span>
            </div>
            <p className="text-xs text-emerald-100">New Requests</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-200" />
              <span className="text-xl font-bold text-white">{repliedCount}</span>
            </div>
            <p className="text-xs text-emerald-100">Replied</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ChatCenteredText className="h-4 w-4 text-blue-200" />
              <span className="text-xl font-bold text-white">{totalCount}</span>
            </div>
            <p className="text-xs text-emerald-100">Total</p>
          </div>
        </div>

        {/* Refined Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlass className="h-4 w-4 text-white/60" />
            </div>
            <Input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="pl-10 pr-10 h-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 text-sm rounded-xl"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white transition-colors"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onFilterToggle}
            disabled={isLoading}
            className="h-10 px-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/40 rounded-xl transition-all"
          >
            <FunnelSimple className="h-4 w-4" />
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5"
              >
                {filterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
