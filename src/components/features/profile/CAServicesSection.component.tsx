import { Button } from "@/ui/Button.ui";
import { Check, ArrowRight } from "@phosphor-icons/react";
import { CAServicesSectionProps } from "@/types/ca.type";

export const CAServicesSection = ({ services, isLoaded }: CAServicesSectionProps) => {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white shadow-lg p-4 md:p-6 dark:bg-gray-800/95 dark:border-blue-900/40 dark:shadow-blue-900/5 transform transition-all duration-700 delay-400 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/70 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 dark:text-white flex items-center">
        <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mr-2 md:mr-3"></div>
        Services Offered
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {services.map((service, index) => (
          <div
            key={service}
            className="flex items-center p-2 md:p-3 rounded-lg border border-blue-50 bg-gradient-to-r from-blue-50/70 to-transparent hover:from-blue-100/80 hover:border-blue-100 transition-all duration-300 dark:border-blue-900/30 dark:from-blue-900/30 dark:to-transparent dark:hover:from-blue-800/40 group"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white shadow-sm shadow-blue-200/50 mr-2 md:mr-3 group-hover:shadow-md group-hover:shadow-blue-300/50 transition-all duration-300 dark:bg-blue-900/80 dark:shadow-none">
              <Check
                className="h-3 w-3 md:h-4 md:w-4 text-blue-600 dark:text-blue-300"
                weight="bold"
              />
            </div>
            <span className="text-gray-700 font-medium text-sm md:text-base dark:text-white">
              {service}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 md:mt-8">
        <Button
          variant="outline"
          className="w-full border-blue-200 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 text-blue-700 hover:text-blue-800 font-medium transition-all duration-300 hover:border-blue-300 shadow-sm hover:shadow-md py-2 md:py-6 dark:from-blue-900/40 dark:to-blue-900/20 dark:hover:from-blue-800/50 dark:hover:to-blue-800/30 dark:border-blue-800/50 dark:text-blue-100 dark:hover:text-blue-50 group"
        >
          <span className="flex items-center gap-2">
            <span>Request Service</span>
            <ArrowRight
              className="h-3 w-3 md:h-4 md:w-4 transform group-hover:translate-x-1 transition-transform duration-300"
              weight="bold"
            />
          </span>
        </Button>
      </div>
    </div>
  );
};
