import { databases } from "@/appwrite";

export const getTodosGroupedByColumn = async (): Promise<Board> => {  
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    );

    const todos = data.documents;

    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            });
        }

        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            order: todo.order,  // Ensure we include the 'order' field
            ...(todo.image && { image: JSON.parse(todo.image) })
        });

        return acc;
    }, new Map<TypedColumn, Column>());

    // Add empty columns for any missing types
    const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done'];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: [],
            });
        }
    }

    // Sort todos within each column by their 'order' field
    columns.forEach((column) => {
        column.todos.sort((a, b) => a.order - b.order);
    });

    // Sort columns by columnTypes order
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    );

    const board: Board = {
        columns: sortedColumns
    };

    return board;
};
