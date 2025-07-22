import { useState, useEffect } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container.component";
import { useProfilePictureUrl } from "@/hooks/useProfilePictureUrl";

interface CAProfileHeroProps {
  ca: {
    name: string;
    imageUrl?: string;
    verified: boolean;
  };
}

export const CAProfileHero = ({ ca }: CAProfileHeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { url: profileImageUrl } = useProfilePictureUrl(ca.imageUrl);

  // Helper function to get initials
  const getInitials = (name: string): string => {
    if (!name || name.trim() === "") return "?";
    const words = name
      .trim()
      .split(" ")
      .filter(word => word.length > 0);
    if (words.length === 0) return "?";
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const initials = getInitials(ca.name);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 overflow-hidden">
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
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
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
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full p-2 border-4 border-white shadow-lg transform transition-all duration-300 group-hover:scale-110 dark:border-blue-700">
                  <CheckCircle size={20} weight="fill" className="text-white" />
                </div>
              )}
            </div>

            {/* CA Information */}
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {ca.name}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl">
                Chartered Accountant with expertise in taxation, auditing, and financial consulting
              </p>

              {/* Verification Status */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                {ca.verified ? (
                  <>
                    <CheckCircle size={20} weight="fill" className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Verified CA</span>
                  </>
                ) : (
                  <span className="text-blue-200">Verification Pending</span>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-10"></div>
    </div>
  );
};
