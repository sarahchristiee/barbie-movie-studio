import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Auth/Auth";
import showToast from "../../components/Toast/Toast"; // toast customizado
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      showToast("Email e senha são obrigatórios.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Usuário não cadastrado ou senha incorreta", "error");
        return;
      }

      // ✅ Login bem-sucedido
      login({ email, role: data.role, token: data.token });

      if (data.role === "admin") navigate("/HomeAdm");
      else navigate("/Home");

    } catch (err) {
      console.error(err);
      showToast("Erro de conexão com o servidor.", "error");
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h2 className="loginTitle">Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Senha</label>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
