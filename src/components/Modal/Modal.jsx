import React from "react";
import ModalDesktop from "./ModalDesktop";
import ModalMobile from "./ModalMobile";
import { useScreen } from "../../context/ScreenContext";

import "./Modal.css";
import "./Modal.mobile.css";

export default function Modal(props) {
    const { isMobile } = useScreen();

    return isMobile ? (
        <ModalMobile {...props} />
    ) : (
        <ModalDesktop {...props} />
    );
}
