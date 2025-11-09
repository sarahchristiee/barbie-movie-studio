import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import './AutoComplete.css';
import '../Style/Variables.css';

export default function AutoComplete() {
  const [valor, setValor] = React.useState(null);
  const [titulos, setTitulos] = React.useState([]);

  // 🔹 Carrega os títulos do backend
  React.useEffect(() => {
    fetch("http://localhost:8000/filmes")
      .then(res => res.json())
      .then(data => {
        // Aqui ele pega os titulos dos filmes
        const nomes = data.map(filme => filme.titulo);
        setTitulos(nomes);
      })
      .catch(err => console.error("Erro ao carregar títulos:", err));
  }, []);

  return (
    <Autocomplete
      options={titulos}
      value={valor}
      onChange={(event, newValue) => setValor(newValue)}
      className="autocomplete-container"
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Pesquisar por Título"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="search-icon" />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
