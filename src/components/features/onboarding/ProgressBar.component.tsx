import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react";
import { ValidationErrors } from "@/types/onboarding.type";

interface ProgressBarProps {
  steps: { label: string; subtitle?: string; component: any }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  validationErrors?: ValidationErrors;
  errorSteps?: number[];
}

export function ProgressBar({ 
  steps, 
  currentStep, 
  onStepClick,
  validationErrors,
  errorSteps = []
}: ProgressBarProps) {
  return (
    <div className="w-full flex flex-col gap-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const hasError = errorSteps.includes(index);
          return (
            <div
              key={step.label}
              className={cn(
              "relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300",
              "border border-border/50",
              isCurrent && "bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border-primary/30 shadow-md",
              isCompleted && "bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent border-primary/20",
              hasError && "bg-red-500/5 border-red-500/30",
              "dark:border-blue-800/30 dark:bg-gray-900/95",
              "z-10"
              )}
              onClick={() => onStepClick?.(index)}
            tabIndex={0}
            aria-current={isCurrent ? "step" : undefined}
            role="button"
            >
            {/* Step Number Circle */}
              <div
                className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                "ring-4 ring-background",
                isCurrent && "bg-gradient-to-br from-primary to-secondary text-white ring-primary/20",
                isCompleted && "bg-gradient-to-br from-primary to-secondary text-white ring-primary/20",
                !isCurrent && !isCompleted && "bg-muted text-muted-foreground ring-muted/20",
                hasError && "bg-red-500 text-white ring-red-500/20"
                )}
              >
                {isCompleted ? (
                <Check size={18} weight="bold" className="animate-in fade-in zoom-in" />
                ) : (
                <span className={cn(
                  "animate-in fade-in",
                  isCurrent && "text-white font-semibold"
                )}>
                  {index + 1}
                </span>
                )}
              </div>

            {/* Step Content */}
            <div className="flex flex-col gap-1">
                <span
                  className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                    isCurrent && "text-primary",
                    isCompleted && "text-primary",
                    !isCurrent && !isCompleted && "text-muted-foreground",
                    hasError && "text-red-500"
                  )}
                >
                  {step.label}
                </span>
              {step.subtitle && (
                <span className={cn(
                  "text-xs transition-colors duration-200",
                  isCurrent && "text-primary/80",
                  isCompleted && "text-primary/70",
                  !isCurrent && !isCompleted && "text-muted-foreground/70",
                  hasError && "text-red-500/80"
                )}>
                  {step.subtitle}
                </span>
              )}
                {hasError && (
                <span className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-bottom-1">
                    Please fix errors in this step
                  </span>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
} 