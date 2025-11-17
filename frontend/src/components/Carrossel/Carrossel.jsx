import { useEffect, useState } from "react";
import './Carrossel.css'
import '../Style/Variables.css'

export default function Carrossel() {
  const [filmes, setFilmes] = useState([]);

  // FECHT
  useEffect(() => {
    fetch("http://localhost:8000/filmes")
      .then(res => res.json())
      .then(data => {
        setFilmes(data.slice(0, 6));
      })
      .catch(err => console.error("Erro ao carregar filmes:", err));
  }, []);

  return (
    <div className="carrossel">
      <div className="group">
        {filmes.map((filme, index) => (
          <div key={index} className="cardDestaque">
            <img src={filme.poster} alt={filme.titulo} />
          </div>
        ))}
      </div>

      <div aria-hidden className="group">
        {filmes.map((filme, index) => (
          <div key={index} className="cardDestaque">
            <img src={filme.poster} alt={filme.titulo} />
          </div>
        ))}
      </div>
    </div>
  );
}
