import { Container } from "@/components/layout/Container.component";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Trophy, Star, ChatCircleText, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { CAProfileHeroProps } from "@/lib/types/ca.types";

export const CAProfileHero = ({ ca, isLoaded, initials, city, state }: CAProfileHeroProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700 overflow-hidden">
      {/* Decorative patterns and effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30 top-0"></div>
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30 bottom-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent opacity-60 dark:from-blue-300/10"></div>

      <div
        className={`transform transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <Container className="py-8 md:py-16 lg:py-20 relative z-10 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
            {/* CA Avatar with premium styling and animation */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 to-blue-300/60 rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-all duration-300 scale-105 dark:from-blue-500/50 dark:to-blue-400/50"></div>
              <div className="relative flex h-28 w-28 md:h-40 md:w-40 items-center justify-center rounded-full bg-white text-2xl md:text-4xl font-bold text-primary border-4 border-white shadow-xl transform transition-all duration-500 group-hover:scale-105 dark:border-blue-500/30">
                {ca.imageUrl ? (
                  <img
                    src={ca.imageUrl}
                    alt={ca.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="bg-gradient-to-br from-blue-700 to-blue-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-200 font-extrabold">
                    {initials}
                  </span>
                )}
              </div>

              {/* Enhanced verification badge with animation */}
              {ca.verified && (
                <div className="absolute -right-1 -bottom-1 md:-right-2 md:-bottom-2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 p-0.5 text-white shadow-lg border-2 border-white dark:border-blue-900 transform transition-transform duration-300 group-hover:scale-110 z-10">
                  <Check weight="bold" size={16} className="md:w-5 md:h-5" />
                </div>
              )}
            </div>

            {/* CA Details with enhanced typography and layout */}
            <div className="text-center md:text-left text-white flex-1">
              <div
                className={`transform transition-all duration-700 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {/* Premium badge for verified CAs */}
                {ca.verified && (
                  <div className="mb-2 md:mb-3 inline-flex items-center bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20 dark:border-white/10">
                    <Check className="mr-1 h-3 w-3 md:mr-1.5 md:h-3.5 md:w-3.5" weight="bold" />
                    <span>Verified Professional</span>
                  </div>
                )}

                <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight bg-clip-text text-white">
                  {ca.name}
                </h1>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-3 md:mt-4">
                  {/* Location with enhanced icon */}
                  <div className="flex items-center justify-center md:justify-start text-blue-100">
                    <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-white/10 mr-2">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 text-blue-100" weight="fill" />
                    </div>
                    <span className="text-sm md:text-base">
                      {city}, {state}
                    </span>
                  </div>

                  {/* Experience with enhanced icon */}
                  <div className="flex items-center justify-center md:justify-start text-blue-100">
                    <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-white/10 mr-2">
                      <Trophy className="h-3 w-3 md:h-4 md:w-4 text-blue-100" weight="fill" />
                    </div>
                    <span className="text-sm md:text-base">{ca.experience} years experience</span>
                  </div>

                  {/* Rating with premium styling */}
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400/80 to-yellow-500/80 rounded-full px-2 md:px-3 py-1 md:py-1.5 border border-yellow-300/30 shadow-sm">
                      <Star className="h-3 w-3 md:h-4 md:w-4 text-white" weight="fill" />
                      <span className="font-semibold text-white text-sm md:text-base">
                        {ca.rating}
                      </span>
                      <span className="text-yellow-100 text-xs md:text-sm">({ca.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations with enhanced pill styling */}
              <div
                className={`mt-4 md:mt-6 flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2 transform transition-all duration-1000 delay-300 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {ca.specialization.map((spec, index) => (
                  <span
                    key={spec}
                    className="rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-300 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium text-white border border-white/10 shadow-sm transform hover:-translate-y-0.5"
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      animation: `fadeSlideIn 0.5s ease forwards ${300 + index * 100}ms`,
                    }}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Quick action buttons */}
              <div
                className={`mt-5 md:mt-8 flex flex-wrap justify-center md:justify-start gap-3 transform transition-all duration-1000 delay-500 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Button
                  asChild
                  size="default"
                  className="bg-white hover:bg-blue-50 text-primary font-medium transition-all shadow-md hover:shadow-lg py-2 px-4 md:py-6 group dark:bg-blue-950/50 dark:text-white dark:hover:bg-blue-900/60 dark:border dark:border-blue-800/60"
                >
                  <Link href={`/contact/${ca.id}`} className="flex items-center gap-2">
                    <ChatCircleText className="h-4 w-4 md:h-5 md:w-5" weight="bold" />
                    <span>Contact Now</span>
                    <ArrowRight
                      className="h-3 w-3 md:h-4 md:w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      weight="bold"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
