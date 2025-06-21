"use client";

import { Button } from "@/ui/Button.ui";

interface FormNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  isStepComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function FormNavigation({
  currentStepIndex,
  totalSteps,
  isStepComplete,
  onPrevious,
  onNext,
}: FormNavigationProps) {
  return (
    <div className="sticky bottom-0 mt-8 flex justify-between border-t border-border bg-card/95 p-4 backdrop-blur-sm sm:px-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        // Disable previous on the first step (welcome step)
        disabled={currentStepIndex === 0}
        className={`px-4 py-2 ${currentStepIndex === 0 ? "invisible" : "visible"}`} // Hide if first step
      >
        Previous
      </Button>
      <Button onClick={onNext} disabled={!isStepComplete} className="px-4 py-2">
        {currentStepIndex === totalSteps - 1 ? "Submit" : "Next"}
      </Button>
    </div>
  );
}
