import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../../Auth/Auth";
import "./EditarAdm.css";

export default function EditarAdm() {
  const { id_filme } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [duracao, setDuracao] = useState("");
  const [ano, setAno] = useState("");
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  const [diretor, setDiretor] = useState("");
  const [produtora, setProdutora] = useState("");

  // ==========================
  //   BUSCAR FILME
  // ==========================
  useEffect(() => {
    const fetchFilme = async () => {
      try {
        const res = await fetch(`http://localhost:8000/filmes/${id_filme}`);
        if (!res.ok) throw new Error("Erro ao buscar filme");

        const data = await res.json();

        setTitulo(data.titulo || "");
        setAno(data.ano || "");
        setOrcamento(data.orcamento || "");
        setDuracao(data.tempo_duracao || "");
        setPoster(data.poster || "");
        setTrailer(data.trailer || "");
        setSinopse(data.sinopse || "");

        // Corrigir gêneros vindos do backend
        const generosCorrigidos = (data.generos || [])
          .map((g) =>
            typeof g === "string"
              ? g
              : g.nome
              ? g.nome
              : g.genero?.nome
              ? g.genero.nome
              : null
          )
          .filter(Boolean);

        setGenerosSelecionados(generosCorrigidos);

        setDiretor(data.diretor || "");
        setProdutora(data.produtora || "");

        setLoading(false);
      } catch (err) {
        toast.error("Erro ao carregar filme");
        console.error(err);
      }
    };

    fetchFilme();
  }, [id_filme]);

  // ==========================
  //   SUBMIT DO ADMIN
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getUser();
    const token = user?.token;

    if (!token || user.role !== "admin") {
      toast.error("Apenas administradores podem editar diretamente.");
      return;
    }

    const generos = generosSelecionados
      .map((g) => (typeof g === "string" ? g : g?.nome || g?.value || ""))
      .filter(Boolean);

    const anoInt = ano ? parseInt(ano, 10) : null;

    const data = {
      titulo: titulo.trim(),
      orcamento: orcamento ? parseFloat(orcamento) : null,
      tempo_duracao: duracao.trim() || null,
      ano: anoInt,
      poster: poster.trim() || null,
      trailer: trailer.trim() || null,
      sinopse: sinopse.trim() || null,
      generos,
      diretor: diretor.trim() || null,
      produtora: produtora.trim() || null,
    };

    try {
      const res = await fetch(`http://localhost:8000/admin/filmes/${id_filme}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Filme atualizado com sucesso!");
        setTimeout(() => navigate(`/HomeAdm`), 1000);
      } else {
        toast.error(json.error || "Erro ao atualizar filme");
      }
    } catch (err) {
      toast.error("Erro de conexão");
      console.error(err);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="admContainer">
      <div className="admBox">
        <h2 className="admTitle">Editar Filme (Admin)</h2>

        <form className="admForm" onSubmit={handleSubmit}>
          <div className="admInputsWrapper">
            <div className="admCol1">
              <label>Título</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

              <label>Ano</label>
              <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} />

              <label>Orçamento</label>
              <input type="number" value={orcamento} onChange={(e) => setOrcamento(e.target.value)} />

              <label>Duração</label>
              <input type="text" value={duracao} onChange={(e) => setDuracao(e.target.value)} />

              <label>Gêneros</label>
              <MultiSelect selected={generosSelecionados} setSelected={setGenerosSelecionados} />

              <label>Diretor</label>
              <input type="text" value={diretor} onChange={(e) => setDiretor(e.target.value)} />
            </div>

            <div className="admCol2">
              <label>Sinopse</label>
              <textarea value={sinopse} onChange={(e) => setSinopse(e.target.value)} />

              <label>Produtora</label>
              <input type="text" value={produtora} onChange={(e) => setProdutora(e.target.value)} />

              <label>Poster</label>
              <input type="text" value={poster} onChange={(e) => setPoster(e.target.value)} />

              <label>Trailer</label>
              <input type="text" value={trailer} onChange={(e) => setTrailer(e.target.value)} />
            </div>
          </div>

          <div className="admSubmitWrapper">
            <button className="admSubmitButton" type="submit">
              Atualizar Filme
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
