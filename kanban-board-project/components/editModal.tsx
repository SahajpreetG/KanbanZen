// components/EditModal.tsx

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FormEvent, useEffect, useState } from 'react';
import { useEditModalStore } from '@/store/EditModalStore';
import { useBoardStore } from '@/store/BoardStore';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import getUrl from '@/lib/getURL';

function EditModal() {
  const { isOpen, closeEditModal, taskToEdit, columnId } = useEditModalStore();
  const { updateTask } = useBoardStore();
  const [updatedTaskInput, setUpdatedTaskInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setUpdatedTaskInput(taskToEdit.title);
      if (taskToEdit.image) {
        let imageObj: Image;
        if (typeof taskToEdit.image === 'string') {
          try {
            imageObj = JSON.parse(taskToEdit.image);
          } catch (err) {
            console.error('Error parsing image JSON:', err);
            return;
          }
        } else {
          imageObj = taskToEdit.image;
        }

        const fetchImage = async () => {
          try {
            const url = await getUrl(imageObj);
            if (url) {
              setExistingImageUrl(url);
            }
          } catch (error) {
            console.error('Error fetching image URL:', error);
          }
        };

        fetchImage();
      }
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updatedTaskInput || !taskToEdit || !columnId) return;

    await updateTask(taskToEdit, updatedTaskInput, columnId, image);
    setImage(null);
    closeEditModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
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
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Edit Task
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={updatedTaskInput}
                    onChange={(e) => setUpdatedTaskInput(e.target.value)}
                    placeholder="Update your task..."
                    className="w-full border border-gray-300 rounded-md outline-none p-3 text-base mb-4"
                  />

                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        const imageInput = document.getElementById('edit-image-upload') as HTMLInputElement;
                        imageInput.click();
                      }}
                      className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2
                        focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                      {image || existingImageUrl ? 'Replace Image' : 'Upload Image'}
                    </button>
                    <input
                      type="file"
                      id="edit-image-upload"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0].type.startsWith("image/")) {
                          setImage(e.target.files[0]);
                          setExistingImageUrl(null); // Remove existing image preview
                        }
                      }}
                    />
                    {existingImageUrl && !image && (
                      <div className="relative h-44 w-full mt-2">
                        <Image
                          src={existingImageUrl}
                          alt="Existing Image"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md cursor-pointer"
                          onClick={() => setExistingImageUrl(null)}
                        />
                      </div>
                    )}
                    {image && (
                      <div className="relative h-44 w-full mt-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="New Uploaded Image"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md cursor-pointer"
                          onClick={() => setImage(null)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!updatedTaskInput}
                      className={`inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                        text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                        focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                        disabled:cursor-not-allowed`}
                    >
                      Save Task
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

export default EditModal;
