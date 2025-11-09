import React from "react";

import { Link } from "react-router-dom";

import error from "../assets/images/404.svg";

import "./NotFound.css";

export default function NotFound() {
    return (
        <div id="error-content">
            <h2 className="error-title">Page Not Found</h2>

            <div className="error-info">
                <p>Sorry, the page you are looking for does not exist.</p>
                <Link to="/" className="go-back">Go back home</Link>
            </div>

            <div className="error-img-container">
                <img src={error} alt="404 component" />
            </div>
        </div>
    );
}
