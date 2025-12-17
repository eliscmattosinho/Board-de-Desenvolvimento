import { useState, useEffect, useMemo } from "react";
import { getContrastColor } from "@column/utils/colorUtils";

export default function useColumnForm(columnData) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#EFEFEF");
    const [description, setDescription] = useState("");
    const [applyTo, setApplyTo] = useState("fundo");

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!columnData) {
            setTitle("");
            setDescription("");
            setColor("#EFEFEF");
            setApplyTo("fundo");
            setIsInitialized(true);
            return;
        }

        setTitle(columnData.title || "");
        setDescription(columnData.description || "");

        if (columnData.color) {
            setColor(columnData.color);
            setApplyTo(columnData.applyTo || "fundo");
        } else if (columnData.style) {
            const { bg, border } = columnData.style;

            if (bg && bg !== "transparent") {
                setColor(bg);
                setApplyTo("fundo");
            } else if (border && border !== "transparent") {
                setColor(border);
                setApplyTo("borda");
            } else {
                setColor("#EFEFEF");
                setApplyTo("fundo");
            }
        } else {
            setColor("#EFEFEF");
            setApplyTo("fundo");
        }

        setIsInitialized(true);
    }, [columnData]);

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
    };
}
