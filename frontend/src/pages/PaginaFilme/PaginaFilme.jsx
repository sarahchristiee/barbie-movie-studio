import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PaginaFilme.css";

export default function PaginaFilme() {
  const { id_filme } = useParams();
  const [filme, setFilme] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/filmes/${id_filme}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar filme");
        return res.json();
      })
      .then((data) => setFilme(data))
      .catch((err) => setErro(err.message));
  }, [id_filme]);

  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (!filme) return <p>Carregando filme...</p>;

  // converter link do trailer para embed (YouTube)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const trailerUrl = getEmbedUrl(filme.trailer);

  return (
    <div className="pagina-filme">
      {/* Trailer */}
      {trailerUrl && (
        <div className="trailer-container">
          <iframe
            src={trailerUrl}
            title={`Trailer de ${filme.titulo}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Poster e Sinopse */}
      <div className="poster-sinopse">
        {filme.poster && (
          <img
            src={filme.poster}
            alt={`Poster de ${filme.titulo}`}
            className="poster"
          />
        )}

        <div className="detalhes">
          <h1>{filme.titulo}</h1>
          <p className="sinopse">
            {filme.sinopse || "Sinopse não disponível."}
          </p>
        </div>
      </div>

      {/* Ficha Técnica */}
      <div className="ficha-tecnica">
        <h2>Ficha Técnica</h2>
        <div className="info">
          <p><strong>Ano de lançamento:</strong> {filme.ano}</p>
          <p><strong>Duração:</strong> {filme.tempo_duracao} min</p>
          <p><strong>Orçamento:</strong> ${filme.orcamento}</p>
        </div>

        <button className="botao-editar">Solicitar Edição</button>
      </div>
    </div>
  );
}
