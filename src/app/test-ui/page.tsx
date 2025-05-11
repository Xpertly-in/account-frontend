'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function TestUIPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">UI Components Test</h1>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="default">Default Size</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </section>

      {/* Button States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button States</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button loading={isLoading} onClick={handleLoadingClick}>
            Click to Load
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
            Gradient
          </Button>
        </div>
      </section>

      {/* Skeleton Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Skeleton Variants</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="flex space-x-4">
            <Skeleton className="h-20 w-20" />
            <Skeleton className="h-20 w-20" />
            <Skeleton className="h-20 w-20" />
          </div>
        </div>
      </section>

      {/* Dark Mode Test */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dark Mode Test</h2>
        <div className="p-4 rounded-lg bg-card border">
          <p className="text-card-foreground">
            This section tests dark mode compatibility. Try toggling dark mode to see
            how components adapt.
          </p>
          <div className="mt-4 flex gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </div>
      </section>

      {/* Responsive Test */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive Test</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 