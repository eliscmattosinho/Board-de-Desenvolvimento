import { useState, useEffect, useMemo } from "react";
import { getContrastColor } from "@utils/colorUtils";

export default function useColumnForm(columnData) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#EFEFEF");
    const [description, setDescription] = useState("");
    const [applyTo, setApplyTo] = useState("fundo");

    const [isInitialized, setIsInitialized] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        // Lógica de extração idêntica para baseline e estado atual
        let finalColor = "#EFEFEF";
        let finalApplyTo = "fundo";
        const finalTitle = columnData?.title || "";
        const finalDescription = columnData?.description || "";

        if (columnData?.color) {
            finalColor = columnData.color;
            finalApplyTo = columnData.applyTo || "fundo";
        } else if (columnData?.style) {
            const { bg, border } = columnData.style;
            if (bg && bg !== "transparent") {
                finalColor = bg;
                finalApplyTo = "fundo";
            } else if (border && border !== "transparent") {
                finalColor = border;
                finalApplyTo = "borda";
            }
        }

        setTitle(finalTitle);
        setDescription(finalDescription);
        setColor(finalColor);
        setApplyTo(finalApplyTo);

        // o initialValues nasce idêntico ao estado
        setInitialValues({
            title: finalTitle,
            color: finalColor.toUpperCase(),
            description: finalDescription,
            applyTo: finalApplyTo,
        });

        setIsInitialized(true);
    }, [columnData]);

    // Estilo em tempo real para o preview
    const style = useMemo(() => {
        const textColor = applyTo === "borda" ? color : getContrastColor(color);

        return applyTo === "borda"
            ? { bg: "transparent", border: color, color: textColor }
            : { bg: color, border: "transparent", color: textColor };
    }, [color, applyTo]);

    return {
        title,
        setTitle,
        color,
        setColor,
        description,
        setDescription,
        applyTo,
        setApplyTo,
        style,
        isInitialized,
        initialValues,
    };
}
