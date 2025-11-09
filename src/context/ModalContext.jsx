import React, { createContext, useContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null);

    // Abre qualquer modal dinâmico
    const openModal = useCallback((Component, props = {}) => {
        setModal({ Component, props, isOpen: true });
    }, []);

    // Fecha o modal atual
    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modal &&
                ReactDOM.createPortal(
                    <modal.Component
                        {...modal.props}
                        isOpen={modal.isOpen}
                        onClose={closeModal}
                    />,
                    document.body
                )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}
