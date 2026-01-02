import React from "react";

import { ThemeProvider } from "@context/ThemeContext";
import { ModalProvider } from "@context/ModalContext";
import { ScreenProvider } from "@context/ScreenContext";

import { CardProvider } from "@card/context/CardContext";
import { ColumnProvider } from "@column/context/ColumnContext";
import { BoardProvider } from "@board/context/BoardContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <ScreenProvider>
        <CardProvider>
          <ColumnProvider>
            <BoardProvider>
              <ModalProvider>
                {children}
              </ModalProvider>
            </BoardProvider>
          </ColumnProvider>
        </CardProvider>
      </ScreenProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
