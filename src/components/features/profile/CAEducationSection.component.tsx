import { GraduationCap, Calendar, Award } from "@phosphor-icons/react";
import { CAEducationSectionProps } from "@/types/ca.type";

export const CAEducationSection = ({ educations, isLoaded }: CAEducationSectionProps) => {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white shadow-lg p-4 md:p-6 dark:bg-gray-800/95 dark:border-blue-900/40 dark:shadow-blue-900/5 transform transition-all duration-700 delay-400 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/70 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 dark:text-white flex items-center">
        <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mr-2 md:mr-3"></div>
        Education
      </h2>

      <div className="space-y-6">
        {educations.map((education) => (
          <div
            key={education.id}
            className="relative pl-6 border-l-2 border-blue-100 dark:border-blue-800/40"
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400"></div>
            
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
                  {education.degree}
                </h3>
                {education.grade && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                    Grade: {education.grade}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <GraduationCap className="h-4 w-4" weight="fill" />
                <span>{education.instituteName}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Award className="h-4 w-4" weight="fill" />
                <span>{education.fieldOfStudy}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4" weight="fill" />
                <span>
                  {education.startDate} - {education.isCurrent ? "Present" : education.endDate}
                </span>
              </div>

              {education.description && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className="whitespace-pre-line">{education.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 