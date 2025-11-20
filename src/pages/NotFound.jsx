import React from "react";
import ExceptionPage from "./ExceptionPage";
import error from "@assets/images/404.svg";

export default function NotFound() {
    return (
        <ExceptionPage
            title="Page Not Found"
            messages={["Sorry, the page you are looking for does not exist."]}
            link={{ to: "/", label: "Go back home" }}
            image={error}
        />
    );
}
