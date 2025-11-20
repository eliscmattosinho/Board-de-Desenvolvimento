import { useState, useCallback } from "react";

export function useBoardState(initialBoards = [], columns) {
    const [boards, setBoards] = useState(initialBoards);
    const [activeView, setActiveView] = useState(initialBoards[0]?.id ?? "");

    const createBoard = useCallback(
        (title) => {
            const id = title.toLowerCase().replace(/\s+/g, "-");
            if (boards.find((b) => b.id === id)) return;

            setBoards((prev) => [...prev, { id, title }]);
            columns[id] = [];
            setActiveView(id);
        },
        [boards, columns]
    );

    return { boards, activeView, setActiveView, createBoard };
}
