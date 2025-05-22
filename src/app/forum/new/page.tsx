// Server Component - no client hooks here
import { Suspense } from "react";
import ClientNewPost from "./ClientNewPost"

export default function NewPostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
     <ClientNewPost />;
    </Suspense>
  );
}
