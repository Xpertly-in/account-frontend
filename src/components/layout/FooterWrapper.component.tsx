// new file: src/components/layout/FooterWrapper.component.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer.component';

export function FooterWrapper() {
  const pathname = usePathname();
  // Hide the footer on all /feed routes
  if (pathname.startsWith('/feed')) {
    return null;
  }
  return <Footer />;
}