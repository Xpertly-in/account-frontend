import { ExtendedSignUpFormData } from "@/types/auth.type";
import SignUpFormHeader from "./SignUpFormHeader.component";
import SignUpFormFields from "./SignUpFormFields.component";
import SignUpFormTerms from "./SignUpFormTerms.component";
import SignUpFormButton from "./SignUpFormButton.component";
import SignUpFormFooter from "./SignUpFormFooter.component";

interface SignUpFormContentProps {
  formData: ExtendedSignUpFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  hideContainer?: boolean;
  setFormData: React.Dispatch<React.SetStateAction<ExtendedSignUpFormData>>;
  isFormValid: boolean;
}

export default function SignUpFormContent({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  hideContainer = false,
  setFormData,
  isFormValid = false,
}: SignUpFormContentProps) {
  return (
    <>
      <SignUpFormHeader />

      <form onSubmit={handleSubmit} className="space-y-4">
        <SignUpFormFields formData={formData} handleChange={handleChange} />

        <SignUpFormTerms formData={formData} setFormData={setFormData} />

        <SignUpFormButton isLoading={isLoading} isFormValid={isFormValid} />

        <SignUpFormFooter hideContainer={hideContainer} />
      </form>
    </>
  );
}
