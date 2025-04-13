import { Certificate, Buildings, Calendar, User } from "@phosphor-icons/react";
import { CAProfessionalDetailsProps } from "@/lib/types/ca.types";

export const CAProfessionalDetails = ({ additionalInfo, isLoaded }: CAProfessionalDetailsProps) => {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white shadow-lg p-4 md:p-6 dark:bg-gray-800/95 dark:border-blue-900/40 dark:shadow-xl dark:shadow-blue-900/5 transform transition-all duration-700 delay-500 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/70 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 dark:text-white flex items-center">
        <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mr-2 md:mr-3"></div>
        Professional Details
      </h2>

      <div className="space-y-4 md:space-y-5">
        {/* Qualification with enhanced styling */}
        <div className="flex items-start group">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50">
            <Certificate
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-300"
              weight="fill"
            />
          </div>
          <div className="ml-3 md:ml-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-500 dark:text-blue-300">
              Qualification
            </p>
            <p className="text-gray-800 font-medium mt-0.5 md:mt-1 text-sm md:text-base dark:text-white">
              {additionalInfo.qualification}
            </p>
          </div>
        </div>

        {/* Firm Name with enhanced styling */}
        <div className="flex items-start group">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50">
            <Buildings
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-300"
              weight="fill"
            />
          </div>
          <div className="ml-3 md:ml-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-500 dark:text-blue-300">
              Firm
            </p>
            <p className="text-gray-800 font-medium mt-0.5 md:mt-1 text-sm md:text-base dark:text-white">
              {additionalInfo.firmName}
            </p>
          </div>
        </div>

        {/* Member Since with enhanced styling */}
        <div className="flex items-start group">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50">
            <Calendar
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-300"
              weight="fill"
            />
          </div>
          <div className="ml-3 md:ml-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-500 dark:text-blue-300">
              Member Since
            </p>
            <p className="text-gray-800 font-medium mt-0.5 md:mt-1 text-sm md:text-base dark:text-white">
              {additionalInfo.memberSince}
            </p>
          </div>
        </div>

        {/* Clients with enhanced styling */}
        <div className="flex items-start group">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50">
            <User
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-300"
              weight="fill"
            />
          </div>
          <div className="ml-3 md:ml-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-500 dark:text-blue-300">
              Clients
            </p>
            <p className="text-gray-800 font-medium mt-0.5 md:mt-1 text-sm md:text-base dark:text-white">
              {additionalInfo.clients}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
