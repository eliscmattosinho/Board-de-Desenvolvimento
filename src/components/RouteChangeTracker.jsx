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
  const [currentLocation, setCurrentLocation] = useState(location);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useFetchInterceptor();

  useEffect(() => {
    if (location.pathname === currentLocation.pathname) return;

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

      const finish = () => {
        if (!active) return;
        setCurrentLocation(location);
        setLoading(false);
      };

      if (remaining > 0) setTimeout(finish, remaining);
      else finish();
    }, 100);

    return () => {
      active = false;
      clearTimeout(spinnerDelay);
    };
  }, [location, currentLocation]);

  // Spinner no carregamento inicial
  useEffect(() => {
    const initialTimer = setTimeout(() => setLoading(false), MIN_SPINNER_TIME);
    return () => clearTimeout(initialTimer);
  }, []);

  // Exibe spinner ou rota atual
  return loading ? (
    <Spinner />
  ) : (
    <div ref={containerRef}>
      <Suspense fallback={<Spinner />}>{children(currentLocation)}</Suspense>
    </div>
  );
};

export default RouteChangeTracker;
