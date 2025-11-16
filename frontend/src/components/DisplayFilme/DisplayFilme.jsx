import { Link } from "react-router-dom";
import "./DisplayFilme.css";

export default function DisplayFilme({ filmes }) {
  return (
    <div className="DisplayFilmeContainer">
      {(!filmes || filmes.length === 0) ? (
        <p className="nenhumFilme">Nenhum filme encontrado</p>
      ) : (
        filmes.map((filme) => (
          <Link
            className="DisplayFilme"
            key={filme.id_filme}
            to={`/PaginaFilme/${filme.id_filme}`}
          >
            <img src={filme.poster || ""} alt={filme.titulo} />
            <div className="meta">
              <p className="nomeFilme">{filme.titulo}</p>
              <p className="anoFilme">{filme.ano}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
