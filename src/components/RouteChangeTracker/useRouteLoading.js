import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Hook opcional para interceptar fetches
const pendingFetches = new Set();
export const useFetchInterceptor = () => {
    useEffect(() => {
        const original = window.fetch;

        window.fetch = (...args) => {
            const p = original(...args);
            pendingFetches.add(p);
            p.finally(() => pendingFetches.delete(p));
            return p;
        };

        return () => {
            window.fetch = original;
        };
    }, []);
};

// espera imagens dentro de um container
const waitForImages = async (container) => {
    if (!container) return;
    const images = Array.from(container.querySelectorAll("img"));
    if (images.length === 0) return;

    await Promise.all(
        images.map(
            (img) =>
                new Promise((resolve) => {
                    if (img.complete) return resolve();
                    img.addEventListener("load", resolve, { once: true });
                    img.addEventListener("error", resolve, { once: true });
                })
        )
    );
};

export function useRouteLoading({
    minSpinnerTime = 600,
    containerRef,
    waitImages = true,
    waitFetches = true,
} = {}) {
    const location = useLocation();
    const [approvedLocation, setApprovedLocation] = useState(location);
    const [loading, setLoading] = useState(true);

    useFetchInterceptor();

    // loading inicial
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), minSpinnerTime);
        return () => clearTimeout(t);
    }, [minSpinnerTime]);

    // loading quando rota muda
    useEffect(() => {
        if (location.pathname === approvedLocation.pathname) return;

        let active = true;
        setLoading(true);

        const start = Date.now();

        (async () => {
            if (waitImages && containerRef?.current) {
                await waitForImages(containerRef.current);
            }

            if (waitFetches) {
                await Promise.all([...pendingFetches]);
            }

            const elapsed = Date.now() - start;
            const remaining = Math.max(minSpinnerTime - elapsed, 0);

            setTimeout(() => {
                if (!active) return;
                setApprovedLocation(location);
                setLoading(false);
            }, remaining);
        })();

        return () => {
            active = false;
        };
    }, [location, approvedLocation, minSpinnerTime, containerRef, waitImages, waitFetches]);

    return { loading, approvedLocation };
}
