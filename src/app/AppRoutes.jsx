import React from "react";
import { Routes, Route } from "react-router-dom";

import Building from "@/pages/building/Building";
import Hub from "@pages/hub/Hub";
import NotFound from "@pages/exceptions/NotFound";

import { BoardProvider } from "@board/context/BoardContext";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Building />} />

            <Route
                path="/hub"
                element={
                    <BoardProvider>
                        <Hub />
                    </BoardProvider>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
