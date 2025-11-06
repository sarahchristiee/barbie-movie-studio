import { Link } from "react-router-dom";
import MultiSelect from '../../components/MultiSelect/MultiSelect'
import "./Cadastro.css";

export default function Cadastro(){
  return (
    <div className="cadastroContainer">
      <div className="cadastroBox">
        <h2 className="cadastroTitle">Colabore</h2>
        <form>
          <div className="ladoUm">
            <label>Título</label>
            <input type="text" placeholder="Título do filme" />

            <label>Ano de lançamento</label>
            <input type="number" name="" id="" placeholder="Ano de lançamento" min={0} max={9999} />

            <label>Orçamento</label>
            <input type="number" name="" id="" placeholder="Total orçamento" />

            <label>Duração</label>
            <input type="number" name="" id="" placeholder="Duração" />

            <label>Gênero</label>
            <MultiSelect />

            <label>Diretor</label>
            <input type="text" placeholder="Diretor" />
          </div>

          <div className="ladoDois">
            <label>Sinopse</label>
            <input type="text" placeholder="Sinopse" />

            <label>Produtora</label>
            <input type="text" placeholder="Produtora" /> 

            <label>Poster</label>
            <input type="text" placeholder="Link URL do poster" /> 

            <label>Trailer</label>
            <input type="text" placeholder="Link URL do trailer" /> 
          </div>
          

          <button type="submit">Enviar</button>
        </form>

      </div>
    </div>
  );
};


