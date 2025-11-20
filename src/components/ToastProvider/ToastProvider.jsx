import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ToastProvider.css";
import { useTheme } from "@context/ThemeContext";

const ToastProvider = () => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      closeButton={false}
      transition={Slide}
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
};

export default ToastProvider;
