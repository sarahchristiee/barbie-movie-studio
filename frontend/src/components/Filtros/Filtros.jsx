import AutoComplete from "../Autocomplete/Autocomplete";
import MultiSelect from "../MultiSelect/MultiSelect";
import './Filtros.css'

export default function Filtros(){

    return(
        <section className="filtros">
        <AutoComplete className="AutoComplete"/>
        <MultiSelect />
        <div className="ano">
          <input type="number" name="" id="" placeholder="Selecionar Ano de lançamento" min={1987} max={2023} />  
        </div>
        </section>
        
    );
};