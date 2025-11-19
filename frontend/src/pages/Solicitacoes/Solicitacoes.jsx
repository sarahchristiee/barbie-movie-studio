import { useState, useEffect } from "react"; 
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Solicitacoes.css";

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      let token = null;

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        token = user?.token;
      } catch (err) {
        console.error("Erro ao obter token:", err);
      }

      if (!token) {
        toast.error("Você precisa estar logado como administrador.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/admin/solicitacoes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          toast.error(errorData.error || "Erro ao carregar solicitações");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          toast.error("Resposta do servidor inesperada");
          setSolicitacoes([]);
        } else {
          // Filtra apenas solicitações de novo filme ou edição
          setSolicitacoes(data.filter(s => s.tipo === "novo_filme" || s.tipo === "edicao"));
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro de conexão com o servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, []);

  return (
    <div className="solicitacoesContainer">
      <h2>Aprovar Filmes</h2>

      <div className="baloesWrapper">
        {loading && <p className="loadingText">Carregando...</p>}

        {!loading && solicitacoes.length === 0 && (
          <p className="nenhumaSolicitacao">Nenhuma solicitação pendente.</p>
        )}

        {solicitacoes.map((s) => {
          const tipoTexto = s.tipo === "novo_filme" ? "Novo Filme" : "Edição de Filme";
          const usuarioTexto = `${s.nome_usuario || "Usuário"} (${s.email_usuario || "Email não informado"})`;
          const dataTexto = s.criado_em ? new Date(s.criado_em).toLocaleString("pt-BR") : "Data indisponível";

          return (
            <div
              key={s.id || s.id_solicitacao}
              className={`balaoSolicitacao ${s.tipo === "novo_filme" ? "balaoNovoFilme" : "balaoEdicao"}`}
              onClick={() => navigate(`/aprovar/${s.id || s.id_solicitacao}`)}
            >
              <div className="balaoTitulo">{tipoTexto}</div>
              <div className="balaoUsuario">{usuarioTexto}</div>
              <div className="balaoData">{dataTexto}</div>
            </div>
          );
        })}
      </div>

      <ToastContainer />
    </div>
  );
}
