import AutoComplete from "../AutoComplete/AutoComplete";
import MultiSelect from "../MultiSelect/MultiSelect";
import "./Filtros.css";

export default function Filtros({ onFilterTitulo, onFilterGenero, onFilterAno }) {
  return (
    <section className="filtros">
      
      {/* FILTRO POR TÍTULO */}
      <AutoComplete onFilterTitulo={onFilterTitulo} />

      {/* FILTRO POR GÊNERO */}
      <MultiSelect onFilterGenero={onFilterGenero} />

      {/* FILTRO POR ANO */}
      <div className="ano">
        <input
          type="number"
          placeholder="Filtrar por Ano"
          min={1980}
          max={2025}
          onChange={(e) => onFilterAno(e.target.value)}
        />
      </div>

    </section>
  );
}
