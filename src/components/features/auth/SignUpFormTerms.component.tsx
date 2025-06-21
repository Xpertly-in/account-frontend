"use client";

import Link from "next/link";
import { Checkbox } from "@/ui/Checkbox.ui";
import { ExtendedSignUpFormData } from "@/types/auth.type";

interface SignUpFormTermsProps {
  formData: ExtendedSignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<ExtendedSignUpFormData>>;
}

export default function SignUpFormTerms({ formData, setFormData }: SignUpFormTermsProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 pt-1">
        <Checkbox
          id="terms"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked: boolean) =>
            setFormData(prev => ({ ...prev, acceptTerms: checked }))
          }
          className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
        />
      </div>
      <div className="flex-grow">
        <label htmlFor="terms" className="text-xs text-muted-foreground dark:text-blue-100/70">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-primary underline-offset-2 hover:underline dark:text-blue-400"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary underline-offset-2 hover:underline dark:text-blue-400"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
    </div>
  );
}
