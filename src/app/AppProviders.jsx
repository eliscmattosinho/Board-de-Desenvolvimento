import React from "react";

import { ThemeProvider } from "@context/ThemeContext";
import { ModalProvider } from "@context/ModalContext";
import { ScreenProvider } from "@context/ScreenContext";

import { TaskProvider } from "@task/context/TaskContext";
import { ColumnProvider } from "@column/context/ColumnContext";
import { BoardProvider } from "@board/context/BoardContext";

import { GestureProvider } from "@board/context/GestureContext";
import { BoardPanProvider } from "@board/context/BoardPanContext";
import { CardDragProvider } from "@board/context/CardDragContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <ScreenProvider>
          <ModalProvider>
            <ColumnProvider>
              <GestureProvider>
                <BoardPanProvider>
                  <CardDragProvider>
                    <BoardProvider>
                      {children}
                    </BoardProvider>
                  </CardDragProvider>
                </BoardPanProvider>
              </GestureProvider>
            </ColumnProvider>
          </ModalProvider>
        </ScreenProvider>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
