import { useNavigate } from "react-router-dom";

import { useBoardContext } from "@board/context/BoardContext";

export function useHub() {
  const navigate = useNavigate();
  const board = useBoardContext();

  return {
    navigate,
    ...board,
  };
}
