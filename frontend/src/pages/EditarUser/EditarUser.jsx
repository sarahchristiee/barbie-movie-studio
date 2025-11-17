import { useState } from "react";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import './EditarUser.css';

export default function EditarUser() {

  const [titulo, setTitulo] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [duracao, setDuracao] = useState("");
  const [ano, setAno] = useState("");
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [generosSelecionados, setGenerosSelecionados] = useState([]);

  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // campos form
    const data = {
      titulo,
      orcamento: orcamento || null,
      tempo_duracao: duracao || null,
      ano: ano || null,
      poster: poster || null,
      trailer: trailer || null,
      sinopse: sinopse || null,
      generos: generosSelecionados
    };

    // FETCH
    try {
      const res = await fetch("http://localhost:8000/filmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setMensagem(`Filme cadastrado com sucesso! ID: ${result.id_filme}`);

        setTitulo("");
        setOrcamento("");
        setDuracao("");
        setAno("");
        setPoster("");
        setTrailer("");
        setSinopse("");
        setGenerosSelecionados([]);

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
        <h2 className="colaborarTitle">Solicitar Edição</h2>

        <form className="colaborarForm" onSubmit={handleSubmit}>
          
          <div className="inputsWrapper"> 

            <div className="ladoUm">
              <label>Título</label>
              <input 
                type="text" 
                placeholder="Título do filme" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                required 
              />

              <label>Orçamento</label>
              <input 
                type="number" 
                placeholder="Orçamento" 
                value={orcamento} 
                onChange={(e) => setOrcamento(e.target.value)} 
              />

              <label>Duração</label>
              <input 
                type="text"
                placeholder="Formato HH:MM:SS (Ex: 01:54:00)"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
              />

              <label>Ano</label>
              <input 
                type="number" 
                placeholder="Ano de lançamento"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>


            <div className="ladoDois">

              <label>Link do Poster</label>
              <input 
                type="text" 
                placeholder="URL do poster (Ex: https://image.tmdb.org/...)" 
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
              />

              <label>Link do Trailer</label>
              <input 
                type="text" 
                placeholder="URL do YouTube ou Vimeo"
                value={trailer}
                onChange={(e) => setTrailer(e.target.value)}
              />

              <label>Gêneros</label>
              <MultiSelect 
                placeholder="Defina os gêneros" 
                selected={generosSelecionados} 
                setSelected={setGenerosSelecionados} 
              />

              <label>Sinopse</label>
              <textarea
                placeholder="Resumo do filme"
                value={sinopse}
                onChange={(e) => setSinopse(e.target.value)}
              ></textarea>

            </div>

          </div>
          
          <div className="submitWrapper">
            <button className="submitButton" type="submit">Cadastrar Filme</button>
          </div>

          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}
