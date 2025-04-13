"use client";

import { Container } from "@/components/layout/Container.component";
import { SearchBar } from "@/components/features/search";
import { CACard } from "@/components/features/common";
import { mockCAs } from "@/lib/utils/ca.utils";
import { useState } from "react";

export default function Search() {
  const filteredCAs = mockCAs;

  return (
    <div className="relative bg-gradient-to-b from-blue-50/70 via-blue-50/30 to-background min-h-screen py-8 md:py-12 lg:py-16 dark:from-blue-900/40 dark:via-blue-800/20 dark:to-gray-900/80">
      {/* Decorative glowing elements for dark mode */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 dark:block hidden"></div>
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl opacity-60 -translate-x-1/2 dark:block hidden"></div>

      <Container className="relative z-10 max-w-7xl">
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-white">
              Find a CA
            </h1>
            <p className="text-lg text-muted-foreground dark:text-blue-100/80 max-w-2xl">
              Connect with verified CAs in your area for all your financial needs
            </p>
          </div>

          <div className="w-full">
            <SearchBar />
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCAs.map(ca => (
              <CACard key={ca.id} ca={ca} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
