import React, { useRef, useState, useEffect } from "react";
import Spinner from "@components/Spinner/Spinner";
import { useRouteLoading } from "./useRouteLoading";
import { useLocation } from "react-router-dom";

const RouteChangeBoundary = ({ children }) => {
    const containerRef = useRef(null);
    const location = useLocation();

    const [displayChildren, setDisplayChildren] = useState(children);

    const { loading } = useRouteLoading({
        containerRef,
        minSpinnerTime: 800,
        waitImages: true,
        waitFetches: true,
    });

    // Atualiza o buffer apenas quando o carregamento termina
    useEffect(() => {
        if (!loading) {
            setDisplayChildren(children);
        }
    }, [loading, children]);

    // Se NÃO está carregando, renderiza os filhos normalmente (Pass-through)
    if (!loading) {
        return <>{children}</>;
    }

    // Se ESTÁ carregando, executa a técnica de Double Buffering
    return (
        <>
            <Spinner />

            {/* UI "Congelada" da rota anterior */}
            <div style={{ opacity: 0.5, pointerEvents: "none" }}>
                {displayChildren}
            </div>

            {/* UI "Fantasma" da nova rota (invisível, apenas para carregar recursos) */}
            <div
                ref={containerRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    visibility: "hidden",
                    pointerEvents: "none",
                    zIndex: -1,
                }}
            >
                {children}
            </div>
        </>
    );
};

export default RouteChangeBoundary;
