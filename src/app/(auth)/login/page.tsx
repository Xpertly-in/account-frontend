import { Metadata } from "next";
import { LoginForm } from "@/components/features/auth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Login | Xpertly",
  description: "Sign in to your Xpertly account to find and connect with the best CAs for your needs",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background py-12">
      {/* Background decorative pattern */}
      <div className="absolute inset-0 overflow-hidden bg-grid-pattern dark:opacity-30">
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl dark:from-primary/10 dark:to-secondary/10"></div>
        <div className="absolute bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 blur-3xl dark:from-accent/10 dark:to-secondary/10"></div>
      </div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary p-2 text-white dark:from-blue-500 dark:to-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Xpertly</h1>
          <p className="text-sm text-muted-foreground dark:text-blue-100/70">Connect with trusted CAs</p>
        </div>
        
        <LoginForm />
      </div>
      
      <Toaster position="top-center" richColors expand closeButton />
    </div>
  );
} 