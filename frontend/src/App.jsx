import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // noti de toast

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// deslogado
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import PaginaFilme from "./pages/PaginaFilme/PaginaFilme";

// user padrão / logado
import Perfil from "./pages/Perfil/Perfil";
import Colaborar from "./pages/Colaborar/Colaborar";
import SolicitarEdicao from "./pages/SolicitarEdicao/SolicitarEdicao";

// adm
import HomeAdm from "./pages/HomeAdm/HomeAdm";
import Solicitacoes from "./pages/Solicitacoes/Solicitacoes";
import EditarAdm from "./pages/EditarAdm/EditarAdm";
import Aprovar from "./pages/Aprovar/Aprovar";
import PaginaFilmeAdm from "./pages/PaginaFilmeAdm/PaginaFilmeAdm";
import ColaborarAdm from "./pages/ColaborarAdm/ColaborarAdm";

// rotas
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import AdminRoute from "./components/Routes/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* deslogado */}
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/PaginaFilme/:id_filme" element={<PaginaFilme />} />

        {/* user padrão/ logado */}
        <Route
          path="/Perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route path="/Colaborar" element={
            <ProtectedRoute>
              <Colaborar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/SolicitarEdicao/:id_filme"
          element={
            <ProtectedRoute>
              <SolicitarEdicao />
            </ProtectedRoute>
          }
        />

        {/* adm*/}
        <Route
          path="/HomeAdm"
          element={
            <AdminRoute>
              <HomeAdm />
            </AdminRoute>
          }
        />
        <Route
          path="/Solicitacoes"
          element={
            <AdminRoute>
              <Solicitacoes />
            </AdminRoute>
          }
        />

        <Route
          path="/Solicitacoes/:id"
          element={
            <AdminRoute>
              <Aprovar />
            </AdminRoute>
          }
        />

        <Route
          path="/EditarAdm"
          element={
            <AdminRoute>
              <EditarAdm />
            </AdminRoute>
          }
        />

        <Route
          path="/ColaborarAdm"
          element={
            <AdminRoute>
              <ColaborarAdm />
            </AdminRoute>
          }
        />

        <Route
          path="/PaginaFilmeAdm/:id_filme"
          element={
            <AdminRoute>
              <PaginaFilmeAdm />
            </AdminRoute>
          }
        />

      </Routes>

      

    {/* mensagem toast */}
    <ToastContainer
    position="bottom-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnBottom
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    />

    </BrowserRouter>
  );
}

export default App;
