import React from "react";
import { ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ToastProvider.css";
import { useTheme } from "../../context/ThemeContext";

const fade = cssTransition({
  enter: "fadeIn",
  exit: "fadeOut",
  duration: [300, 200],
});

const ToastProvider = () => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={fade}
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
};

export default ToastProvider;
