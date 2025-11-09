import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import "./ExceptionPage.css";

export default function ExceptionPage({
    title,
    messages = [],
    link = null,
    image,
}) {
    const { theme } = useTheme();

    return (
        <div className="exception-container" data-theme={theme}>
            <h2 className="exception-title">{title}</h2>

            <div className="exception-info">
                {messages.map((msg, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: msg }} />
                ))}
                {link && (
                    <Link to={link.to} className="go-back">
                        {link.label}
                    </Link>
                )}
            </div>

            <div className="exception-img-container">
                <img src={image} alt={title + " illustration"} />
            </div>
        </div>
    );
}
