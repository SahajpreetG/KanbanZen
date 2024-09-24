// components/Alert.tsx

'use client';

import { Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useAlertStore } from '@/store/AlertStore';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

function Alert() {
  const { isVisible, message, type, hideAlert } = useAlertStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideAlert]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Transition
        as={Fragment}
        show={isVisible}
        enter="transform transition duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className={`max-w-md w-full ${type === 'success' ? 'bg-green-100' : 'bg-red-100'} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5`}>
          <div className="p-4 flex items-center">
            {/* Success or Error Icon */}
            {type === 'success' ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" aria-hidden="true" />
            ) : (
              <XMarkIcon className="h-6 w-6 text-red-500 flex-shrink-0" aria-hidden="true" />
            )}

            {/* Message Container */}
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 break-words whitespace-normal">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              className={`ml-4 bg-transparent rounded-md inline-flex text-gray-500 hover:text-gray-700 focus:outline-none`}
              onClick={hideAlert}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default Alert;
