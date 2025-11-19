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
  const [generosSelecionados, setGenerosSelecionados] = useState([]); // [id]
  const [diretor, setDiretor] = useState("");
  const [produtora, setProdutora] = useState("");
  const [opcoesGeneros, setOpcoesGeneros] = useState([]); // [{id, nome}]

  // 🔥 Carrega todos os gêneros disponíveis
  useEffect(() => {
    fetch("http://localhost:8000/generos")
      .then((res) => res.json())
      .then((data) => {
        // transformar em {id, nome}
        const generosFormatados = data.map((g, index) => ({ id: index, nome: g.nome }));
        setOpcoesGeneros(generosFormatados);
      })
      .catch(() => toast.error("Erro ao carregar gêneros"));
  }, []);

  // 🔥 Carrega filme original
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

        // Selecionar gêneros pelo id correspondente
        const generosIds = (data.generos || []).map((g) => {
          const generoObj = opcoesGeneros.find((o) => o.nome === g);
          return generoObj ? generoObj.id : null;
        }).filter((id) => id !== null);
        setGenerosSelecionados(generosIds);

        setDiretor((data.diretor || []).join ? data.diretor.join(", ") : data.diretor || "");
        setProdutora((data.produtora || []).join ? data.produtora.join(", ") : data.produtora || "");
      })
      .catch(() => toast.error("Erro ao carregar filme"));
  }, [id_filme, opcoesGeneros]);

  // 🔥 Função para solicitar edição de um campo
  const solicitarCampo = async (campo, valor) => {
    const user = getUser();
    const token = user?.token;
    if (!token) {
      toast.error("Você precisa estar logado.");
      return false;
    }

    try {
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
      return res.ok;
    } catch (err) {
      toast.error("Erro ao enviar solicitação");
      console.error(err);
      return false;
    }
  };

  // 🔥 Envia todas as alterações
  const handleSubmit = async (e) => {
    e.preventDefault();
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

    const generosNomes = generosSelecionados.map((id) => {
      const g = opcoesGeneros.find((o) => o.id === id);
      return g ? g.nome : null;
    }).filter((g) => g !== null);

    if (JSON.stringify(generosNomes) !== JSON.stringify(original.generos)) {
      await solicitarCampo("generos", generosNomes);
      count++;
    }

    if (diretor !== (original.diretor || "").toString()) {
      await solicitarCampo("diretor", diretor);
      count++;
    }
    if (produtora !== (original.produtora || "").toString()) {
      await solicitarCampo("produtora", produtora);
      count++;
    }

    if (count === 0) {
      toast.info("Nenhuma alteração detectada.");
    } else {
      toast.success("Solicitação de edição enviada!");
    }
  };

  return (
    <div className="editarContainer">
      <div className="editarBox">
        <h2 className="editarTitulo">Editar Filme</h2>
        <form className="editarForm" onSubmit={handleSubmit}>
          <div className="editarInputsWrapper">
            <div className="editarColunaUm">
              <label>Título</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <label>Ano</label>
              <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} />
              <label>Orçamento</label>
              <input type="number" value={orcamento} onChange={(e) => setOrcamento(e.target.value)} />
              <label>Duração</label>
              <input type="text" placeholder="HH:MM:SS" value={duracao} onChange={(e) => setDuracao(e.target.value)} />
              <label>Gêneros</label>
              <MultiSelect
                options={opcoesGeneros}
                value={generosSelecionados}
                onChange={setGenerosSelecionados}
                placeholder="Selecionar Gêneros"
              />
              <label>Diretor(es)</label>
              <input type="text" value={diretor} onChange={(e) => setDiretor(e.target.value)} />
            </div>
            <div className="editarColunaDois">
              <label>Sinopse</label>
              <textarea value={sinopse} onChange={(e) => setSinopse(e.target.value)} />
              <label>Produtora(s)</label>
              <input type="text" value={produtora} onChange={(e) => setProdutora(e.target.value)} />
              <label>Poster (URL)</label>
              <input type="text" value={poster} onChange={(e) => setPoster(e.target.value)} />
              <label>Trailer (URL)</label>
              <input type="text" value={trailer} onChange={(e) => setTrailer(e.target.value)} />
            </div>
          </div>
          <div className="editarSubmitWrapper">
            <button className="editarSubmitBtn" type="submit">Enviar Solicitação</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
