import Link from "next/link";
import { Logo } from "@/components/ui/Logo.component";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle.component";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 border-b border-border shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:bg-background/90 dark:border-border/50">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="sm" />
            </Link>
            <nav className="hidden md:flex items-center ml-8 space-x-8">
              <Link
                href="/search"
                className="font-medium hover:text-primary transition-colors text-foreground/90 hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
              >
                Find CA
              </Link>
              <Link
                href="/about"
                className="font-medium hover:text-primary transition-colors text-foreground/90 hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-medium hover:text-primary transition-colors text-foreground/90 hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/ca/login">
              <Button
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/30 dark:border-primary/30 dark:text-primary/90 dark:hover:bg-primary/20 dark:hover:text-primary dark:hover:border-primary/40 py-2 px-4 rounded-lg transition-colors"
              >
                CA Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
