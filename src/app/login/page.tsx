import LoginContent from "@/components/features/auth/LoginContent";
import { Suspense } from "react";


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
} 