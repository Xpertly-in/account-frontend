import Link from "next/link";
import { Logo } from "@/components/ui/Logo.component";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="sm" />
            </Link>
            <p className="text-gray-600">
              Find and connect with verified Chartered Accountants in your area.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Find CA
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">For CAs</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/ca/register"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Register as CA
                </Link>
              </li>
              <li>
                <Link
                  href="/ca/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  CA Login
                </Link>
              </li>
              <li>
                <Link
                  href="/ca/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Xpertly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
