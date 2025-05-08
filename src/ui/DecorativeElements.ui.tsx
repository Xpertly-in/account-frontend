export const DecorativeElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-300/30 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 dark:from-blue-500/20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/30 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/2 dark:from-blue-600/20 animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-green-300/20 to-transparent rounded-full blur-3xl opacity-40 dark:from-teal-500/10 animate-pulse-slow animation-delay-1000"></div>
    </div>
  );
};

export const AnimationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-pulse-slow {
        animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .animation-delay-1000 {
        animation-delay: 1s;
      }

      .animation-delay-2000 {
        animation-delay: 2s;
      }
    `}</style>
  );
};
