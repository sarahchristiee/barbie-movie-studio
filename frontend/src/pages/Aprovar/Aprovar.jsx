import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import { toast, ToastContainer } from "react-toastify";
import "./Aprovar.css";
import { getUser } from "../../Auth/Auth";

export default function Aprovar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Campos editáveis
  const [titulo, setTitulo] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [duracao, setDuracao] = useState("");
  const [ano, setAno] = useState("");
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [generos, setGeneros] = useState([]);
  const [diretor, setDiretor] = useState("");
  const [produtora, setProdutora] = useState("");

  useEffect(() => {
    const fetchSolicitacao = async () => {
      const user = getUser();
      const token = user?.token;
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/admin/solicitacoes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const all = await res.json();
        const encontrado = all.find((s) => String(s.id) === String(id));
        if (!encontrado) {
          toast.error("Solicitação não encontrada.");
          return;
        }

        setDados(encontrado);
        const d = encontrado.dados_editados || {};

        if (encontrado.tipo === "novo_filme" || encontrado.tipo === "edicao") {
          setTitulo(d.titulo ?? "");
          setAno(d.ano ?? "");
          setOrcamento(d.orcamento ?? "");
          setDuracao(d.tempo_duracao ?? "");
          setPoster(d.poster ?? "");
          setTrailer(d.trailer ?? "");
          setSinopse(d.sinopse ?? "");
          setGeneros(d.generos ?? []);
          setDiretor(d.diretor ?? "");
          setProdutora(d.produtora ?? "");
        }

      } catch {
        toast.error("Erro ao carregar solicitação");
      } finally {
        setCarregando(false);
      }
    };

    fetchSolicitacao();
  }, [id]);

  const handleAprovar = async () => {
    const user = getUser();
    const token = user?.token;
    if (!token || !dados) return;

    // Atualiza dados.dados_editados com os valores atuais do formulário
    const dadosAtualizados = {
      ...dados.dados_editados,
      titulo,
      orcamento,
      tempo_duracao: duracao,
      ano,
      poster,
      trailer,
      sinopse,
      generos,
      diretor,
      produtora,
    };

    try {
      let res;
      if (dados.tipo === "novo_filme") {
        // Novo filme: POST
        res = await fetch("http://localhost:8000/admin/filmes/novo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dadosAtualizados),
        });
      } else if (dados.tipo === "edicao") {
        // Edição de filme existente: PUT
        const idFilme = dados.id_filme;
        res = await fetch(`http://localhost:8000/admin/filmes/${idFilme}/editar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dadosAtualizados),
        });
      } else {
        toast.error("Tipo de solicitação desconhecido");
        return;
      }

      const json = await res.json();
      if (res.ok) {
        toast.success("Solicitação aprovada!");
        setTimeout(() => navigate("/Solicitacoes"), 1000);
      } else {
        toast.error(json.error || "Erro ao aprovar solicitação");
      }
    } catch (err) {
      toast.error("Erro ao aprovar");
      console.error(err);
    }
  };

  const handleRecusar = async () => {
    const user = getUser();
    const token = user?.token;
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/admin/solicitacoes/${id}/rejeitar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Solicitação recusada!");
        setTimeout(() => navigate("/Solicitacoes"), 1000);
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Erro ao recusar solicitação.");
      }
    } catch {
      toast.error("Erro ao recusar");
    }
  };

  if (carregando) return <p>Carregando...</p>;

  return (
    <div className="colaborarContainer">
      <div className="colaborarBox">
        <h2 className="colaborarTitle">Aprovar Solicitação</h2>

        <form className="colaborarForm" onSubmit={(e) => e.preventDefault()}>
          <div className="inputsWrapper">
            <div className="ladoUm">
              <label>Título</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />

              <label>Ano</label>
              <input value={ano} onChange={(e) => setAno(e.target.value)} />

              <label>Orçamento</label>
              <input value={orcamento} onChange={(e) => setOrcamento(e.target.value)} />

              <label>Duração</label>
              <input value={duracao} onChange={(e) => setDuracao(e.target.value)} />

              <label>Gêneros</label>
              <MultiSelect selected={generos} setSelected={setGeneros} />

              <label>Diretor</label>
              <input value={diretor} onChange={(e) => setDiretor(e.target.value)} />
            </div>

            <div className="ladoDois">
              <label>Sinopse</label>
              <textarea value={sinopse} onChange={(e) => setSinopse(e.target.value)} />

              <label>Produtora</label>
              <input value={produtora} onChange={(e) => setProdutora(e.target.value)} />

              <label>Poster</label>
              <input value={poster} onChange={(e) => setPoster(e.target.value)} />

              <label>Trailer</label>
              <input value={trailer} onChange={(e) => setTrailer(e.target.value)} />
            </div>
          </div>

          <div className="botoesAprovar">
            <button type="button" className="btnAprovar" onClick={handleAprovar}>
              Aprovar
            </button>
            <button type="button" className="btnRecusar" onClick={handleRecusar}>
              Recusar
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
