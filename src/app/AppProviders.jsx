import React from "react";

import { ThemeProvider } from "@context/ThemeContext";
import { ModalProvider } from "@context/ModalContext";
import { TaskProvider } from "@task/context/TaskProvider";
import { ScreenProvider } from "@context/ScreenContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <ScreenProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </ScreenProvider>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
