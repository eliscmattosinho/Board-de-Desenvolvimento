import { useNavigate } from "react-router-dom";
import { useBoardContext } from "@board/context/BoardContext";
import { useTheme } from "@context/ThemeContext";

export function useHub() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { activeBoard, setActiveBoard, createBoard, boards } =
    useBoardContext();

  return {
    navigate,
    theme,
    activeBoard,
    setActiveBoard,
    createBoard,
    boards,
  };
}
