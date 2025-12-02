/**
 * Retorna a cor de contraste para uma cor de fundo ou borda
 * Se a cor for clara, retorna #212121 (escuro)
 * Se a cor for escura, retorna #EFEFEF (claro)
 */
export const getContrastColor = (hex) => {
    if (!hex) return "#212121";

    let r, g, b;

    if (hex.startsWith("#")) {
        const c = hex.slice(1);
        if (c.length === 3) {
            r = parseInt(c[0] + c[0], 16);
            g = parseInt(c[1] + c[1], 16);
            b = parseInt(c[2] + c[2], 16);
        } else {
            r = parseInt(c.substr(0, 2), 16);
            g = parseInt(c.substr(2, 2), 16);
            b = parseInt(c.substr(4, 2), 16);
        }
    } else if (hex.startsWith("rgb")) {
        const match = hex.match(/\d+/g);
        if (!match || match.length < 3) return "#212121";
        [r, g, b] = match.map(Number);
    } else {
        return "#212121";
    }

    const [R, G, B] = [r, g, b].map((c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return luminance > 0.5 ? "#212121" : "#EFEFEF";
};
