import React, { useRef } from "react";
import Spinner from "@components/Spinner/Spinner";
import { useRouteLoading } from "./useRouteLoading";
import { useLocation } from "react-router-dom";

const RouteChangeBoundary = ({ children }) => {
    const containerRef = useRef(null);
    const location = useLocation();

    const { loading, approvedLocation } = useRouteLoading({
        containerRef,
        minSpinnerTime: 600,
    });

    // apenas renderiza a rota quando approvedLocation === rota permitida
    const shouldRender = location.pathname === approvedLocation.pathname;

    return (
        <>
            {loading && <Spinner />}

            <div
                ref={containerRef}
                key={approvedLocation.pathname}
                style={{
                    visibility: loading ? "hidden" : "visible",
                    position: loading ? "absolute" : "static",
                }}
            >
                {shouldRender && children}
            </div>
        </>
    );
};

export default RouteChangeBoundary;
