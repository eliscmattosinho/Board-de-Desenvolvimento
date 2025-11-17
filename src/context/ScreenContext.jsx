import React, { createContext, useContext, useState, useEffect } from "react";

const ScreenContext = createContext();

/**
 * Provider que expõe informações sobre a tela.
 * Detecta touch, mobile, tablet e desktop.
 */
export function ScreenProvider({ children }) {
    const [screen, setScreen] = useState(getScreenInfo());

    function getScreenInfo() {
        const width = window.innerWidth;
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        return {
            width,
            isTouch,
            isMobile: width <= 480,
            isTablet: width > 480 && width <= 1024,
            isDesktop: width > 1024,
        };
    }

    useEffect(() => {
        const handleResize = () => setScreen(getScreenInfo());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <ScreenContext.Provider value={screen}>
            {children}
        </ScreenContext.Provider>
    );
}

/**
 * Hook para consumir o contexto de tela.
 * @returns {{ width: number, isTouch: boolean, isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 */
export function useScreen() {
    const context = useContext(ScreenContext);
    if (!context) {
        throw new Error("useScreen deve ser usado dentro de <ScreenProvider>");
    }
    return context;
}
