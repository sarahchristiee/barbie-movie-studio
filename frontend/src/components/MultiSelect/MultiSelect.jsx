import { useState, useRef, useEffect } from "react";
import "./MultiSelect.css";

export default function MultiSelect() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // 🟢 Carrega os gêneros do backend
  useEffect(() => {
    fetch("http://localhost:8000/generos")
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.map((g) => g.nome));
      })
      .catch((err) => console.error("Erro ao carregar gêneros:", err));
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      setSelected([]);
    } else {
      setSelected(options);
    }
  };

  return (
    <div className="multiSelect" ref={dropdownRef}>
      <div className="selectBox" onClick={() => setOpen(!open)}>
        {selected.length > 0 ? (
          selected.map((item) => (
            <span className="tag" key={item}>
              {item}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(selected.filter((s) => s !== item));
                }}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="placeholder">Filtrar por Gênero</span>
        )}
        <span className="arrow">▾</span>
      </div>

      {open && (
        <div className="options">
          <label className="option selectAll">
            <input
              type="checkbox"
              checked={selected.length === options.length && options.length > 0}
              onChange={handleSelectAll}
            />
            Selecionar todos
          </label>

          {options.map((option) => (
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
