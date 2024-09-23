// components/Modal.tsx

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FormEvent, useEffect } from 'react';
import { useModalStore } from '@/store/ModalStore';
import { useBoardStore } from '@/store/BoardStore';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

function Modal() {
  const { isOpen, closeModal } = useModalStore();
  const [addTask, image, setImage, newTaskInput, setNewTaskInput, newTaskType] = useBoardStore((state) => [
    state.addTask,
    state.image,
    state.setImage,
    state.newTaskInput,
    state.setNewTaskInput,
    state.newTaskType,
  ]);

  useEffect(() => {
    console.log('Modal isOpen:', isOpen);
    console.log('Modal newTaskType:', newTaskType);
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


// 'use client';

// import { useModalStore } from '@/store/ModalStore';
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition} from '@headlessui/react';
// import { useBoardStore } from '@/store/BoardStore';
// import TaskTypeRadioGroup from './TaskTypeRadioGroup';
// import { FormEvent, useRef } from 'react';
// import Image from 'next/image';
// import { PhotoIcon } from '@heroicons/react/24/solid';

// function Modal() {
//   const imagePickerRef = useRef<HTMLInputElement>(null);
//   const [addTask, image, setImage, newTaskInput, setNewTaskInput, newTaskType] = useBoardStore((state) => [
//     state.addTask,
//     state.image,
//     state.setImage,
//     state.newTaskInput,
//     state.setNewTaskInput,
//     state.newTaskType,
//   ]);
//   const [isOpen, closeModal] = useModalStore((state) => [
//     state.isOpen,
//     state.closeModal,
//   ]);

//   const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!newTaskInput) return;

//     addTask(newTaskInput, newTaskType, image);
//     setImage(null);
//     closeModal();
//   }

//   return (
//     <>
      
//       <Dialog 
//         open={isOpen}
//         onClose={closeModal}
//         as="form" 
//         onSubmit={handleSubmit}
//         className="relative z-10">
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-black/30 duration-300 ease-out bg-opacity-25"
//           // className="enter-ease-out-duration-300 enterFrom-opacity-0 enterTo-opacity-100 
//           // leave-ease-in-duration-200 leaveFrom-opcaity-200 leaveTo-opacity-0"
//         />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <DialogPanel
//             transition
//             className="w-full max-w-md min-w-[320px] rounded-2xl bg-white p-6 text-left align-middle shadow-xl duration-300
//              ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
//           >
//             <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 pb-2">Add a Task</DialogTitle>
//             <div className="mt-2">
//               <input
//                 type="text"
//                 value={newTaskInput}
//                 onChange={(e) => setNewTaskInput(e.target.value)}
//                 placeholder="What do you want to do today?..."
//                 className="w-full border border-gray-300 rounded-md outline-none p-3 text-base"
//                 />
                 
//             </div>

//           <TaskTypeRadioGroup />

//           <div className='mt-2'>
//             <button 
//               type="button"
//               onClick={() => {
//                 imagePickerRef.current?.click()
//               }}
//               className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2
//             focus-visible:ring-blue-500 focus-visible:ring-offset-2">
//               <PhotoIcon
//               className="h-6 w-6 mr-2 inline-block" />
//               Upload Image
//             </button>
//             {image && (
//               <Image 
//                   src={URL.createObjectURL(image)} 
//                   alt="Uploaded Image"
//                   width={200}
//                   height={200}
//                   className="w-full h-44 object-cover mt-2 filter hover:grayscale
//                   transition-all duration-150 cursor-not-allowed"
//                   onClick={() => {
//                     setImage(null);
//                   }}
//               />
//             )}
//             <input type="file"
//             ref={imagePickerRef}
//             hidden
//             onChange={(e) => {
//               // check e is an image
//               if (!e.target.files![0].type.startsWith("image/")) return;
//               setImage(e.target.files![0]);
//             }} 
//             />
//           </div>

//           <div className='mt-4'>
//             <button
//               type="submit"
//               disabled={!newTaskInput}
//               className=" inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
//               text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
//               focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
//               disabled:cursor-not-allowed">
//               Add Task
//             </button>
//           </div>
//           </DialogPanel>
          
//         </div>
//       </Dialog>
//     </>
//   );
// }

// export default Modal;
