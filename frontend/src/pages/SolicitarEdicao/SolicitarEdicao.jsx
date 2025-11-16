import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../../Auth/Auth";
import "./SolicitarEdicao.css";

export default function SolicitarEdicao() {
  const { id_filme } = useParams();

  const [original, setOriginal] = useState({});
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

  useEffect(() => {
    fetch(`http://localhost:8000/filmes/${id_filme}`)
      .then((res) => res.json())
      .then((data) => {
        setOriginal(data);

        setTitulo(data.titulo || "");
        setAno(data.ano || "");
        setOrcamento(data.orcamento || "");
        setDuracao(data.tempo_duracao || "");
        setPoster(data.poster || "");
        setTrailer(data.trailer || "");
        setSinopse(data.sinopse || "");
        setGenerosSelecionados(data.generos || []);
        setDiretor(data.diretores?.join(", ") || "");
        setProdutora(data.produtoras?.join(", ") || "");
      })
      .catch(() => toast.error("Erro ao carregar filme"));
  }, [id_filme]);

  // envia 1 solicitação por campo
  const solicitarCampo = async (campo, valor) => {
    const user = getUser();
    const token = user?.token;

    const res = await fetch(
      `http://localhost:8000/user/filmes/${id_filme}/edicao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campo, valor }),
      }
    );

    const json = await res.json();
    return res.ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getUser();
    if (!user?.token) {
      toast.error("Você precisa estar logado.");
      return;
    }

    let count = 0;

    if (titulo !== original.titulo) {
      await solicitarCampo("titulo", titulo);
      count++;
    }
    if (orcamento !== original.orcamento) {
      await solicitarCampo("orcamento", orcamento);
      count++;
    }
    if (duracao !== original.tempo_duracao) {
      await solicitarCampo("tempo_duracao", duracao);
      count++;
    }
    if (ano !== original.ano) {
      await solicitarCampo("ano", ano);
      count++;
    }
    if (poster !== original.poster) {
      await solicitarCampo("poster", poster);
      count++;
    }
    if (trailer !== original.trailer) {
      await solicitarCampo("trailer", trailer);
      count++;
    }
    if (sinopse !== original.sinopse) {
      await solicitarCampo("sinopse", sinopse);
      count++;
    }

    // comparação de array
    if (
      JSON.stringify(generosSelecionados) !==
      JSON.stringify(original.generos)
    ) {
      await solicitarCampo("generos", generosSelecionados);
      count++;
    }

    if (diretor !== original.diretores?.join(", ")) {
      await solicitarCampo("diretor", diretor);
      count++;
    }

    if (produtora !== original.produtoras?.join(", ")) {
      await solicitarCampo("produtora", produtora);
      count++;
    }

    if (count === 0) {
      toast.info("Nenhuma alteração detectada.");
      return;
    }

    toast.success("Solicitação de edição enviada!");
  };

  return (
    <div className="colaborarContainer">
      <div className="colaborarBox">
        <h2 className="colaborarTitle">Editar Filme</h2>

        <form className="colaborarForm" onSubmit={handleSubmit}>
          <div className="inputsWrapper">
            {/* COLUNA 1 */}
            <div className="ladoUm">
              <label>Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />

              <label>Ano</label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />

              <label>Orçamento</label>
              <input
                type="number"
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
              />

              <label>Duração</label>
              <input
                type="text"
                placeholder="HH:MM:SS"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
              />

              <label>Gêneros</label>
              <MultiSelect
                selected={generosSelecionados}
                setSelected={setGenerosSelecionados}
              />

              <label>Diretor(es)</label>
              <input
                type="text"
                value={diretor}
                onChange={(e) => setDiretor(e.target.value)}
              />
            </div>

            {/* COLUNA 2 */}
            <div className="ladoDois">
              <label>Sinopse</label>
              <textarea
                value={sinopse}
                onChange={(e) => setSinopse(e.target.value)}
              />

              <label>Produtora(s)</label>
              <input
                type="text"
                value={produtora}
                onChange={(e) => setProdutora(e.target.value)}
              />

              <label>Poster (URL)</label>
              <input
                type="text"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
              />

              <label>Trailer (URL)</label>
              <input
                type="text"
                value={trailer}
                onChange={(e) => setTrailer(e.target.value)}
              />
            </div>
          </div>

          <div className="submitWrapper">
            <button className="submitButton" type="submit">
              Enviar Solicitação
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
