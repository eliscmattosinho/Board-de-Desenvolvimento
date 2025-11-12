import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useScreen } from "../context/ScreenContext";

/**
 * Bloqueia o acesso se a tela for menor que minWidth (ex: mobile/tablet).
 * Redireciona automaticamente para /block.
 */
export default function useScreenBlocker(minWidth = 1024) {
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useScreen();

  useEffect(() => {
    const isTooSmall = width < minWidth;

    if (isTooSmall && location.pathname !== "/block") {
      navigate("/block", { replace: true });
    } else if (!isTooSmall && location.pathname === "/block") {
      navigate("/", { replace: true });
    }
  }, [width, minWidth, location.pathname, navigate]);
}
