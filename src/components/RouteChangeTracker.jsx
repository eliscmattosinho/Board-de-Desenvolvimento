import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const RouteChangeTracker = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // show spinner on reload
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Spinner on route change
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setLoading(true);
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [location, currentPath]);

  // Initial mount: hide spinner after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Spinner /> : children;
};

export default RouteChangeTracker;
