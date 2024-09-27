// typings.d.ts

interface Board {
    columns: Map<TypedColumn, Column>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Column {
    id: TypedColumn;
    todos: Todo[];
}

// typings.d.ts

// typings.d.ts

interface Todo {  
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    order: number;
    image?: string | Image | null; 
    userId: string;
    imageUrl?: string;
    dueDate?: string | null; // ISO date string
    priority?: 'Low' | 'Medium' | 'High' | null;
  }
  
  

interface Image {
    bucketId: string;
    fileId: string;
}

