// components/Login.tsx

'use client';

import React from 'react';
import { account } from '../appwrite';
import { OAuthProvider } from 'appwrite';

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      // Initiate OAuth login
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/callback`, // Success URL
        `${window.location.origin}/login`     // Failure URL
      );
      
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-10 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-5">Welcome to Your Todo App</h1>
        <button 
          onClick={handleGoogleLogin} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
