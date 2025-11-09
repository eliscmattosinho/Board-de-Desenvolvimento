import React from "react";

import screenBlockage from "../assets/images/screen-blockage.svg";

import "./ScreenBlockage.css";

export default function ScreenBlockage() {
    return (
        <div id="blocker-content">
            <h2 className="blocker-title">Screen Too Small</h2>

            <div className="blocker-info">
                <p>Sorry, this page isn’t available on smaller devices.</p>
                <p>Please use a <strong>larger screen</strong> or <strong>rotate your device</strong> to continue.</p>
            </div>

            <div className="blocker-img-container">
                <img src={screenBlockage} alt="Two hands connecting puzzle pieces, representing unavailable content due to small screen size." />
            </div>
        </div>
    );
}
