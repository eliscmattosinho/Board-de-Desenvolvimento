import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";

const ScreenContext = createContext();

/**
 * Provider que expõe informações sobre a tela.
 * Detecta touch, mobile, tablet e desktop de forma reativa.
 */
export function ScreenProvider({ children }) {
    const [screen, setScreen] = useState(() => getScreenInfo());

    function getScreenInfo() {
        const width = window.innerWidth;

        // pointer: coarse detecta telas onde o apontador principal é impreciso (dedos/touch)
        // pointer: fine detecta mouses/trackpads
        const touchMediaQuery = window.matchMedia("(pointer: coarse)").matches;
        const isTouch =
            touchMediaQuery ||
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;

        return {
            width,
            isTouch,
            isMobile: width <= 480,
            isTablet: width > 480 && width <= 1024,
            isDesktop: width > 1024,
        };
    }

    useEffect(() => {
        let timeoutId = null;

        const handleResize = () => {
            // Debounce de 150ms para evitar excesso de processamento
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setScreen(getScreenInfo());
            }, 150);
        };

        window.addEventListener("resize", handleResize);

        // Listener adicional para mudanças de orientação
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    const contextValue = useMemo(
        () => screen,
        [
            screen.width,
            screen.isTouch,
            screen.isMobile,
            screen.isTablet,
            screen.isDesktop,
        ]
    );

    return (
        <ScreenContext.Provider value={contextValue}>
            {children}
        </ScreenContext.Provider>
    );
}

/**
 * Hook para consumir o contexto de tela.
 */
export function useScreen() {
    const context = useContext(ScreenContext);
    if (!context) {
        throw new Error("useScreen deve ser usado dentro de <ScreenProvider>");
    }
    return context;
}
