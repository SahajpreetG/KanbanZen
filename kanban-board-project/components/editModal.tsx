// components/EditModal.tsx

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FormEvent, useEffect, useState } from 'react';
import { useEditModalStore } from '@/store/EditModalStore';
import { useBoardStore } from '@/store/BoardStore';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Import XMarkIcon
import Image from 'next/image';
import getUrl from '@/lib/getURL';
import { Rings } from 'react-loader-spinner'; // Import the loading icon

function EditModal() {
  const { isOpen, closeEditModal, taskToEdit, columnId } = useEditModalStore();
  const { updateTask, deleteImage } = useBoardStore();
  const [updatedTaskInput, setUpdatedTaskInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state for save
  const [deletingImage, setDeletingImage] = useState(false); // Loading state for image deletion

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

    try {
      setLoading(true);
      await updateTask(taskToEdit, updatedTaskInput, columnId, image);
      setImage(null);
      closeEditModal();
      // Global alert handled in the store
    } catch (error) {
      console.error('Error updating task:', error);
      // Optionally, trigger a global error alert
      // useAlertStore.getState().showAlert('Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!taskToEdit || !taskToEdit.image) return;

    let imageObj: Image;

    if (typeof taskToEdit.image === 'string') {
      try {
        imageObj = JSON.parse(taskToEdit.image);
      } catch (err) {
        console.error('Error parsing image JSON:', err);
        // Optionally, trigger a global error alert
        // useAlertStore.getState().showAlert('Failed to delete image.');
        return;
      }
    } else {
      imageObj = taskToEdit.image;
    }

    try {
      setDeletingImage(true);
      // Call the store's deleteImage function
      await deleteImage(taskToEdit.$id, imageObj);
      
      // Update local state
      setExistingImageUrl(null);
      setImage(null);
      // Global alert handled in the store
    } catch (error) {
      console.error('Error deleting image:', error);
      // Optionally, trigger a global error alert
      // useAlertStore.getState().showAlert('Failed to delete image.');
    } finally {
      setDeletingImage(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {
        if (!loading && !deletingImage) {
          closeEditModal();
        }
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
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
                    required
                  />

                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        const imageInput = document.getElementById('edit-image-upload') as HTMLInputElement;
                        imageInput.click();
                      }}
                      className="w-full border border-gray-300 rounded-md outline-none p-5 flex items-center justify-center focus-visible:ring-2
                        focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="h-6 w-6 mr-2" />
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
                          fill
                          className="object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 focus:outline-none"
                          aria-label="Delete Image"
                        >
                          {deletingImage ? (
                            <Rings
                              height="16"
                              width="16"
                              color="#ffffff"
                              ariaLabel="loading-indicator"
                            />
                          ) : (
                            <XMarkIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                    {image && (
                      <div className="relative h-44 w-full mt-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="New Uploaded Image"
                          fill
                          className="object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 focus:outline-none"
                          aria-label="Remove Image"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!updatedTaskInput || loading || deletingImage}
                      className={`inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                        text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                        focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                        disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <Rings
                          height="20"
                          width="20"
                          color="#3B82F6"
                          ariaLabel="loading-indicator"
                        />
                      ) : (
                        'Save Task'
                      )}
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
