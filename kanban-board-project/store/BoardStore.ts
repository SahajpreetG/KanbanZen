// store/BoardStore.ts

import { create } from 'zustand';
import { databases, ID, storage, account } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
// Import AlertStore if you plan to use global alerts
import { useAlertStore } from './AlertStore';

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn, newTodos?: Todo[]) => void;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => Promise<void>;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => Promise<void>;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;

  updateTask: (
    todo: Todo,
    updatedTitle: string,
    columnId: TypedColumn,
    image?: File | null
  ) => Promise<void>;

  deleteImage: (taskId: string, image: Image) => Promise<void>; // New function
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  searchString: "",
  newTaskInput: "",
  newTaskType: "todo",
  image: null,

  setSearchString: (searchString) => set({ searchString }),

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    // Remove the task from the frontend state
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    // Delete associated image if it exists
    if (todo.image) {
      let imageObj: Image;

      if (typeof todo.image === 'string') {
        try {
          imageObj = JSON.parse(todo.image); // Parse image JSON
        } catch (error) {
          console.error('Error parsing image JSON:', error);
          return;
        }
      } else {
        // If it's already an object
        imageObj = todo.image;
      }

      try {
        await storage.deleteFile(imageObj.bucketId, imageObj.fileId);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    // Delete the task from Appwrite
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );

    // Trigger the success alert
    // If using global alerts
    // useAlertStore.getState().showAlert('Task deleted successfully!');
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  setImage: (image: File | null) => set({ image }),

  updateTodoInDB: async (todo, columnId, newTodos = []) => {
    // Update the task's status and order in Appwrite
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        status: columnId,
        order: newTodos.findIndex(t => t.$id === todo.$id),
      }
    );

    // Update the order of other tasks if provided
    if (newTodos.length > 0) {
      await Promise.all(
        newTodos.map((task, index) =>
          databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            task.$id,
            {
              order: index,
            }
          )
        )
      );
    }
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    // Get the current board state and column
    const columns = get().board.columns;
    const column = columns.get(columnId);

    // Determine the order of the new task
    const order = column ? column.todos.length : 0;

    // Get current user ID
    const user = await account.get();
    const userId = user.$id;

    // Create a new task in Appwrite
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        order,
        userId, // Associate task with user
        ...(file && { image: JSON.stringify(file) }), // Store image as JSON string
      }
    );

    // Reset the new task input
    set({ newTaskInput: "" });

    // Update the frontend state with the new task
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        order,
        // Store image as JSON string only if it's defined
        ...(file && { image: JSON.stringify(file) }),
        userId,
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        column.todos.push(newTodo);
        column.todos.sort((a, b) => a.order - b.order); // Maintain order
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });

    // Trigger the success alert
    // If using global alerts
    // useAlertStore.getState().showAlert('Task added successfully!');
  },

  updateTask: async (todo, updatedTitle, columnId, image) => {
    let file: Image | undefined;

    if (image) {
      // Upload new image
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
      // Delete the old image if it exists
      if (todo.image) {
        let imageObj: Image;
        if (typeof todo.image === 'string') {
          imageObj = JSON.parse(todo.image);
        } else {
          imageObj = todo.image;
        }
        await storage.deleteFile(imageObj.bucketId, imageObj.fileId);
      }
    } else if (todo.image && !image) {
      // If the image is set to null, delete the old image
      let imageObj: Image;
      if (typeof todo.image === 'string') {
        imageObj = JSON.parse(todo.image);
      } else {
        imageObj = todo.image;
      }
      await storage.deleteFile(imageObj.bucketId, imageObj.fileId);
    }

    // Update the task in Appwrite
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: updatedTitle,
        ...(file !== undefined
          ? { image: JSON.stringify(file) }
          : { image: null }), // Set image to null if deleted
      }
    );

    // Update the task in the local state
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const column = newColumns.get(columnId);

      if (column) {
        const taskIndex = column.todos.findIndex((t) => t.$id === todo.$id);
        if (taskIndex !== -1) {
          column.todos[taskIndex] = {
            ...column.todos[taskIndex],
            title: updatedTitle,
            ...(file !== undefined
              ? { image: JSON.stringify(file) }
              : { image: null }),
          };
        }
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });

    // Trigger the success alert
    // If using global alerts
    // useAlertStore.getState().showAlert('Task updated successfully!');
  },

  deleteImage: async (taskId: string, image: Image) => {
    try {
      // Delete the file from Appwrite storage
      await storage.deleteFile(image.bucketId, image.fileId);

      // Update the task in Appwrite to remove the image field
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        taskId,
        {
          image: null, // Remove image
        }
      );

      // Update the frontend state to remove the image from the task
      set((state) => {
        const newColumns = new Map(state.board.columns);
        newColumns.forEach((column) => {
          column.todos.forEach((task) => {
            if (task.$id === taskId) {
              task.image = undefined;
            }
          });
        });
        return { board: { columns: newColumns } };
      });

      // Trigger a global success alert
      useAlertStore.getState().showAlert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      // Trigger a global error alert
      useAlertStore.getState().showAlert('Failed to delete image.');
    }
  },
}));
