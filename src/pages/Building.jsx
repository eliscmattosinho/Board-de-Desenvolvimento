import { useNavigate } from "react-router-dom";

import builder from "@assets/images/builder.svg";
import TypingText from "@components/TypingText";

import "./Building.css";
import "@styles/BuildingDots.scss";

function Building() {
  const navigate = useNavigate();

  return (
    <div id="building-container">
      <div className="building-content">
        <div className="intro-section">
          <h2 className="building-title">
            <TypingText text="Ops..." />
          </h2>
          <div className="img-container">
            <img
              src={builder}
              id="img-builder"
              alt="Illustration of a person climbing a ladder among clouds, reaching out with a cloth as if cleaning or touching one of the clouds. The background is green with additional small clouds scattered around."
            />
          </div>
        </div>

        <div className="communicate-section">
          <p className="intro-text">
            <span className="w-600">Bem-vindo(a)!</span> Você chegou um pouco
            cedo. Gostaria de ver o <span className="w-600">status atual</span>{" "}
            do projeto?
          </p>

          <div className="actions-block">
            <button
              className="btn btn-building"
              onClick={() => navigate("/boards")}
            >
              <span>Acessar board</span>
            </button>
            <a
              className="sub-link"
              href="https://eliscmattosinho.github.io/Skeelo-Skoob-Epics/"
              target="_blank"
              rel="noopener noreferrer"
            >
              projeto original
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Building;
