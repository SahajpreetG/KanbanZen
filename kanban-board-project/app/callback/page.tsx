// app/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, client } from '@/appwrite';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Create JWT
        const jwtResponse = await account.createJWT();
        const jwt = jwtResponse.jwt;

        // Set JWT in Appwrite client
        client.setJWT(jwt);

        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Error during JWT creation:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Authenticating...</p>
    </div>
  );
}
