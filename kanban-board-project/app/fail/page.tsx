//fail/page.tsx
'use client'
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';

const LoginFailedMessage = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="flex justify-center items-center h-screen">
      <Transition
        as={Fragment}
        show={isVisible}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Login failed. Please try again.</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => setIsVisible(false)}
          >
            <svg 
              className="fill-current h-6 w-6 text-red-500" 
              role="button" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.586 7.066 4.652a1 1 0 00-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 12.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934z"/>
            </svg>
          </button>
        </div>
      </Transition>
    </div>
  );
};

export default LoginFailedMessage;
