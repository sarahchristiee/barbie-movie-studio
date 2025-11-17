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
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar filme");
        return res.json();
      })
      .then(data => setFilme(data))
      .catch(err => setErro(err.message));
  }, [id_filme]);

  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (!filme) return <p>Carregando filme...</p>;

  const token = getUser()?.token;

  // EXCLUIR FILME
  const handleExcluir = async () => {
    if (!window.confirm("Tem certeza que deseja remover este filme?")) return;

    try {
      const res = await fetch(`http://localhost:8000/admin/filmes/${id_filme}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success("Filme excluído!");
        setTimeout(() => navigate("/HomeAdm"), 1200);
      } else {
        // tenta extrair mensagem de erro do JSON, se houver
        let json;
        try {
          json = await res.json();
        } catch {
          json = {};
        }
        toast.error(json.error || "Erro ao excluir");
      }
    } catch (err) {
      toast.error("Erro ao excluir");
      console.error(err);
    }
  };

  // Formatação pro link do youtube funcionar
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) return `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
    if (url.includes("youtu.be/")) return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
    return url;
  };
  const trailerUrl = getEmbedUrl(filme.trailer);

  return (
    <div className="paginaFilmeAdm">
      {trailerUrl && (
        <div className="trailerContainerAdm">
          <iframe src={trailerUrl} title="Trailer" allowFullScreen></iframe>
        </div>
      )}

      <div className="posterSinopseAdm">
        {filme.poster && <img src={filme.poster} alt={filme.titulo} className="posterAdm" />}
        <div className="detalhesAdm">
          <h1>{filme.titulo}</h1>
          <p className="sinopseAdm">{filme.sinopse}</p>
        </div>
      </div>

      <div className="fichaTecnicaAdm">
        <div className="fichaTituloAdm">
          <Clapperboard size={40} className="clapperboard" />
          <h2>Ficha Técnica</h2>
        </div>

        <div className="infoAdm">
          <p><strong>Título:</strong> {filme.titulo || "Não informado"}</p>
          <p><strong>Ano:</strong> {filme.ano || "Não informado"}</p>
          <p><strong>Duração:</strong> {filme.tempo_duracao || "Não informado"}</p>
          <p><strong>Orçamento:</strong> ${filme.orcamento || "Não informado"}</p>
          <p><strong>Gêneros:</strong> {(filme.generos && filme.generos.join(", ")) || "Não informado"}</p>
          <p><strong>Direção:</strong> {filme.diretor || "Não informado"}</p>
          <p><strong>Produção:</strong> {filme.produtora || "Não informado"}</p>
        </div>

        <div className="botoesAdm">
          <button className="btnEditarAdm" onClick={() => navigate(`/EditarAdm/${id_filme}`)}>
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
