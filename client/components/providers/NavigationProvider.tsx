'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Scroll to top on normal route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Handle browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // This forces Next.js to bypass the broken client cache 
      // and re-render the React tree properly.
      router.refresh();
    };
    
    // Listen for the browser back button
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  return <>{children}</>;
}