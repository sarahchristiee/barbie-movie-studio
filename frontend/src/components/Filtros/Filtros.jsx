import AutoComplete from "../Autocomplete/Autocomplete";
import MultiSelect from "../MultiSelect/MultiSelect";
import { Filter } from "lucide-react";
import './Filtros.css'

export default function Filtros(){

    return(
        <section className="filtros">
          <div className="pesquisaTexto">
            <Filter size={30} className="filterIcon" />
            <AutoComplete className="AutoComplete"/>
          </div>
        
        <MultiSelect />
        <div className="ano">
          <input type="number" name="" id="" placeholder="Filtrar por Ano" min={1987} max={2023} />  
        </div>
        </section>
        
    );
};