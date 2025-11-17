import MUIAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

import './AutoComplete.css';

export default function AutoCompleteTitulo({ onFilterTitulo }) {
  const [valor, setValor] = useState(null);
  const [titulos, setTitulos] = useState([]);

  // FECHT
  useEffect(() => {
    fetch("http://localhost:8000/filmes")
      .then(res => res.json())
      .then(data => setTitulos(data.map(f => f.titulo)));
  }, []);

  const handleChange = (event, newValue) => {
    setValor(newValue);
    onFilterTitulo(newValue ? newValue : "");
  };

  return (
    <MUIAutocomplete
      options={titulos}
      value={valor}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField {...params} placeholder="Pesquisar por Título" />
      )}
    />
  );
}
