import { Button } from "@/ui/Button.ui";
import { Phone, EnvelopeSimple, Globe, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { CAContactInfoProps } from "@/types/ca.type";

export const CAContactInfo = ({ contactDetails, isLoaded, caId }: CAContactInfoProps) => {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white shadow-lg p-4 md:p-6 dark:bg-gray-800/95 dark:border-blue-900/40 dark:shadow-xl dark:shadow-blue-900/5 transform transition-all duration-700 delay-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/70 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 dark:text-white flex items-center">
        <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mr-2 md:mr-3"></div>
        Contact Information
      </h2>

      <div className="space-y-4 md:space-y-5">
        {/* Phone with enhanced styling */}
        <div className="flex items-start group">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50">
            <Phone
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-300"
              weight="fill"
            />
          </div>
          <div className="ml-3 md:ml-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-500 dark:text-blue-300">
              Phone
            </p>
            <p className="text-gray-800 font-medium mt-0.5 md:mt-1 text-sm md:text-base dark:text-white">
              {contactDetails.phone}
            </p>
          </div>
        </div>

        {/* Email with enhanced styling */}
        <div className="flex items-start group">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50">
            <EnvelopeSimple
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-300"
              weight="fill"
            />
          </div>
          <div className="ml-3 md:ml-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-500 dark:text-blue-300">
              Email
            </p>
            <p className="text-gray-800 font-medium mt-0.5 md:mt-1 text-sm md:text-base dark:text-white break-all">
              {contactDetails.email}
            </p>
          </div>
        </div>

        {/* Website with enhanced styling */}
        <div className="flex items-start group">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 dark:from-blue-900/40 dark:to-blue-800/40 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50">
            <Globe
              className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-300"
              weight="fill"
            />
          </div>
          <div className="ml-3 md:ml-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-500 dark:text-blue-300">
              Website
            </p>
            <p className="text-gray-800 font-medium mt-0.5 md:mt-1 text-sm md:text-base dark:text-white break-all">
              {contactDetails.website}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Button with enhanced styling */}
      <div className="mt-6 md:mt-8">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/20 py-2 md:py-6 border border-blue-500 dark:border-blue-600 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-500 group"
        >
          <Link href={`/contact/${caId}`} className="flex items-center justify-center gap-2">
            <span>Contact Now</span>
            <ArrowRight
              className="h-3 w-3 md:h-4 md:w-4 transform group-hover:translate-x-1 transition-transform duration-300"
              weight="bold"
            />
          </Link>
        </Button>
      </div>
    </div>
  );
};
