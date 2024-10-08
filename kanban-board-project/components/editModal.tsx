// components/EditModal.tsx

'use client';

import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { Fragment, FormEvent, useEffect, useState } from 'react';
import { useEditModalStore } from '@/store/EditModalStore';
import { useBoardStore } from '@/store/BoardStore';
import { PhotoIcon, XMarkIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'; // Import necessary icons
import Image from 'next/image';
import getUrl from '@/lib/getURL';
import { Rings } from 'react-loader-spinner'; // Import the loading icon
import { format } from 'date-fns';

const priorities = [
  {
    id: "Low",
    name: "Low",
    color: "bg-green-500",
  },
  {
    id: "Medium",
    name: "Medium",
    color: "bg-yellow-500",
  },
  {
    id: "High",
    name: "High",
    color: "bg-red-500",
  },
];

function EditModal() {
  const { isOpen, closeEditModal, taskToEdit, columnId, setTaskToEdit } = useEditModalStore();
  const { updateTask, deleteImage } = useBoardStore();
  const [updatedTaskInput, setUpdatedTaskInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state for save
  const [deletingImage, setDeletingImage] = useState(false); // Loading state for image deletion
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null); // Local alert state
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setUpdatedTaskInput(taskToEdit.title);
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate : null);
      setPriority(taskToEdit.priority ? taskToEdit.priority : null);

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
      } else {
        setExistingImageUrl(null);
      }
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updatedTaskInput || !taskToEdit || !columnId) return;

    try {
      setLoading(true);
      await updateTask(
        taskToEdit,
        updatedTaskInput,
        columnId,
        image,
        dueDate,
        priority
      );
      setImage(null);
      closeEditModal();
      // ...existing code
    } catch (error) {
      console.error('Error updating task:', error);
      setAlert({ message: 'Failed to update task. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!taskToEdit || !taskToEdit.image || !columnId) return;

    let imageObj: Image;

    if (typeof taskToEdit.image === 'string') {
      try {
        imageObj = JSON.parse(taskToEdit.image);
      } catch (err) {
        console.error('Error parsing image JSON:', err);
        setAlert({ message: 'Failed to delete image.', type: 'error' });
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

      // Update the taskToEdit object's image property to null
      const updatedTask = { ...taskToEdit, image: null };
      setTaskToEdit(updatedTask, columnId);

      setAlert({ message: 'Image deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting image:', error);
      setAlert({ message: 'Failed to delete image. Please try again.', type: 'error' });
    } finally {
      setDeletingImage(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {
        if (!loading && !deletingImage) {
          closeEditModal();
          setAlert(null);
        }
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
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
                    {/* If you have TaskTypeRadioGroup, include it here */}
                  </div>

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
                          setAlert(null); // Clear any existing alerts
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
                  {/* Due Date Field */}
      <div className="mb-4">
        <label className="flex items-center mb-1">
          <ClockIcon className="h-5 w-5 mr-2" />
          <span>Due Date (optional)</span>
        </label>
        <input
          type="datetime-local"
          value={dueDate ? format(new Date(dueDate), "yyyy-MM-dd'T'HH:mm") : ""}
          onChange={(e) => setDueDate(e.target.value || null)}
          className="w-full border border-gray-300 rounded-md outline-none p-3 text-base"
        />
      </div>

      {/* Priority Selection */}
      <div className="w-full py-5">
        <RadioGroup
          value={priority}
          onChange={(e) => {
            setPriority(e);
          }}
        >
          <RadioGroup.Label className="text-base font-medium text-gray-900">
            Priority
          </RadioGroup.Label>
          <div className="mt-2 flex space-x-4">
            {priorities.map((priorityOption) => (
              <RadioGroup.Option
                key={priorityOption.id}
                value={priorityOption.id}
                className={({ checked }) =>
                  `${
                    checked
                      ? `${priorityOption.color} bg-opacity-75 text-white`
                      : "bg-white"
                  }
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium ${
                            checked ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {priorityOption.name}
                        </RadioGroup.Label>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white ml-2">
                          <CheckCircleIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>


                  {/* Local Alert */}
                  {alert && (
                    <div className={`mb-4 p-3 rounded-md flex items-center justify-between ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <span>{alert.message}</span>
                      <button
                        type="button"
                        onClick={() => setAlert(null)}
                        className="text-xl font-bold leading-none focus:outline-none"
                        aria-label="Close Alert"
                      >
                        &times;
                      </button>
                    </div>
                  )}

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
