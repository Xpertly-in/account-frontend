"use client";

interface FormStepTitleProps {
  title: string;
  subtitle?: string;
  currentStepIndex: number;
  totalSteps: number;
}

export default function FormStepTitle({
  title,
  subtitle,
  currentStepIndex,
  totalSteps,
}: FormStepTitleProps) {
  // Don't render title/subtitle for the welcome step (index 0)
  if (currentStepIndex === 0) {
    return null;
  }

  return (
    <div className="mb-6 text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {/* Render subtitle if it exists */}
      {subtitle && <p className="text-sm text-muted-foreground -mt-1 mb-1">{subtitle}</p>}
      <p className="text-sm text-muted-foreground">
        Step {currentStepIndex} of {totalSteps - 1}
      </p>
    </div>
  );
}
