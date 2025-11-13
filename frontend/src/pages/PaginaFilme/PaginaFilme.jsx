// Exemplo de como você configuraria as rotas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaFilme from './PaginaFilme';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/filme/:id_filme" element={<PaginaFilme />} />

        <div>testeeeee</div>
      </Routes>
    </BrowserRouter>
  );
}

export default App;