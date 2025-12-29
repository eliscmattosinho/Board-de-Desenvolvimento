import React from "react";

import BoardControls from "@board/components/BoardControls/BoardControls";

import svgDarkBoard from "@assets/images/svg-board.svg";
import svgLightBoard from "@assets/images/svg-light-board.svg";

import "./HubHeader.css"

export default function HubHeader({
    theme,
    activeBoard,
    setActiveBoard,
}) {
    const boardImage = theme === "dark" ? svgDarkBoard : svgLightBoard;

    return (
        <header className="hub-header">
            <div className="hub-introduction">
                <div className="hub-infos">
                    <h1 className="hub-title title-thematic">
                        Development Hub
                    </h1>
                    <p className="sub-title">
                        Escolha seu board de visualização.
                    </p>
                </div>

                <BoardControls
                    activeBoard={activeBoard}
                    setActiveBoard={setActiveBoard}
                />
            </div>

            <div className="img-container hub-img-container">
                <img
                    src={boardImage}
                    alt="Illustration of a dashboard interface"
                />
            </div>
        </header>
    );
}
