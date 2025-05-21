import { Card, CardContent, CardFooter, CardHeader } from "@/ui/Card.ui";
import { Skeleton } from "@/ui/Skeleton.ui";

export const LeadSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="rounded-xl border-gray-200 shadow-sm dark:border-gray-700">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/5 rounded-md" />
            <Skeleton className="mt-1 h-4 w-2/5 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Skeleton className="h-4 w-1/4 rounded-md" />
                <div className="mt-1 flex flex-wrap gap-1">
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-1/4 rounded-md" />
                <Skeleton className="mt-1 h-4 w-2/5 rounded-md" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
            <Skeleton className="h-7 w-16 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
