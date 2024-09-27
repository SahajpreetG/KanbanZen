// app/(authenticated)/layout.tsx

'use client';

import { ReactNode } from 'react';
import InteractiveLayout from '@/components/dynamicLayout'; // Ensure the path is correct

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <InteractiveLayout>
      {children}
    </InteractiveLayout>
  );
}
