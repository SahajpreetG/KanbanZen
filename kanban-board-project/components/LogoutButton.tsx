// components/LogoutButton.tsx

'use client';

import { account, client } from '@/appwrite';
import { useRouter } from 'next/navigation';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid'; // Import the icon

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      client.setJWT(''); // Clear the JWT
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally, trigger an alert or notification here
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
      aria-label="Logout"
      title="Logout"
    >
      <ArrowRightEndOnRectangleIcon className="h-6 w-6 transition-transform duration-200 ease-in-out transform hover:scale-110" aria-hidden="true" />
    </button>
  );
}
