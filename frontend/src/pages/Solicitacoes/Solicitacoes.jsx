import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
      } catch {}

      if (!token) {
        toast.error("Você precisa estar logado como administrador.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/admin/solicitacoes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const text = await res.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Resposta inválida do servidor:", text);
          toast.error("Resposta inválida do servidor.");
          return;
        }

        if (!res.ok) {
          toast.error(data.error || "Erro ao carregar solicitações");
          return;
        }

        setSolicitacoes(data);
      } catch (err) {
        console.log(err);
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

      {loading && <p>Carregando...</p>}
      {!loading && solicitacoes.length === 0 && (
        <p>Nenhuma solicitação pendente.</p>
      )}

      <div className="baloesWrapper">
        {solicitacoes.map((s) => (
          <div
            key={s.id}
            className={`balaoSolicitacao ${
              s.tipo === "novo_filme" ? "balaoNovoFilme" : "balaoEdicao"
            }`}
            onClick={() => navigate(`/Solicitacoes/${s.id}`)}
          >
            <div className="balaoTitulo">
              {s.tipo === "novo_filme" ? " Novo Filme" : "Edição de Filme"}
            </div>

            <div className="balaoUsuario">
              {s.nome_usuario} ({s.email_usuario})
            </div>

            <div className="balaoData">
              {s.criado_em
                ? new Date(s.criado_em).toLocaleString("pt-BR")
                : "Data indisponível"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
