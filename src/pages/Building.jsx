import { useNavigate } from "react-router-dom";

import builder from "@assets/images/builder.svg";
import TypingText from "@/components/TypingText/TypingText";

import "./Building.css";
import "@styles/BuildingDots.scss";

function Building() {
  const navigate = useNavigate();

  return (
    <main id="building-container">
      <section className="building-content">
        <article className="building-intro">
          <h1 className="building-title">
            <TypingText text="Ops..." />
          </h1>
          <figure className="illustration">
            <img
              src={builder}
              className="illustration-image"
              alt="Illustration of a person climbing a ladder among clouds, reaching out with a cloth as if cleaning or touching one of the clouds. The background is green with additional small clouds scattered around."
            />
          </figure>
        </article>

        <article className="communicate-section">
          <p className="intro-text">
            <span className="w-600">Bem-vindo(a)!</span> Você chegou um pouco
            cedo. Gostaria de ver o <span className="w-600">status atual</span>{" "}
            do projeto?
          </p>

          <div className="actions">
            <button
              className="btn btn-building"
              onClick={() => navigate("/hub")}
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
        </article>
      </section>
    </main>
  );
}

export default Building;
