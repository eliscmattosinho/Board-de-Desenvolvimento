import React from "react";
import { useTheme } from "@context/ThemeContext";

import svgDarkBoard from "@assets/img/svg-board.svg";
import svgLightBoard from "@assets/img/svg-light-board.svg";

import BoardControls from "@board/components/BoardControls/BoardControls";

export default function HubHeader() {
  const { theme } = useTheme();
  const boardImage = theme === "dark" ? svgDarkBoard : svgLightBoard;

  return (
    <header className="hub-header">
      <div className="hub-introduction">
        <div className="hub-infos">
          <h1 className="hub-title title-thematic">Development Hub</h1>
          <p>Escolha seu board de visualização.</p>
        </div>

        <BoardControls />
      </div>

      <figure className="img-container hub-img-container">
        <img src={boardImage} alt="Illustration of a dashboard interface" />
      </figure>
    </header>
  );
}
