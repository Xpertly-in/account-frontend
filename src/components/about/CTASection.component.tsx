"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container.component";
import { Button } from "@/ui/Button.ui";

export const CTASection = () => {
  return (
    <div className="bg-gradient-to-br from-primary via-blue-700 to-blue-600 dark:from-blue-800 dark:via-blue-700 dark:to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-200 rounded-full filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300 to-green-200 rounded-full filter blur-3xl opacity-10 translate-y-1/3 -translate-x-1/2" />

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
                className="bg-white text-primary hover:bg-blue-50 hover:text-blue-800 px-10 py-7 text-xl font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-blue-100 dark:text-blue-800 dark:hover:bg-white"
              >
                <Link href="/xpert/register">Register as Xpert</Link>
              </Button>
            </div>
          </div>
        </section>
      </Container>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30" />
    </div>
  );
};
