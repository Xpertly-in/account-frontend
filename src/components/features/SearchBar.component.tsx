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
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-4 dark:bg-gray-800/90 dark:border-blue-900/30 dark:shadow-blue-900/20">
      <form onSubmit={handleSearch} className="space-y-5 w-full">
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full">
          <div className="relative flex-1 w-full">
            <MapPin
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary dark:text-blue-400"
              weight="bold"
            />
            <Input
              type="text"
              placeholder="Enter location (city, area, etc.)"
              className="pl-12 py-6 text-lg rounded-xl border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:shadow-inner dark:shadow-blue-900/10 dark:focus:border-blue-400 dark:focus:ring-blue-400 w-full"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 px-8 rounded-xl text-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-500 dark:shadow-blue-900/10 dark:hover:shadow-blue-500/20 md:w-auto w-full"
          >
            <MagnifyingGlass className="mr-2 h-5 w-5" weight="bold" /> Find CA
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-all dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800/40 dark:hover:border-blue-700 dark:hover:text-blue-200"
            onClick={() => setLocation("Mumbai")}
          >
            Mumbai
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-all dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800/40 dark:hover:border-blue-700 dark:hover:text-blue-200"
            onClick={() => setLocation("Delhi")}
          >
            Delhi
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-all dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800/40 dark:hover:border-blue-700 dark:hover:text-blue-200"
            onClick={() => setLocation("Bangalore")}
          >
            Bangalore
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full py-1 px-5 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-all dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-800/40 dark:hover:border-blue-700 dark:hover:text-blue-200"
            onClick={() => setLocation("Chennai")}
          >
            Chennai
          </Button>
        </div>
      </form>
    </div>
  );
}
