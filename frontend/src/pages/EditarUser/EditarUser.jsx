import { useState } from "react";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import { getUser } from "../../Auth/Auth";
import './EditarUser.css';

export default function EditarUser({ id_filme }) {

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

    const user = getUser();
    const token = user?.token;

    if (!token) {
      setMensagem("Você precisa estar logado para enviar uma solicitação.");
      return;
    }

    // Ajuste importante:
    // MultiSelect → retorna objetos {id, nome}
    // Back-end espera apenas nomes dos gêneros
    const generosCorrigidos = generosSelecionados.map(g => g.nome);

    const data = {
      dados_editados: {
        titulo,
        orcamento: orcamento || null,
        tempo_duracao: duracao || null,
        ano: ano || null,
        poster: poster || null,
        trailer: trailer || null,
        sinopse: sinopse || null,
        generos: generosCorrigidos
      }
    };

    try {
      const res = await fetch(`http://localhost:8000/user/filmes/${id_filme}/editar`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setMensagem("Solicitação enviada! Aguarde aprovação do administrador.");

        setTitulo("");
        setOrcamento("");
        setDuracao("");
        setAno("");
        setPoster("");
        setTrailer("");
        setSinopse("");
        setGenerosSelecionados([]);

      } else {
        setMensagem(result.error || "Erro ao enviar solicitação");
      }

    } catch (err) {
      setMensagem("Erro de conexão com o servidor");
      console.error(err);
    }
  };

  return (
    <div className="colaborarContainer">
      <div className="colaborarBox">
        <h2 className="colaborarTitle">Solicitar Edição de Filme</h2>

        <form className="colaborarForm" onSubmit={handleSubmit}>
          
          <div className="inputsWrapper"> 

            <div className="ladoUm">
              <label>Título</label>
              <input 
                type="text" 
                placeholder="Título do filme" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
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
                placeholder="Ex: 01:54:00"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
              />

              <label>Ano</label>
              <input 
                type="number" 
                placeholder="Ano"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>

            <div className="ladoDois">

              <label>Poster</label>
              <input 
                type="text" 
                placeholder="URL do poster" 
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
              />

              <label>Trailer</label>
              <input 
                type="text" 
                placeholder="URL do trailer"
                value={trailer}
                onChange={(e) => setTrailer(e.target.value)}
              />

              <label>Gêneros</label>
              <MultiSelect 
                placeholder="Selecione os gêneros"
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
            <button className="submitButton" type="submit">Enviar Solicitação</button>
          </div>

          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}
