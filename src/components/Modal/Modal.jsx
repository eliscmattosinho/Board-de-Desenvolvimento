import React, { useState, useEffect } from "react";
import ModalDesktop from "./ModalDesktop";
import ModalMobile from "./ModalMobile";

import "./Modal.css";
import "./Modal.mobile.css";

export default function Modal(props) {
    const [mobile, setMobile] = useState(window.innerWidth <= 480);

    useEffect(() => {
        const handleResize = () => setMobile(window.innerWidth <= 480);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return mobile ? (
        <ModalMobile {...props} />
    ) : (
        <ModalDesktop {...props} />
    );
}
