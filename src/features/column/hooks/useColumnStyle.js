import { useMemo } from "react";
import { getContrastColor } from "@utils/colorUtils";

export function useColumnStyle({ style, color, applyTo, isTemplate }) {
  return useMemo(() => {
    const targetColor = color || style?.bg || "#EFEFEF";
    let textColor;

    if (applyTo === "borda") {
      textColor = targetColor;
    } else {
      textColor = getContrastColor(targetColor);

      // Se for template e tiver cor definida no estilo inicial
      if (isTemplate && style?.color) {
        textColor = style.color;
      }
    }

    if (applyTo === "fundo") {
      return {
        bg: targetColor,
        border: "transparent",
        color: textColor,
      };
    }

    if (applyTo === "borda") {
      return {
        bg: "transparent",
        border: targetColor,
        color: textColor,
      };
    }

    return {
      bg: style?.bg || "transparent",
      border: style?.border || "transparent",
      color: textColor,
    };
  }, [style, color, applyTo, isTemplate]);
}
