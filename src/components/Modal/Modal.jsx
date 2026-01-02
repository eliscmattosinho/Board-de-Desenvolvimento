import React from "react";
import ModalDesktop from "./ModalDesktop";
import ModalMobile from "./MobileModal/ModalMobile";
import { useScreen } from "@context/ScreenContext";

import "./Modal.css";

export default function Modal(props) {
    const { isMobile } = useScreen();

    return isMobile ? <ModalMobile {...props} /> : <ModalDesktop {...props} />;
}
