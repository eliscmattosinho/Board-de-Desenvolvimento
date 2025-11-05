import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function useScreenBlocker(minWidth = 1024) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < minWidth;

      if (isSmall && location.pathname !== "/block") {
        navigate("/block", { replace: true });
      }

      if (!isSmall && location.pathname === "/block") {
        navigate("/", { replace: true });
      }
    };

    handleResize();

    // Listen for resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname, minWidth, navigate]);
}
