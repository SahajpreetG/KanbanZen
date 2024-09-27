// lib/getTodosGroupedByColumn.ts

import { databases, account, Query } from "@/appwrite";

export const getTodosGroupedByColumn = async (): Promise<Board> => {  
    try {
        const user = await account.get();
        const userId = user.$id;

        const data = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            [
                Query.equal('userId', userId) // Filter tasks by userId
            ]
        );

        const todos = data.documents;

        const columns = todos.reduce((acc, todo) => {
            if (!acc.get(todo.status)) {
                acc.set(todo.status, {
                    id: todo.status,
                    todos: []
                });
            }

            // Parse image if it exists
            let image: Image | null = null;
            if (todo.image) {
                try {
                    image = JSON.parse(todo.image);
                } catch (error) {
                    console.error('Error parsing image JSON:', error);
                }
            }

            const newTodo: Todo = {
                $id: todo.$id,
                $createdAt: todo.$createdAt,
                title: todo.title,
                status: todo.status as TypedColumn,
                order: todo.order,
                image: image,
                userId: todo.userId,
                dueDate: todo.dueDate ?? null,
                priority: todo.priority ?? null,
            };

            acc.get(todo.status)!.todos.push(newTodo);

            return acc;
        }, new Map<TypedColumn, Column>());

        // Ensure all columns are present
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

        // Sort columns by predefined order
        const sortedColumns = new Map(
            Array.from(columns.entries()).sort(
                (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
            )
        );

        const board: Board = {
            columns: sortedColumns
        };

        return board;
    } catch (error) {
        console.error('Error fetching todos:', error);
        return { columns: new Map<TypedColumn, Column>() };
    }
};
