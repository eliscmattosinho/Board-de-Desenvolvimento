import React from "react";
import ExceptionPage from "./ExceptionPage";
import screenBlockage from "@assets/images/screen-blockage.svg";

export default function ScreenBlockage() {
    return (
        <ExceptionPage
            title="Screen Too Small"
            messages={[
                "Sorry, this page isn’t available on smaller devices.",
                "Please use a <strong>larger screen</strong> or <strong>rotate your device</strong> to continue."
            ]}
            image={screenBlockage}
        />
    );
}
