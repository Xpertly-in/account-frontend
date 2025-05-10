import { Suspense } from "react";
import CALoginContent from "@/components/features/auth/CALoginContent";

export default function CALoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <CALoginContent />
    </Suspense>
  );
}
