import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@context/ThemeContext";

import "./ExceptionPage.css";

export default function ExceptionPage({
    title,
    messages = [],
    link = null,
    image,
}) {
    const { theme } = useTheme();

    return (
        <main className="exception-container" data-theme={theme}>
            <h1 className="exception-title title-thematic">{title}</h1>

            <section className="exception-info">
                {messages.map((msg, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: msg }} />
                ))}
                {link && (
                    <Link to={link.to} className="go-back">
                        {link.label}
                    </Link>
                )}
            </section>

            <figure className="exception-img-container">
                <img src={image} alt={title + " illustration"} />
            </figure>
        </main>
    );
}
