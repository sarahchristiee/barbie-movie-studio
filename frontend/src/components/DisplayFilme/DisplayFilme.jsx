import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../Auth/Auth";
import "./DisplayFilme.css";

export default function DisplayFilme({ filmes }) {
  const navigate = useNavigate();

  const handleClick = (id_filme) => {
    if (isAdmin()) {
      navigate(`/PaginaFilmeAdm/${id_filme}`);
    } else {
      navigate(`/PaginaFilme/${id_filme}`);
    }
  };

  return (
    <div className="DisplayFilmeContainer">
      {(!filmes || filmes.length === 0) ? (
        <p className="nenhumFilme">Nenhum filme encontrado</p>
      ) : (
        filmes.map((filme) => (
          <div
            className="DisplayFilme"
            key={filme.id_filme}
            onClick={() => handleClick(filme.id_filme)}
            style={{ cursor: "pointer" }}
          >
            <img src={filme.poster || ""} alt={filme.titulo} />
            <div className="meta">
              <p className="nomeFilme">{filme.titulo}</p>
              <p className="anoFilme">{filme.ano}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
