import { SearchBar } from "@/components/features/SearchBar.component";
import { Container } from "@/components/layout/Container.component";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300 to-green-200 rounded-full filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/2"></div>

        <Container className="py-20 md:py-28 lg:py-32 relative z-10">
          <section className="space-y-8 md:space-y-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Find experts that match your needs
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto">
                Find Your Perfect{" "}
                <span className="relative">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Chartered Accountant
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-blue-100 opacity-50 rounded-lg -z-10"></span>
                </span>
              </h1>
              <p className="max-w-2xl text-xl text-gray-600 md:text-2xl">
                Connect with verified CAs in your area for all your financial needs
              </p>
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl">
              <SearchBar />
            </div>
          </section>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-16 md:py-24">
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 inline-block">
            Why Choose Xpertly?
          </h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
              <div className="bg-gradient-to-r from-primary to-blue-500 p-6">
                <div className="bg-white rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6 flex-1 border-t-0 border-b-4 border-l-0 border-r-0 border-primary">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Verified Professionals</h3>
                <p className="text-gray-700 text-lg">
                  All CAs on our platform are verified with proper credentials and expertise.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
              <div className="bg-gradient-to-r from-primary to-blue-500 p-6">
                <div className="bg-white rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6 flex-1 border-t-0 border-b-4 border-l-0 border-r-0 border-primary">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Direct Connect</h3>
                <p className="text-gray-700 text-lg">
                  Connect directly with CAs without any intermediaries or hidden fees.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
              <div className="bg-gradient-to-r from-primary to-blue-500 p-6">
                <div className="bg-white rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6 flex-1 border-t-0 border-b-4 border-l-0 border-r-0 border-primary">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Specialized Services</h3>
                <p className="text-gray-700 text-lg">
                  Find CAs specializing in various fields from taxation to audit and beyond.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary via-blue-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
        <Container className="py-20 md:py-28 relative z-10">
          <section>
            <div className="max-w-3xl mx-auto text-center">
              <span className="bg-white/20 text-white uppercase text-sm font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
                For Professionals
              </span>
              <h2 className="text-4xl font-bold md:text-5xl text-white mb-4">
                Are you a Chartered Accountant?
              </h2>
              <p className="mt-4 text-xl text-blue-100 md:text-2xl max-w-2xl mx-auto">
                Register on our platform to expand your client base and grow your practice.
              </p>
              <div className="mt-10">
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-blue-50 hover:text-blue-800 px-10 py-7 text-xl font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href="/ca/register">Register as CA</Link>
                </Button>
              </div>
            </div>
          </section>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
      </div>
    </>
  );
}
