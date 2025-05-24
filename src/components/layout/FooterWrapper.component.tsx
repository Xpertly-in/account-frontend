// new file: src/components/layout/FooterWrapper.component.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer.component';

export function FooterWrapper() {
  const pathname = usePathname();
  // Hide the footer on all /forum routes
  if (pathname.startsWith('/forum')) {
    return null;
  }
  return <Footer />;
}