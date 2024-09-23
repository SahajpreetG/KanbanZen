'use client'
import Login from '@/components/Login';

export default function LoginPage() {
  return <Login />;
}

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { account } from '@/appwrite';

// export default function LoginPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const handleOAuth = async () => {
//       try {
//         const user = await account.get();
//         if (user) {
//           router.push('/'); // Redirect to home after successful login
//         } else {
//           router.push('/login'); // Redirect to login if no user
//         }
//       } catch (error) {
//         console.error('Error during OAuth callback:', error);
//         router.push('/login'); // Redirect to login on error
//       }
//     };

//     handleOAuth();
//   }, [router]);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <p>Logging in...</p>
//     </div>
//   );
// }
