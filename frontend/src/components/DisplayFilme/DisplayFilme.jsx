import { useEffect, useState } from "react";
// 1. Importar o componente Link do React Router DOM
import { Link } from 'react-router-dom'; 
import './DisplayFilme.css';
import '../Style/Variables.css';

export default function DisplayFilme() {
  const [filmes, setFilmes] = useState([]);

  // filmes do backend
  useEffect(() => {
    fetch("http://localhost:8000/filmes")
      .then(res => res.json())
      .then(data => setFilmes(data))
      .catch(err => console.error("Erro ao carregar filmes:", err));
  }, []);

  return (
    <div className="DisplayFilmeContainer">
      {filmes.map((filme) => (
        // 2. Substituir a div por <Link> e definir o caminho (path) com o ID
        // Isso fará o redirecionamento para PaginaFilme (assumindo que a rota está configurada)
        <Link 
          to={`/filme/${filme.id_filme}`} // O caminho deve ser `/filme/1`, `/filme/2`, etc.
          className="DisplayFilme" 
          key={filme.id_filme}
        >
          <img src={filme.poster || ""} alt={filme.titulo} />
          <p className="nomeFilme">{filme.titulo} - {filme.ano}</p>
        </Link>
      ))}
    </div>
  );
}