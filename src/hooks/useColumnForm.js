import { useState, useEffect } from "react";
import { columnStyles } from "../constants/columnStyles.js";

export default function useColumnForm(columnData) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#02773aff");
    const [description, setDescription] = useState("");
    const [applyTo, setApplyTo] = useState("fundo");

    const determineColor = (colData) => {
        if (!colData) return { color: "#02773aff", applyTo: "fundo" };

        if (colData.color) return { color: colData.color, applyTo: colData.applyTo || "fundo" };

        if (colData.className) {
            const key = colData.className.split(" ")[1];
            const style = columnStyles[key];
            if (style) {
                if (style.bg !== "transparent") return { color: style.bg, applyTo: "fundo" };
                if (style.border !== "transparent") return { color: style.border, applyTo: "borda" };
            }
        }

        return { color: "#02773aff", applyTo: "fundo" };
    };

    useEffect(() => {
        if (columnData) {
            setTitle(columnData.title || "");
            setDescription(columnData.description || "");
            const { color: c, applyTo: a } = determineColor(columnData);
            setColor(c);
            setApplyTo(a);
        } else {
            const { color: c, applyTo: a } = determineColor(null);
            setTitle("");
            setDescription("");
            setColor(c);
            setApplyTo(a);
        }
    }, [columnData]);

    return { title, setTitle, color, setColor, description, setDescription, applyTo, setApplyTo };
}
