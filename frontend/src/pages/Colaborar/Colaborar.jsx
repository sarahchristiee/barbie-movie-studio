import { useState } from "react";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import './Colaborar.css';

export default function Colaborar() {
  const [titulo, setTitulo] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [duracao, setDuracao] = useState("");
  const [ano, setAno] = useState("");
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo) {
      setMensagem("O título é obrigatório!");
      return;
    }

    const data = {
      titulo,
      orcamento: orcamento || null,
      tempo_duracao: duracao || null,
      ano: ano || null,
      poster: poster || null,
      trailer: trailer || null,
      generos: generosSelecionados,
    };

    try {
      const res = await fetch("http://localhost:8000/filmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        setMensagem(`Filme cadastrado com sucesso! ID: ${result.id_filme}`);
        setTitulo(""); setOrcamento(""); setDuracao(""); setAno(""); setPoster(""); setTrailer(""); setGenerosSelecionados([]);
      } else {
        setMensagem(result.error || "Erro ao cadastrar filme");
      }
    } catch (err) {
      setMensagem("Erro de conexão com o servidor");
      console.error(err);
    }
  };

  return (
    <div className="colaborarContainer">
      <div className="colaborarBox">
        <h2 className="colaborarTitle">Cadastrar Filme</h2>

        <form className="colaborarForm" onSubmit={handleSubmit}>
          <div className="ladoUm">
            <label>Título</label>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />

            <label>Orçamento</label>
            <input type="number" value={orcamento} onChange={e => setOrcamento(e.target.value)} />

            <label>Duração (em minutos)</label>
            <input type="text" value={duracao} onChange={e => setDuracao(e.target.value)} />

            <label>Ano</label>
            <input type="number" value={ano} onChange={e => setAno(e.target.value)} />
          </div>

          <div className="ladoDois">
            <label>Link do Poster</label>
            <input type="text" value={poster} onChange={e => setPoster(e.target.value)} />

            <label>Link do Trailer</label>
            <input type="text" value={trailer} onChange={e => setTrailer(e.target.value)} />

            <label>Gêneros</label>
            <MultiSelect 
              placeholder="Escolha os gêneros" 
              selected={generosSelecionados} 
              setSelected={setGenerosSelecionados} 
            />
          </div>

          <button type="submit">Cadastrar Filme</button>

          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}
