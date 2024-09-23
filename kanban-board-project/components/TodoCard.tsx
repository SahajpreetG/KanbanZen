// components/TodoCard.tsx

'use client'
import getUrl from "@/lib/getURL";
import { useBoardStore } from "@/store/BoardStore";
import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { XCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  useEffect(() =>  {
    if (todo.image) {
      // Check if todo.image is a string or an object
      let imageObj: Image;
      if (typeof todo.image === 'string') {
        try {
          console.log('Raw todo.image (string):', todo.image);
          imageObj = JSON.parse(todo.image);
        } catch (err) {
          console.error('Error parsing image JSON:', err);
          return;
        }
      } else {
        // If it's already an object
        console.log('Raw todo.image (object):', todo.image);
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
      }

      fetchImage();
    }
  }, [todo])

  return (
    <div
    className="bg-white rounded-md space-y-2 drop-shadow-md"
    {...draggableProps}
    {...dragHandleProps}
    ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button onClick={() => deleteTask(index, todo, id)} 
        className="text-red-500 hover:text-red-600">
            <XCircleIcon 
            className="ml-5 h-8 w-8"
            />
        </button>
      </div>
      {/* Add image if available */}
      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image 
            src={imageUrl}
            alt="Task Image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
            // Uncomment if using signed URLs that might not be compatible with Next.js optimization
            // unoptimized 
          />
        </div>
      )}
    </div>
  )
}

export default TodoCard;
