import { ExtendedSignUpFormData } from "@/types/auth.type";
import { useGoogleAuth } from "@/store/context/GoogleAuth.provider";
import { GoogleButton } from "@/ui/GoogleButton.ui";
import { AuthDivider } from "@/ui/AuthDivider.ui";
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
  const { signIn: signInWithGoogle, isLoading: isGoogleLoading, error: googleError } = useGoogleAuth();

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-up error:", error);
    }
  };

  return (
    <>
      <SignUpFormHeader />

      <form onSubmit={handleSubmit} className="space-y-4">
        <SignUpFormFields formData={formData} handleChange={handleChange} />

        <SignUpFormTerms formData={formData} setFormData={setFormData} />

        <SignUpFormButton isLoading={isLoading} isFormValid={isFormValid} />

        <AuthDivider />

        <GoogleButton
          onClick={handleGoogleSignUp}
          isLoading={isGoogleLoading}
          error={googleError || undefined}
        >
          Sign up with Google
        </GoogleButton>

        <SignUpFormFooter hideContainer={hideContainer} />
      </form>
    </>
  );
}
