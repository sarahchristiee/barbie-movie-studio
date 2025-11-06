import { Link } from "react-router-dom";
import "./Login.css";

export default function Login(){
  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h2 className="loginTitle">Login</h2>
        <form>
          <label>Email</label>
          <input type="email" placeholder="Email" />

          <label>Senha</label>
          <input type="password" placeholder="Senha" />

          <button type="submit">Entrar</button>
        </form>

      </div>
    </div>
  );
};


