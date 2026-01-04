import {
    useEffect,
    useState,
    useCallback,
    useRef,
    useLayoutEffect,
} from "react";
import { useLocation } from "react-router-dom";

const pendingFetches = new Set();
let isIntercepting = false;

const startIntercepting = () => {
    if (isIntercepting) return;
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const promise = originalFetch(...args);
        pendingFetches.add(promise);
        try {
            return await promise;
        } finally {
            pendingFetches.delete(promise);
        }
    };
    isIntercepting = true;
};

export function useRouteLoading({
    minSpinnerTime = 600,
    containerRef,
    waitImages = true,
    waitFetches = true,
} = {}) {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const lastPathname = useRef(location.pathname);
    const isInitialRender = useRef(true);

    useEffect(() => {
        if (waitFetches) startIntercepting();
    }, [waitFetches]);

    // Detecta mudança de rota antes
    useLayoutEffect(() => {
        if (location.pathname !== lastPathname.current) {
            setLoading(true);
        }
    }, [location.pathname]);

    const waitForResources = useCallback(async () => {
        const promises = [];

        // 1. Fetches
        if (waitFetches && pendingFetches.size > 0) {
            await Promise.allSettled(Array.from(pendingFetches));
            await new Promise((res) => requestAnimationFrame(res));
        }

        // 2. Imagens
        if (waitImages && containerRef?.current) {
            const images = Array.from(containerRef.current.querySelectorAll("img"));
            const imgPromises = images.map((img) =>
                img.complete
                    ? Promise.resolve()
                    : new Promise((res) => {
                        img.onload = res;
                        img.onerror = res;
                    })
            );
            promises.push(...imgPromises);
        }

        await Promise.race([
            Promise.allSettled(promises),
            new Promise((res) => setTimeout(res, 5000)),
        ]);
    }, [containerRef, waitImages, waitFetches]);

    useEffect(() => {
        if (!loading && !isInitialRender.current) return;

        let isMounted = true;
        const startTime = Date.now();

        const processTransition = async () => {
            await waitForResources();
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(minSpinnerTime - elapsed, 0);

            setTimeout(() => {
                if (isMounted) {
                    setLoading(false);
                    lastPathname.current = location.pathname;
                    isInitialRender.current = false;
                }
            }, remaining);
        };

        processTransition();
        return () => {
            isMounted = false;
        };
    }, [loading, location.pathname, minSpinnerTime, waitForResources]);

    return { loading };
}
