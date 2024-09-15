interface Board {
    columns: Map<TypedColumn,Column>;
}

type TypedColumn = "todo" | "inprogress" | "done"  /* ENUM declaration for key value*/;

interface Column {
    id: TypedColumn;
    todos: Todo[];
}

interface Todo {  /* Defining data types of procured values from appwrite cloud database */
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    order: number; // New field to track the order of todos within a column
    image?: Image;
}

interface Image {
    bucketId: string; /* Defining data types of the variables inside Appwrite image bucket */
    fileId: string;
}
