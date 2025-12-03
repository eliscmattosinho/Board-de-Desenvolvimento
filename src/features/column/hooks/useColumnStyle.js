import { useMemo, useRef } from "react";
import { getContrastColor } from "@column/utils/colorUtils";

export function useColumnStyle({ style, color, applyTo }) {
  const firstRender = useRef(true);

  return useMemo(() => {
    const targetColor = color || style?.bg || "#EFEFEF";
    let textColor = firstRender.current ? style?.color || "#212121" : getContrastColor(targetColor);
    firstRender.current = false;

    if (applyTo === "fundo") return { bg: targetColor, border: "transparent", color: textColor };
    if (applyTo === "borda") return { bg: "transparent", border: targetColor, color: textColor };
    return { bg: style?.bg || "transparent", border: style?.border || "transparent", color: textColor };
  }, [style, color, applyTo]);
}
