import { useEffect, useState } from "react";
import './DisplayFilme.css';
import '../Style/Variables.css';

export default function DisplayFilme() {
  const [filmes, setFilmes] = useState([]);

  //filmes do backend
  useEffect(() => {
    fetch("http://localhost:8000/filmes")
      .then(res => res.json())
      .then(data => setFilmes(data))
      .catch(err => console.error("Erro ao carregar filmes:", err));
  }, []);

  return (
    <div className="DisplayFilmeContainer">
      {filmes.map((filme) => (
        <div className="DisplayFilme" key={filme.id_filme}>
          <img src={filme.poster || ""} alt={filme.titulo} />
          <p className="nomeFilme">{filme.titulo} - {filme.ano}</p>
        </div>
      ))}
    </div>
  );
}
