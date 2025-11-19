import { useState, useEffect } from "react";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Colaborar.css';
import { getUser } from "../../Auth/Auth";

export default function Colaborar() {
  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [duracao, setDuracao] = useState("");
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [diretor, setDiretor] = useState("");
  const [produtora, setProdutora] = useState("");

  // Gêneros
  const [generos, setGeneros] = useState([]);        // Lista completa da API
  const [generosSelecionados, setGenerosSelecionados] = useState([]); // IDs selecionados

  // Busca os gêneros
  useEffect(() => {
    async function fetchGeneros() {
      try {
        const res = await fetch("http://localhost:8000/generos");
        const data = await res.json();
        setGeneros(data); // espera: [{ id:1, nome:"Aventura" }, ...]
      } catch (err) {
        toast.error("Erro ao carregar gêneros");
      }
    }
    fetchGeneros();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getUser();
    const token = user?.token;

    if (!token) {
      toast.error("Você precisa estar logado para enviar um filme.");
      return;
    }

    // Validação de duração HH:MM:SS
    const duracaoValida = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (duracao && !duracaoValida.test(duracao)) {
      toast.error("Duração inválida. Use o formato HH:MM:SS");
      return;
    }

    const data = {
      titulo,
      ano: ano ? parseInt(ano) : null,
      orcamento: orcamento ? parseFloat(orcamento) : null,
      tempo_duracao: duracao || null,
      poster: poster || null,
      trailer: trailer || null,
      sinopse: sinopse || null,
      generos: generosSelecionados.length ? generosSelecionados : null, // envia IDs
      diretor: diretor || null,
      produtora: produtora || null,
    };

    try {
      const res = await fetch("http://localhost:8000/user/filmes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Filme enviado para aprovação!");
        // Limpa formulário
        setTitulo(""); setAno(""); setOrcamento(""); setDuracao("");
        setPoster(""); setTrailer(""); setSinopse(""); setDiretor(""); setProdutora("");
        setGenerosSelecionados([]);
      } else {
        toast.error(result.error || "Erro ao enviar filme");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="colaborarContainer">
      <div className="colaborarBox">
        <h2 className="colaborarTitle">Cadastrar Filme</h2>
        <form className="colaborarForm" onSubmit={handleSubmit}>
          <div className="inputsWrapper">
            <div className="ladoUm">
              <label>Título</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />

              <label>Ano</label>
              <input type="number" value={ano} onChange={e => setAno(e.target.value)} />

              <label>Orçamento</label>
              <input type="number" value={orcamento} onChange={e => setOrcamento(e.target.value)} />

              <label>Duração</label>
              <input type="text" placeholder="HH:MM:SS" value={duracao} onChange={e => setDuracao(e.target.value)} />

              <label>Gêneros</label>
              <MultiSelect
                options={generos}                  // [{id, nome}]
                value={generosSelecionados}        // [id1, id2]
                onChange={setGenerosSelecionados}  // atualiza IDs
              />

              <label>Diretor</label>
              <input type="text" value={diretor} onChange={e => setDiretor(e.target.value)} />
            </div>

            <div className="ladoDois">
              <label>Sinopse</label>
              <textarea value={sinopse} onChange={e => setSinopse(e.target.value)} />

              <label>Produtora</label>
              <input type="text" value={produtora} onChange={e => setProdutora(e.target.value)} />

              <label>Poster</label>
              <input type="text" value={poster} onChange={e => setPoster(e.target.value)} />

              <label>Trailer</label>
              <input type="text" value={trailer} onChange={e => setTrailer(e.target.value)} />
            </div>
          </div>

          <div className="submitWrapper">
            <button type="submit" className="submitButton">Cadastrar Filme</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
