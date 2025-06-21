import { Button } from "@/ui/Button.ui";
import { ArrowRight } from "@phosphor-icons/react";

interface SignUpFormButtonProps {
  isLoading: boolean;
  isFormValid: boolean;
}

export default function SignUpFormButton({ isLoading, isFormValid }: SignUpFormButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading || !isFormValid}
      className="w-full bg-gradient-to-r from-primary to-secondary text-white transition-all hover:shadow-md dark:from-blue-500 dark:to-blue-600"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></span>
          <span>Creating account...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>Create account</span>
          <ArrowRight weight="bold" className="h-4 w-4" />
        </div>
      )}
    </Button>
  );
}
