/**
 * Calcula a cor de contraste ideal (escuro ou claro) para uma cor de fundo.
 * Baseado na fórmula de Luminância Relativa da WCAG 2.x.
 */
export const getContrastColor = (color) => {
    // Cores padrão seguras
    const DARK = "#212121";
    const LIGHT = "#EFEFEF";

    if (!color) return DARK;

    let r, g, b;

    // Parsing de HEX
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        const isShort = hex.length === 3;

        r = parseInt(isShort ? hex[0] + hex[0] : hex.slice(0, 2), 16);
        g = parseInt(isShort ? hex[1] + hex[1] : hex.slice(2, 4), 16);
        b = parseInt(isShort ? hex[2] + hex[2] : hex.slice(4, 6), 16);
    }
    // Parsing de RGB/RGBA
    else if (color.startsWith("rgb")) {
        const values = color.match(/\d+/g);
        if (!values || values.length < 3) return DARK;
        [r, g, b] = values.map(Number);
    } else {
        return DARK;
    }

    // Cálculo de luminância relativa (SRGB para linear), sensibilidade do olho humano é maior para o verde e menor para o azul
    const [R, G, B] = [r, g, b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });

    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    // Retorno baseado no limiar de brilho
    return luminance > 0.179 ? DARK : LIGHT;
};
