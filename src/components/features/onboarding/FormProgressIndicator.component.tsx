"use client";

interface FormStep {
  id: string;
  // Add other necessary fields if needed, e.g., title
}

interface FormProgressIndicatorProps {
  steps: FormStep[];
  currentStepIndex: number;
}

export default function FormProgressIndicator({
  steps,
  currentStepIndex,
}: FormProgressIndicatorProps) {
  return (
    <div className="mb-6 flex justify-center px-4 pt-6 sm:px-6">
      <div className="flex w-full max-w-md items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                index <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-colors ${
                  index < currentStepIndex ? "bg-primary" : "bg-muted"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
