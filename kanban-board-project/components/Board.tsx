// components/Board.tsx

'use client';

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";

function Board() {
    const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [
        state.board,
        state.getBoard,
        state.setBoardState,
        state.updateTodoInDB,
    ]);

    useEffect(() => {
        getBoard();
    }, [getBoard]);

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        if (!destination) return;

        if (type === 'column') {
            const columns = Array.from(board.columns.entries());
            const [moved] = columns.splice(source.index, 1);
            columns.splice(destination.index, 0, moved);
            const newColumns = new Map(columns);
            setBoardState({ ...board, columns: newColumns });
            return;
        }

        const startCol = board.columns.get(source.droppableId as TypedColumn);
        const finishCol = board.columns.get(destination.droppableId as TypedColumn);

        if (!startCol || !finishCol) return;

        if (source.index === destination.index && startCol === finishCol) return;

        const newTodos = Array.from(startCol.todos);
        const [todoMoved] = newTodos.splice(source.index, 1);

        if (startCol.id === finishCol.id) {
            newTodos.splice(destination.index, 0, todoMoved);
            const newCol = {
                id: startCol.id,
                todos: newTodos,
            };
            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, newCol);

            setBoardState({ ...board, columns: newColumns });

            // Update the new state in the Appwrite database
            updateTodoInDB(todoMoved, startCol.id, newTodos);
        } else {
            const finishTodos = Array.from(finishCol.todos);
            finishTodos.splice(destination.index, 0, todoMoved);

            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, {
                id: startCol.id,
                todos: newTodos,
            });
            newColumns.set(finishCol.id, {
                id: finishCol.id,
                todos: finishTodos,
            });

            // Update the new state in the Appwrite database
            updateTodoInDB(todoMoved, finishCol.id, finishTodos);

            setBoardState({ ...board, columns: newColumns });
        }
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="column">
                {(provided) => (
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {Array.from(board.columns.entries()).map(([id, column], index) => (
                            <Column key={id} id={id} todos={column.todos} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default Board;
