// components/dynamicLayout.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/appwrite';
import { Models } from 'appwrite';

interface Props {
  children: ReactNode;
}

export default function InteractiveLayout({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userAccount = await account.get();
        setUser(userAccount); // User is authenticated
      } catch (error) {
        console.error('User not authenticated:', error);
        router.push('/login'); // Redirect to login if not authenticated
      }
    };

    checkUserSession();
  }, [router]);

  if (user === null) {
    // Optionally render a loading indicator while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Any shared components like headers or navbars can be added here */}
      {children}
    </>
  );
}

// // components/dynamicLayout.tsx

// 'use client';

// import { ReactNode, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { account } from '@/appwrite';
// import { Models } from 'appwrite'; // Import Models from Appwrite SDK

// interface Props {
//   children: ReactNode;
// }

// export default function InteractiveLayout({ children }: Props) {
//   const router = useRouter();
//   const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

//   useEffect(() => {
//     const checkUserSession = async () => {
//       try {
//         const userAccount = await account.get();
//         setUser(userAccount); // User is authenticated
//       } catch (error) {
//         console.error('User not authenticated:', error);
//         router.push('/login'); // Redirect to login if not authenticated
//       }
//     };

//     checkUserSession();
//   }, [router]);

//   if (user === null) {
//     // Optionally render a loading indicator while checking authentication
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Any shared components like headers or navbars can be added here */}
//       {children}
//     </>
//   );
// }
