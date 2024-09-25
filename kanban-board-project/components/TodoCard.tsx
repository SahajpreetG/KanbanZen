// components/TodoCard.tsx

import { format, isPast } from 'date-fns';
import { useBoardStore } from "@/store/BoardStore";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "@hello-pangea/dnd";
import { XCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useEditModalStore } from "@/store/EditModalStore";
import getUrl from "@/lib/getURL";

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
    } else {
      setImageUrl(null);
    }
  }, [todo.image]);

  const handleEdit = () => {
    setTaskToEdit(todo, id);
    openEditModal();
  };

  // Check if the task is overdue
  const isOverdue = todo.dueDate ? isPast(new Date(todo.dueDate)) : false;

  // Format the due date
  const formattedDueDate = todo.dueDate
    ? format(new Date(todo.dueDate), "Pp")
    : null;

  return (
    <div
      className="bg-white rounded-md shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Labels container */}
            <div className="flex flex-wrap items-center space-x-2">
              {/* Priority label */}
              {todo.priority && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md ${
                    todo.priority === "Low"
                      ? "bg-green-100 text-green-800"
                      : todo.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {todo.priority} Priority
                </span>
              )}
              {/* Overdue label */}
              {isOverdue && (
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-red-100 text-red-800">
                  Overdue
                </span>
              )}
            </div>
            
            {/* Add margin between labels and task title */}
            <p className="mt-2 text-sm break-words max-h-40 overflow-y-auto">
              {todo.title}
            </p>
          </div>
          <div className="flex-shrink-0 flex space-x-2 ml-2">
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-600"
            >
              <PencilIcon className="h-6 w-6" />
            </button>
            {/* Delete Button */}
            <button
              onClick={() => deleteTask(index, todo, id)}
              className="text-red-500 hover:text-red-600"
            >
              <XCircleIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
        {/* Image if available */}
        {imageUrl && (
          <div className="mt-2">
            <Image
              src={imageUrl}
              alt="Task Image"
              width={400}
              height={200}
              className="w-full object-contain rounded-md"
            />
          </div>
        )}
        {/* Due date label */}
        {formattedDueDate && (
              <div className="mt-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md ${
                    isOverdue
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  Due Date: {formattedDueDate}
                </span>
              </div>
            )}
      </div>
    </div>
  );
}

export default TodoCard;
