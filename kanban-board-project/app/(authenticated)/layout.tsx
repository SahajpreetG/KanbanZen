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


// // app/layout.tsx

// import './globals.css';
// import { ReactNode } from 'react';
// import { Toaster } from 'react-hot-toast';
// import InteractiveLayout from '@/components/dynamicLayout'; // Client Component

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Add any global meta tags or links here */}
//         <title>Kanban Board Project</title>
//       </head>
//       <body className="bg-[#F5F6F8]">
//         <Toaster />
//         <InteractiveLayout>
//           {children}
//         </InteractiveLayout>
//       </body>
//     </html>
//   );
// }
