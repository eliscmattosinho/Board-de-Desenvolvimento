import React from "react";

import { ThemeProvider } from "@context/ThemeContext";
import { ModalProvider } from "@context/ModalContext";
import { ScreenProvider } from "@context/ScreenContext";

import { TaskProvider } from "@task/context/TaskContext";
import { ColumnProvider } from "@column/context/ColumnContext";
import { BoardProvider } from "@board/context/BoardContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <ScreenProvider>
          <ModalProvider>
            <ColumnProvider>
              <BoardProvider>
                {children}
              </BoardProvider>
            </ColumnProvider>
          </ModalProvider>
        </ScreenProvider>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
