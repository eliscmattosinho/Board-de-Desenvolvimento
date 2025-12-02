import { useState, useEffect, useRef } from "react";
import { getContrastColor } from "@column/utils/colorUtils";

/**
 * Hook para gerenciar o formulário de criação/edição de colunas
 * Inclui título, descrição, cor e target (fundo ou borda)
 * Mantém contraste correto apenas em alterações, preservando cor original do template na primeira renderização
 */
export default function useColumnForm(columnData) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#EFEFEF");
    const [description, setDescription] = useState("");
    const [applyTo, setApplyTo] = useState("fundo");
    const [textColor, setTextColor] = useState("#212121");

    const firstRender = useRef(true);

    // Determina cor inicial com base nos dados da coluna
    const determineColor = (colData) => {
        if (!colData) return { color: "#EFEFEF", applyTo: "fundo" };

        if (colData.color)
            return { color: colData.color, applyTo: colData.applyTo || "fundo" };

        if (colData.style) {
            const { bg, border } = colData.style;
            if (bg && bg !== "transparent") return { color: bg, applyTo: "fundo" };
            if (border && border !== "transparent") return { color: border, applyTo: "borda" };
        }

        return { color: "#EFEFEF", applyTo: "fundo" };
    };

    // Inicializa estado quando columnData muda
    useEffect(() => {
        if (columnData) {
            setTitle(columnData.title || "");
            setDescription(columnData.description || "");
            const { color: c, applyTo: a } = determineColor(columnData);
            setColor(c);
            setApplyTo(a);
            setTextColor(c);
            firstRender.current = true;
        } else {
            setTitle("");
            setDescription("");
            setColor("#EFEFEF");
            setApplyTo("fundo");
            setTextColor("#212121");
            firstRender.current = true;
        }
    }, [columnData]);

    // Atualiza a cor de contraste apenas depois da primeira renderização
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (!color) return;
        setTextColor(getContrastColor(color));
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
        textColor,
    };
}
