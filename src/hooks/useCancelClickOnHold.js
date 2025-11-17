import { useEffect, useRef } from "react";

export function useCancelClickOnHold() {
    const cancelClickRef = useRef(false);

    const markClickForCancel = () => {
        cancelClickRef.current = true;
    };

    useEffect(() => {
        const handler = (e) => {
            if (cancelClickRef.current) {
                e.preventDefault();
                e.stopPropagation();
                cancelClickRef.current = false;
            }
        };

        window.addEventListener("click", handler, true);

        return () => {
            window.removeEventListener("click", handler, true);
        };
    }, []);

    return { markClickForCancel };
}
