"use client";

import { Container } from "@/components/layout/Container.component";
import { SearchBar } from "@/components/features/SearchBar.component";
import { CACard } from "@/components/features/CACard.component";
import { mockCAs } from "@/lib/utils/ca.utils";
import { useState } from "react";

export default function Search() {
  const filteredCAs = mockCAs;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-8 md:py-12">
      <Container>
        <h1 className="mb-6 text-3xl md:text-4xl font-bold text-gray-900">Find a CA</h1>
        <div className="mb-8 w-full">
          <SearchBar />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCAs.map(ca => (
            <CACard key={ca.id} ca={ca} />
          ))}
        </div>
      </Container>
    </div>
  );
}
