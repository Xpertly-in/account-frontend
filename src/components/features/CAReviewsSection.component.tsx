import { Button } from "@/components/ui/button";
import { Star, ChatCircleText, ArrowRight } from "@phosphor-icons/react";
import { CAReviewsSectionProps } from "@/lib/types/ca.types";

export const CAReviewsSection = ({ rating, reviews, isLoaded }: CAReviewsSectionProps) => {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white shadow-lg p-4 md:p-6 dark:bg-gray-800/95 dark:border-blue-900/40 dark:shadow-blue-900/5 transform transition-all duration-700 delay-500 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/70 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-5">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <div className="h-6 md:h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full mr-2 md:mr-3"></div>
          Client Reviews
        </h2>
        <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-transparent rounded-full border border-yellow-100 dark:from-yellow-900/20 dark:to-transparent dark:border-yellow-800/30 w-fit">
          <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 mr-2" weight="fill" />
          <span className="font-semibold text-gray-800 dark:text-white">{rating}</span>
          <span className="text-gray-500 ml-1.5 dark:text-gray-400 text-sm">({reviews})</span>
        </div>
      </div>

      <div className="py-6 md:py-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50 flex items-center justify-center mb-3 md:mb-4 dark:bg-blue-900/40">
          <ChatCircleText className="h-8 w-8 md:h-10 md:w-10 text-blue-300" weight="light" />
        </div>
        <p className="text-gray-500 mb-3 max-w-sm text-sm md:text-base dark:text-blue-200/70">
          Detailed reviews will be available soon
        </p>
        <Button
          variant="link"
          className="text-blue-600 dark:text-blue-300 font-medium group text-sm md:text-base"
        >
          <span className="flex items-center">
            Be the first to leave a review
            <ArrowRight
              className="h-3 w-3 md:h-4 md:w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              weight="bold"
            />
          </span>
        </Button>
      </div>
    </div>
  );
};
