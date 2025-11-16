import AutoCompleteTitulo from "../AutoComplete/AutoCompleteTitulo";
import MultiSelect from "../MultiSelect/MultiSelect";
import './Filtros.css';

export default function Filtros({ onFilterTitulo, onFilterGenero, onFilterAno }) {
  return (
    <section className="filtros">

      <AutoCompleteTitulo onFilterTitulo={onFilterTitulo} />

      <MultiSelect onFilterGenero={onFilterGenero} />

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
