import { Skeleton } from "@/ui/Skeleton.ui";

export const LeadSkeleton = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* Status Indicator Bar */}
      <Skeleton className="h-1 w-full rounded-full mb-4 sm:mb-6" />

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-32 sm:w-40 mb-2" />
            <Skeleton className="h-4 w-24 sm:w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Content Section */}
      <div className="space-y-4 sm:space-y-5">
        {/* Services */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-xl" />
            <Skeleton className="h-4 w-24 sm:w-32" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-18 rounded-lg" />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-xl" />
            <Skeleton className="h-4 w-28 sm:w-36" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-32 sm:w-40" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-xl" />
            <Skeleton className="h-4 w-24 sm:w-32" />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-100 dark:border-gray-700">
        <Skeleton className="h-6 w-16 rounded-full" />
        <div className="flex gap-2 sm:gap-3">
          <Skeleton className="h-8 sm:h-9 w-20 rounded-xl" />
          <Skeleton className="h-8 sm:h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
