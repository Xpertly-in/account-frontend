import Link from "next/link";

interface SignUpFormFooterProps {
  hideContainer?: boolean;
}

export default function SignUpFormFooter({ hideContainer = false }: SignUpFormFooterProps) {
  if (hideContainer) {
    return null;
  }

  return (
    <>
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-border dark:border-blue-800/50"></div>
        <span className="mx-3 flex-shrink text-xs text-muted-foreground dark:text-blue-100/50">
          OR
        </span>
        <div className="flex-grow border-t border-border dark:border-blue-800/50"></div>
      </div>

      <div className="text-center text-sm text-muted-foreground dark:text-blue-100/70">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition-colors hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign in
        </Link>
      </div>
    </>
  );
}
