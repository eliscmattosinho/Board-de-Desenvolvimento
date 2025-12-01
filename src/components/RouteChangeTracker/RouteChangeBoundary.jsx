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

    if (loading || !shouldRender) {
        return <Spinner />;
    }

    return (
        <div ref={containerRef} key={approvedLocation.pathname}>
            {children}
        </div>
    );
};

export default RouteChangeBoundary;
