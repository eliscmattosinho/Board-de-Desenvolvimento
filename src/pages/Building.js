import { useNavigate } from "react-router-dom";
import "./Building.css";
import builder from "../assets/images/builder.svg";

function Building() {
  const navigate = useNavigate();

  return (
    <div className="block center">
      <div id="content-block">
        <div className="block-intro">
          <h2>Ops...</h2>
          <div className="builder">
            <img src={builder} alt="Woman builder climbing the stairs" />
          </div>
        </div>
        <div className="state-communicate">
          <p id="block-p">
            Bem-vindo(a)! Fico feliz de te encontrar aqui, mas você chegou um pouco cedo, 
            gostaria de ver o status atual do projeto?
          </p>

          <button id="p-state" className="btn-p-state" onClick={() => navigate("/boards")}>
            Acessar board
          </button>

          <a id="sub-link" href="https://eliscmattosinho.github.io/Skeelo-Skoob-Epics/" target="_blank" rel="noopener noreferrer">projeto original</a>
        </div>
      </div>
    </div>
  );
}

export default Building;
