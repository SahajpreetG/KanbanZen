const formatTodosForAI = (board: Board) => {
    const todos = Array.from(board.columns.entries());

    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumn]: Todo[] });

    // reduce to key: value(length)
    const flatArrayCounted = Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            map[key as TypedColumn] = value.length;
            return map;
        },
        {} as { [key in TypedColumn]: number }
    );

    return flatArrayCounted;
};

export default formatTodosForAI;

// export function formatTodosForAI(board: Board) {
//     const columns = Array.from(board.columns.entries());
//     const todos = columns.reduce((acc, [id, column]) => {
//         acc[id] = column.todos.map((todo) => ({
//             id: todo.$id,
//             title: todo.title,
//             status: todo.status,
//             createdAt: todo.$createdAt,
//         }));
//         return acc;
//     }, {} as Record<TypedColumn, { id: string; title: string; status: TypedColumn; createdAt: string }[]>);

//     return todos;
// }