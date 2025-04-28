import { cn } from "@/helper/tw.helper";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", "max-w-7xl", className)}>
      {children}
    </div>
  );
}
