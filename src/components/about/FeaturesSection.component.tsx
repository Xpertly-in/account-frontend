"use client";

import { Container } from "@/components/layout/Container.component";
import { ShieldCheck, Lightning, Funnel } from "@phosphor-icons/react";

export default function FeaturesSection() {
  return (
    <Container className="py-16 md:py-24">
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-300 inline-block">
          Why Choose Xpertly?
        </h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group dark:bg-gray-800 dark:shadow-blue-900/10">
            <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-blue-600 dark:to-blue-500 p-6">
              <div className="bg-white dark:bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8 text-primary dark:text-blue-400" weight="bold" />
              </div>
            </div>
            <div className="p-6 flex-1 border-b-4 border-primary dark:border-blue-500">
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                Verified Professionals
              </h3>
              <p className="text-gray-700 text-lg dark:text-gray-300">
                All CAs on our platform are verified with proper credentials and expertise.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group dark:bg-gray-800 dark:shadow-blue-900/10">
            <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-blue-600 dark:to-blue-500 p-6">
              <div className="bg-white dark:bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                <Lightning className="h-8 w-8 text-primary dark:text-blue-400" weight="bold" />
              </div>
            </div>
            <div className="p-6 flex-1 border-b-4 border-primary dark:border-blue-500">
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                Direct Connect
              </h3>
              <p className="text-gray-700 text-lg dark:text-gray-300">
                Connect directly with CAs without any intermediaries or hidden fees.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group dark:bg-gray-800 dark:shadow-blue-900/10">
            <div className="bg-gradient-to-r from-primary to-blue-500 dark:from-blue-600 dark:to-blue-500 p-6">
              <div className="bg-white dark:bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                <Funnel className="h-8 w-8 text-primary dark:text-blue-400" weight="bold" />
              </div>
            </div>
            <div className="p-6 flex-1 border-b-4 border-primary dark:border-blue-500">
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                Specialized Services
              </h3>
              <p className="text-gray-700 text-lg dark:text-gray-300">
                Find CAs specializing in various fields from taxation to audit and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
