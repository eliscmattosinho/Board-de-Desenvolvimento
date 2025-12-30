import React from "react";

import { ThemeProvider } from "@context/ThemeContext";
import { ModalProvider } from "@context/ModalContext";
import { ScreenProvider } from "@context/ScreenContext";

import { CardProvider } from "@/features/card/context/CardContext";
import { ColumnProvider } from "@column/context/ColumnContext";
import { BoardProvider } from "@board/context/BoardContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <CardProvider>
        <ScreenProvider>
          <ModalProvider>
            <ColumnProvider>
              <BoardProvider>
                {children}
              </BoardProvider>
            </ColumnProvider>
          </ModalProvider>
        </ScreenProvider>
      </CardProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
