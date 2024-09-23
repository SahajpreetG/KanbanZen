// components/TodoCard.tsx

'use client';
import getUrl from "@/lib/getURL";
import { useBoardStore } from "@/store/BoardStore";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "@hello-pangea/dnd";
import { XCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useEditModalStore } from "@/store/EditModalStore";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const openEditModal = useEditModalStore((state) => state.openEditModal);
  const setTaskToEdit = useEditModalStore((state) => state.setTaskToEdit);

  useEffect(() => {
    if (todo.image) {
      let imageObj: Image;
      if (typeof todo.image === 'string') {
        try {
          imageObj = JSON.parse(todo.image);
        } catch (err) {
          console.error('Error parsing image JSON:', err);
          return;
        }
      } else {
        imageObj = todo.image;
      }

      const fetchImage = async () => {
        try {
          const url = await getUrl(imageObj);
          if (url) {
            setImageUrl(url);
          }
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      };

      fetchImage();
    }
  }, [todo]);

  const handleEdit = () => {
    setTaskToEdit(todo, id);
    openEditModal();
  };

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="p-5">
        <div className="flex items-start">
        <p className="flex-1 break-words max-h-40 overflow-y-auto">{todo.title}</p>
          <div className="flex-shrink-0 flex space-x-2">
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-600"
            >
              <PencilIcon className="-mr-1 h-6 w-6" />
            </button>
            {/* Delete Button */}
            <button
              onClick={() => deleteTask(index, todo, id)}
              className="text-red-500 hover:text-red-600"
            >
              <XCircleIcon className="-mr-3 h-8 w-8" />
            </button>
          </div>
        </div>
        {/* Add image if available */}
        {imageUrl && (
          <div className="h-full w-full rounded-b-md mt-2">
            <Image
              src={imageUrl}
              alt="Task Image"
              width={400}
              height={200}
              className="w-full object-contain rounded-b-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoCard;
