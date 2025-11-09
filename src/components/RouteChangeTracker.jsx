import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

import Spinner from "./Spinner/Spinner";

const RouteChangeTracker = ({ children }) => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(location);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let spinnerTimer;
    let routeUpdateTimer;

    if (location.pathname !== currentLocation.pathname) {
      // Delay curto antes de mostrar o spinner
      spinnerTimer = setTimeout(() => setLoading(true), 200);

      // Atualiza a rota depois do spinner (imediatamente se load rápido)
      routeUpdateTimer = setTimeout(() => {
        setCurrentLocation(location);
        setLoading(false);
      }, 600);
    }

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(routeUpdateTimer);
    };
  }, [location, currentLocation]);

  // Spinner no carregamento inicial
  useEffect(() => {
    const initialTimer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(initialTimer);
  }, []);

  return loading ? <Spinner /> : children(currentLocation);
};

export default RouteChangeTracker;
