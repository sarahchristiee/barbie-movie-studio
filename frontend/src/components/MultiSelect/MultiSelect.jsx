import { useState, useEffect, useRef } from "react";
import './MultiSelect.css'

export default function MultiSelect({ placeholder = "Filtrar por Gênero", onFilterGenero }) {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    fetch("http://localhost:8000/generos")
      .then(res => res.json())
      .then(data => {
        setOptions(data.map(g => g.nome));
      });
  }, []);

  // atualizar pai sempre que selected mudar
  useEffect(() => {
    if (onFilterGenero) onFilterGenero(selected);
  }, [selected]);

  const handleSelect = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(i => i !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="multiSelect" ref={dropdownRef}>
      <div className={`selectBox ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        {selected.length > 0 ? (
          selected.join(", ")
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="arrow">▾</span>
      </div>

      {open && (
        <div className="options">
          {options.map(option => (
            <label key={option} className="option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleSelect(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
