import React, { useState, useEffect, useRef, Suspense } from "react";
import { useLocation } from "react-router-dom";

import Spinner from "./Spinner/Spinner";

// Hook global para interceptar fetches (tasksLoader)
const pendingFetches = new Set();
export const useFetchInterceptor = () => {
  React.useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const promise = originalFetch(...args);
      pendingFetches.add(promise);
      promise.finally(() => pendingFetches.delete(promise));
      return promise;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
};

// Espera imagens no container
const waitForImages = (container) => {
  if (!container) return Promise.resolve();
  const images = Array.from(container.querySelectorAll("img"));
  if (!images.length) return Promise.resolve();

  return new Promise((resolve) => {
    let loadedCount = 0;
    const checkDone = () => {
      loadedCount++;
      if (loadedCount === images.length) resolve();
    };
    images.forEach((img) => {
      if (img.complete) checkDone();
      else {
        img.addEventListener("load", checkDone, { once: true });
        img.addEventListener("error", checkDone, { once: true });
      }
    });
  });
};

const MIN_SPINNER_TIME = 600; // tempo mínimo (ms) que o spinner deve ficar visível

const RouteChangeTracker = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useFetchInterceptor();

  useEffect(() => {
    let active = true;
    setLoading(true);
    const startTime = Date.now();

    const spinnerDelay = setTimeout(async () => {
      if (!active) return;

      // Espera imagens do container
      if (containerRef.current) await waitForImages(containerRef.current);

      // Espera fetches pendentes
      await Promise.all(Array.from(pendingFetches));

      if (!active) return;

      // Garante que o spinner fique pelo menos MIN_SPINNER_TIME
      const elapsed = Date.now() - startTime;
      const remaining = MIN_SPINNER_TIME - elapsed;
      if (remaining > 0) {
        setTimeout(() => active && setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    }, 100); // evitar flicker rápido

    return () => {
      active = false;
      clearTimeout(spinnerDelay);
    };
  }, [location]);

  return (
    <>
      {loading && <Spinner />}
      <div ref={containerRef} style={{ display: loading ? "none" : "block" }}>
        <Suspense fallback={<Spinner />}>{children(location)}</Suspense>
      </div>
    </>
  );
};

export default RouteChangeTracker;
