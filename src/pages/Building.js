import { useNavigate } from "react-router-dom";
import "./Building.css";
import builder from "../assets/images/builder.svg";

function Building() {
  const navigate = useNavigate();

  return (
    <div className="block center building-page">
      <div id="content-block">
        <div className="block-intro">
          <h2>Ops...</h2>
          <div className="img-block">
            <img src={builder} alt="Woman builder climbing the stairs" />
          </div>
        </div>
        <div className="state-communicate">
          <p id="p-intro">
            Bem-vindo(a)! Fico feliz de te encontrar aqui, mas você chegou um pouco cedo. Gostaria de ver o status atual do projeto?
          </p>

          <button id="p-state" className="btn btn-building light w-600" onClick={() => navigate("/boards")}>
            <span>Acessar board</span>
          </button>

          <a id="sub-link" href="https://eliscmattosinho.github.io/Skeelo-Skoob-Epics/" target="_blank" rel="noopener noreferrer">projeto original</a>
        </div>
      </div>
    </div>
  );
}

export default Building;
