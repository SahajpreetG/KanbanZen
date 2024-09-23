// components/LogoutButton.tsx

'use client';

import { account, client } from '@/appwrite';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      client.setJWT(''); // Clear the JWT
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
      Logout
    </button>
  );
}
