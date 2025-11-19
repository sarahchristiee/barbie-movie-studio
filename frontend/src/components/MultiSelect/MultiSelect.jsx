import { useState, useEffect, useRef } from "react";
import "./MultiSelect.css";

export default function MultiSelect({
  placeholder = "Filtrar por Gênero",
  options = [],           // [{ id, nome }]
  value = [],             // [id1, id2]
  onChange = () => {}
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Para exibir os nomes selecionados
  const selectedLabels = options
    .filter(opt => value.includes(opt.id))
    .map(opt => opt.nome);

  const toggleSelect = (id) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="multiSelect" ref={dropdownRef}>
      {/* Caixa principal */}
      <div
        className={`selectBox ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {value.length > 0 ? selectedLabels.join(", ") : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="arrow">▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="options">
          {options.map((opt) => (
            <label key={opt.id} className="option" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={value.includes(opt.id)}
                onChange={() => toggleSelect(opt.id)}
              />
              {opt.nome}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
