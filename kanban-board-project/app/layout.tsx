// app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Global meta tags or links */}
        <title>Kanban Board Project</title>
      </head>
      <body className="bg-[#F5F6F8]">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
