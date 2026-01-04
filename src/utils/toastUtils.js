import { toast } from "react-toastify";

const defaultOptions = {};

/**
 * Função utilitária para tratar opções e IDs
 */
const getOptions = (options) => ({
    ...defaultOptions,
    ...options,
});

export const showSuccess = (message, options = {}) =>
    toast.success(message, getOptions(options));

export const showWarning = (message, options = {}) =>
    toast.warning(message, getOptions(options));

export const showError = (message, options = {}) =>
    toast.error(message, getOptions(options));

export const showInfo = (message, options = {}) =>
    toast.info(message, getOptions(options));

export const showPromise = (
    promise,
    { pending, success, error },
    options = {}
) => {
    return toast.promise(
        promise,
        {
            pending,
            success,
            error,
        },
        getOptions(options)
    );
};

export const showCustom = (component, options = {}) => {
    return toast(component, {
        ...getOptions(options),
        autoClose: options.autoClose ?? false,
        closeOnClick: options.closeOnClick ?? false,
    });
};

export const dismissAll = () => toast.dismiss();

export const dismissToast = (id) => toast.dismiss(id);
