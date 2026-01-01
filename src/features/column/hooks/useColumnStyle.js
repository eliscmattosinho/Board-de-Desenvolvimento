import { useMemo, useRef } from "react";
import { getContrastColor } from "@column/utils/colorUtils";

export function useColumnStyle({ style, color, applyTo, isTemplate }) {
  const firstRender = useRef(true);

  return useMemo(() => {
    const targetColor = color || style?.bg || "#EFEFEF";
    let textColor;

    if (applyTo === "borda") {
      textColor = targetColor;
    } else if (isTemplate) {
      // TEMPLATE: respeita estilo inicial, depois contraste
      textColor = firstRender.current
        ? style?.color || "#212121"
        : getContrastColor(targetColor);
    } else {
      // NOVA COLUNA: contraste desde a primeira render
      textColor = getContrastColor(targetColor);
    }

    firstRender.current = false;

    if (applyTo === "fundo") {
      return { bg: targetColor, border: "transparent", color: textColor };
    }

    if (applyTo === "borda") {
      return { bg: "transparent", border: targetColor, color: textColor };
    }

    return {
      bg: style?.bg || "transparent",
      border: style?.border || "transparent",
      color: textColor,
    };
  }, [style, color, applyTo, isTemplate]);
}
