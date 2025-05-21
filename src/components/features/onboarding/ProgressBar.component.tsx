import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react";
import { ValidationErrors } from "@/types/onboarding.type";

interface ProgressBarProps {
  steps: { label: string; component: any }[];
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
    <div className="w-full p-4">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const hasError = errorSteps.includes(index);
          
          return (
            <div
              key={step.label}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200",
                isCurrent && "bg-gradient-to-r from-primary/10 to-secondary/10",
                isCompleted && "bg-gradient-to-r from-primary/5 to-secondary/5",
                hasError && "bg-red-500/10",
                "hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20"
              )}
              onClick={() => onStepClick?.(index)}
            >
              {/* Step Number */}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
                  isCurrent && "bg-gradient-to-r from-primary to-secondary text-white",
                  isCompleted && "bg-gradient-to-r from-primary to-secondary text-white",
                  !isCurrent && !isCompleted && "bg-muted text-muted-foreground",
                  hasError && "bg-red-500 text-white"
                )}
              >
                {isCompleted ? (
                  <Check size={16} weight="bold" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Label */}
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    isCompleted && "text-primary",
                    !isCurrent && !isCompleted && "text-muted-foreground",
                    hasError && "text-red-500"
                  )}
                >
                  {step.label}
                </span>
                {hasError && (
                  <span className="text-xs text-red-500 mt-1">
                    Please fix errors in this step
                  </span>
                )}
              </div>

          
            </div>
          );
        })}
      </div>
    </div>
  );
} 