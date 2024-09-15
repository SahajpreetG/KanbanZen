import { databases, ID, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand';

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

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
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

    // delete todoId from newColumns in front-end
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({board: { columns: newColumns } });

    // delete todoId in the backend Appwrite
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input}),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId}),

  setImage: (image: File | null) => set({ image }),

  updateTodoInDB: async (todo, columnId, newTodos = []) => {
    // Update the todo's column and order in the database
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        status: columnId,
        order: newTodos.findIndex(t => t.$id === todo.$id), // set the correct order
      }
    );

    // Update the order of other todos in the column if provided
    if (newTodos.length > 0) {
      await Promise.all(
        newTodos.map((todo, index) =>
          databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
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

    // Create a new task in the Appwrite database
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        order, // Include the calculated order
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    // Resetting new task input
    set({ newTaskInput: "" });

    // Update the frontend state with the new task
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        order, // Include order here
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        column.todos.push(newTodo);
        column.todos.sort((a, b) => a.order - b.order); // Sort todos by order after adding
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

}));
