import { toast, Slide } from "react-toastify";

const defaultOptions = {
    position: "bottom-right",
    autoClose: 3000,
    closeButton: false,
    pauseOnHover: true,
    draggable: true,
    transition: Slide,
};

export const showSuccess = (message, options = {}) =>
    toast.success(message, { ...defaultOptions, ...options });

export const showWarning = (message, options = {}) =>
    toast.warning(message, { ...defaultOptions, ...options });

export const showError = (message, options = {}) =>
    toast.error(message, { ...defaultOptions, ...options });

export const showInfo = (message, options = {}) =>
    toast.info(message, { ...defaultOptions, ...options });

export const showCustom = (component, options = {}) => {
    return toast.info(component, {
        ...defaultOptions,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: false,
        ...options,
    });
};
