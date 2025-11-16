import { useState } from "react";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Colaborar.css';
import { getUser } from "../../Auth/Auth";

export default function Colaborar() {

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getUser();
    const token = user?.token;

    if (!token) {
      toast.error("Você precisa estar logado para enviar um filme.");
      return;
    }

    const data = {
      titulo,
      orcamento: orcamento || null,
      tempo_duracao: duracao || null,
      ano: ano || null,
      poster: poster || null,
      trailer: trailer || null,
      sinopse: sinopse || null,
      generos: generosSelecionados,
      diretor,
      produtora
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

        setTitulo(""); 
        setOrcamento(""); 
        setDuracao(""); 
        setAno("");
        setPoster(""); 
        setTrailer(""); 
        setSinopse(""); 
        setGenerosSelecionados([]);
        setDiretor("");
        setProdutora("");
      } else {
        toast.error(result.error || "Erro ao enviar filme");
      }

    } catch (err) {
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
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

              <label>Ano</label>
              <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} />

              <label>Orçamento</label>
              <input type="number" value={orcamento} onChange={(e) => setOrcamento(e.target.value)} />

              <label>Duração</label>
              <input type="text" placeholder="HH:MM:SS" value={duracao} onChange={(e) => setDuracao(e.target.value)} />

              <label>Gêneros</label>
              <MultiSelect selected={generosSelecionados} setSelected={setGenerosSelecionados} />

              <label>Diretor</label>
              <input type="text" value={diretor} onChange={(e) => setDiretor(e.target.value)} />
            </div>

            <div className="ladoDois">
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

          <div className="submitWrapper">
            <button className="submitButton" type="submit">Cadastrar Filme</button>
          </div>

        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
