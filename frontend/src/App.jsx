import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/login/Login";
import Colaborar from "./pages/Colaborar/Colaborar";
import PaginaFilme from './pages/PaginaFilme/PaginaFilme'

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Colaborar" element={<Colaborar />} />
        <Route path="/PaginaFilme/:id_filme" element={<PaginaFilme />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
