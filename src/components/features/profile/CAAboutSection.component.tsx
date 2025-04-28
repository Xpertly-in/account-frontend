import { CAAboutSectionProps } from "@/types/ca.type";

export const CAAboutSection = ({ about, isLoaded }: CAAboutSectionProps) => {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white shadow-lg p-4 md:p-6 dark:bg-gray-800/95 dark:border-blue-900/40 dark:shadow-blue-900/5 transform transition-all duration-700 delay-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/70 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-5 dark:text-white flex items-center">
        <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mr-2 md:mr-3"></div>
        About
      </h2>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent w-32 rounded-l-lg -ml-4 md:-ml-6 opacity-60 dark:from-blue-900/30 dark:to-transparent"></div>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base relative z-10 dark:text-blue-100">
          {about}
        </p>
      </div>
    </div>
  );
};
