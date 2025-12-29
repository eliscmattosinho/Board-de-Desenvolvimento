import { useNavigate } from "react-router-dom";

import { useBoardContext } from "@board/context/BoardContext";
import { useGesture } from "@/context/GestureContext";

export function useHub() {
    const navigate = useNavigate();
    const { onPointerUp } = useGesture();
    const board = useBoardContext();

    return {
        navigate,
        onPointerUp,
        ...board,
    };
}
