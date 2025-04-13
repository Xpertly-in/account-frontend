import Link from "next/link";
import { Logo } from "@/components/ui/Logo.component";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="sm" />
            </Link>
            <nav className="hidden md:flex items-center ml-8 space-x-8">
              <Link
                href="/search"
                className="font-medium hover:text-blue-600 transition-colors text-gray-700"
              >
                Find CA
              </Link>
              <Link
                href="/about"
                className="font-medium hover:text-blue-600 transition-colors text-gray-700"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-medium hover:text-blue-600 transition-colors text-gray-700"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link href="/ca/login">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 py-2 px-4 rounded-lg"
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
