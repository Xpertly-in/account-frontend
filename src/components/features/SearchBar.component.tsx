"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, MagnifyingGlass } from "@phosphor-icons/react";

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4">
      <form onSubmit={handleSearch} className="space-y-5">
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3">
          <div className="relative flex-1">
            <MapPin
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500"
              weight="bold"
            />
            <Input
              type="text"
              placeholder="Enter location (city, area, etc.)"
              className="pl-12 py-6 text-lg rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 rounded-xl text-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <MagnifyingGlass className="mr-2 h-5 w-5" weight="bold" /> Find CA
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-800 hover:text-blue-900 hover:border-blue-400 transition-all"
            onClick={() => setLocation("Mumbai")}
          >
            Mumbai
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-800 hover:text-blue-900 hover:border-blue-400 transition-all"
            onClick={() => setLocation("Delhi")}
          >
            Delhi
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-800 hover:text-blue-900 hover:border-blue-400 transition-all"
            onClick={() => setLocation("Bangalore")}
          >
            Bangalore
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-800 hover:text-blue-900 hover:border-blue-400 transition-all"
            onClick={() => setLocation("Chennai")}
          >
            Chennai
          </Button>
        </div>
      </form>
    </div>
  );
}
