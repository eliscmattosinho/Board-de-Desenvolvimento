import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";

import ThemeToggle from "@components/ThemeToggle/ThemeToggle";

import "./HubActions.css"

export default function HubActions({ onBack, onNewBoard }) {
    return (
        <div className="hub-actions">
            <button onClick={onBack} className="board-icon btn-back">
                <FaArrowCircleLeft size={30} />
            </button>

            <div className="hub-sub-actions">
                <ThemeToggle />
                <button
                    id="new-board"
                    className="btn btn-thematic"
                    onClick={onNewBoard}
                >
                    Novo board
                </button>
            </div>
        </div>
    );
}
