import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/features/auth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Reset Password | Xpertly",
  description: "Reset your Xpertly account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background py-12">
      {/* Main content */}
      <div className="z-10 w-full max-w-md px-4">
        <ForgotPasswordForm />
      </div>
      <Toaster position="top-center" richColors expand closeButton />
    </div>
  );
}
