import AuthTabs from "@/components/features/auth/AuthTabs.component";
import { Container } from "@/components/layout/Container.component";
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
      <Container className="flex min-h-screen items-center justify-center py-12">
        <AuthTabs defaultTab="login" showCALoginButton={true} />
      </Container>
    </Suspense>
  );
} 