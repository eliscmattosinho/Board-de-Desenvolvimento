import { useState, useEffect } from "react";

export default function useColumnForm(columnData) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#EFEFEF");
    const [description, setDescription] = useState("");
    const [applyTo, setApplyTo] = useState("fundo");

    const determineColor = (colData) => {
        if (!colData) return { color: "#EFEFEF", applyTo: "fundo" };

        if (colData.color)
            return { color: colData.color, applyTo: colData.applyTo || "fundo" };

        if (colData.style) {
            const { bg, border } = colData.style;
            if (bg && bg !== "transparent") return { color: bg, applyTo: "fundo" };
            if (border && border !== "transparent")
                return { color: border, applyTo: "borda" };
        }

        return { color: "#EFEFEF", applyTo: "fundo" };
    };

    useEffect(() => {
        if (columnData) {
            // Edição de coluna existente
            setTitle(columnData.title || "");
            setDescription(columnData.description || "");
            const { color: c, applyTo: a } = determineColor(columnData);
            setColor(c);
            setApplyTo(a);
        } else {
            // Criação de nova coluna — começa limpa
            setTitle("");
            setDescription("");
            setColor("#EFEFEF");
            setApplyTo("fundo");
        }
    }, [columnData]);

    return {
        title,
        setTitle,
        color,
        setColor,
        description,
        setDescription,
        applyTo,
        setApplyTo,
    };
}
