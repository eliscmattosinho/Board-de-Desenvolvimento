import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";

import ThemeToggle from "@components/ThemeToggle/ThemeToggle";

export default function HubActions({ onBack, onNewBoard }) {
    return (
        <div className="hub-actions">
            <button
                type="button"
                className="board-icon btn-back"
                onClick={onBack}
            >
                <FaArrowCircleLeft size={30} />
            </button>

            <div className="hub-subactions">
                <ThemeToggle />

                <button
                    type="button"
                    className="btn btn-thematic"
                    onClick={onNewBoard}
                >
                    Novo board
                </button>
            </div>
        </div>
    );
}
