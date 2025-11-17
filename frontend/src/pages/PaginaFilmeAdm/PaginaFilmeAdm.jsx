import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clapperboard, Pencil, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { getUser } from "../../Auth/Auth";
import "react-toastify/dist/ReactToastify.css";
import "./PaginaFilmeAdm.css";

export default function PaginaFilmeAdm() {
  const { id_filme } = useParams();
  const navigate = useNavigate();

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

  const token = getUser()?.token;

  // EXCLUIR
  const handleExcluir = async () => {
    if (!window.confirm("Tem certeza que deseja remover este filme?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/admin/filmes/${id_filme}/deletar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const json = await res.json();

      if (res.ok) {
        toast.success("Filme excluído!");
        setTimeout(() => navigate("/admin/filmes"), 1200);
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  };

  // EMBED
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const trailerUrl = getEmbedUrl(filme.trailer);

  return (
    <div className="paginaFilmeAdm">
      
      {/* Trailer */}
      {trailerUrl && (
        <div className="trailerContainerAdm">
          <iframe src={trailerUrl} title="Trailer" allowFullScreen></iframe>
        </div>
      )}

      {/* Poster + Sinopse */}
      <div className="posterSinopseAdm">
        {filme.poster && (
          <img src={filme.poster} alt={filme.titulo} className="posterAdm" />
        )}

        <div className="detalhesAdm">
          <h1>{filme.titulo}</h1>
          <p className="sinopseAdm">{filme.sinopse}</p>
        </div>
      </div>

      {/* Ficha Técnica */}
      <div className="fichaTecnicaAdm">
        
        <div className="fichaTituloAdm">
          <Clapperboard size={40} className="clapperboard" />
          <h2>Ficha Técnica</h2>
        </div>

        <div className="infoAdm">
          <p><strong>Título:</strong> {filme.titulo}</p>
          <p><strong>Ano:</strong> {filme.ano}</p>
          <p><strong>Duração:</strong> {filme.tempo_duracao} min</p>
          <p><strong>Orçamento:</strong> ${filme.orcamento}</p>
          <p><strong>Gêneros:</strong> {filme.generos?.join(", ")}</p>
          <p><strong>Direção:</strong> {filme.diretores?.join(", ")}</p>
          <p><strong>Produção:</strong> {filme.produtoras?.join(", ")}</p>
        </div>

        {/* BOTÕES ADMIN */}
        <div className="botoesAdm">
          <button
            className="btnEditarAdm"
            onClick={() => navigate(`/admin/editar/${id_filme}`)}
          >
            <Pencil size={20} /> Editar
          </button>

          <button className="btnExcluirAdm" onClick={handleExcluir}>
            <Trash2 size={20} /> Remover
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
