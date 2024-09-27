// components/Modal.tsx

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FormEvent, useEffect } from 'react';
import { useModalStore } from '@/store/ModalStore';
import { useBoardStore } from '@/store/BoardStore';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ClockIcon } from "@heroicons/react/24/solid";
import PriorityRadioGroup from "./PriorityRadioGroup";

function Modal() {
  const [isOpen, closeModal] = useModalStore((state) => [state.isOpen, state.closeModal]);
  const [
    addTask,
    image,
    setImage,
    newTaskInput,
    setNewTaskInput,
    newTaskType,
    setNewTaskType,
    newDueDate,
    setNewDueDate,
  ] = useBoardStore((state) => [
    state.addTask,
    state.image,
    state.setImage,
    state.newTaskInput,
    state.setNewTaskInput,
    state.newTaskType,
    state.setNewTaskType,
    state.newDueDate,
    state.setNewDueDate,
  ]);

  useEffect(() => {
  }, [isOpen, newTaskType]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    addTask(newTaskInput, newTaskType, image);
    setImage(null);
    closeModal();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-10" 
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title 
                  as="h3" 
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="What do you want to do today?..."
                    className="w-full border border-gray-300 rounded-md outline-none p-3 text-base mb-4"
                  />

                  <TaskTypeRadioGroup />

                  <div className='mb-4'>
                    <button 
                      type="button"
                      onClick={() => {
                        // Trigger image upload
                        const imageInput = document.getElementById('image-upload') as HTMLInputElement;
                        imageInput.click();
                      }}
                      className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2
                      focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                      Upload Image
                    </button>
                    <input 
                      type="file"
                      id="image-upload"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0].type.startsWith("image/")) {
                          setImage(e.target.files[0]);
                        }
                      }}
                    />
                    {image && (
                      <div className="relative h-44 w-full mt-2">
                        <Image 
                          src={URL.createObjectURL(image)} 
                          alt="Uploaded Image"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md cursor-pointer"
                          onClick={() => setImage(null)}
                        />
                      </div>
                    )}
                  </div>
                  {/* Due Date Field */}
        <div className="mt-4">
          <label className="flex items-center mb-1">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>Due Date (optional)</span>
          </label>
          <input
            type="datetime-local"
            value={newDueDate || ""}
            onChange={(e) => setNewDueDate(e.target.value || null)}
            className="w-full border border-gray-300 rounded-md outline-none p-3 text-base"
          />
        </div>

                  {/* Priority Selection */}
                  <PriorityRadioGroup />

                  <div className='flex justify-end'>
                    <button
                      type="submit"
                      disabled={!newTaskInput}
                      className={`inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                      text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                      focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                      disabled:cursor-not-allowed`}
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;