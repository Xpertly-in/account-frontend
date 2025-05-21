import { Briefcase, Calendar, MapPin, Building } from "@phosphor-icons/react";
import { CAExperienceSectionProps } from "@/types/ca.type";

export const CAExperienceSection = ({ experiences, isLoaded }: CAExperienceSectionProps) => {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white shadow-lg p-4 md:p-6 dark:bg-gray-800/95 dark:border-blue-900/40 dark:shadow-blue-900/5 transform transition-all duration-700 delay-400 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/70 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 dark:text-white flex items-center">
        <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mr-2 md:mr-3"></div>
        Professional Experience
      </h2>

      <div className="space-y-6">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="relative pl-6 border-l-2 border-blue-100 dark:border-blue-800/40"
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400"></div>
            
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
                  {experience.title}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {experience.employmentType}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Building className="h-4 w-4" weight="fill" />
                <span>{experience.companyName}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" weight="fill" />
                <span>{experience.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4" weight="fill" />
                <span>
                  {experience.startDate} - {experience.isCurrent ? "Present" : experience.endDate}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="whitespace-pre-line">{experience.description}</p>
              </div>

              {experience.recentService && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Recent Service:</span> {experience.recentService}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 