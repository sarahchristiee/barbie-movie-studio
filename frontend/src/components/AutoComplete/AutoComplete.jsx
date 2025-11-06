import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import './AutoComplete.css';

const titulos = [
  'nome dos filmes',
];

export default function AutoComplete() {
  const [valor, setValor] = React.useState(null);

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
