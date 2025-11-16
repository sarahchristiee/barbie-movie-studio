// src/pages/Perfil/Perfil.jsx
import React, { useEffect, useState } from "react";
import { getUser } from "../../Auth/Auth";
import './Perfil.css';

const Perfil = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("********"); // senha inicialmente escondida
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    const user = getUser(); // retorna token do usuário logado
    if (user?.token) {
      try {
        // Decodificando o JWT manualmente
        const payloadBase64 = user.token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setEmail(decodedPayload.email || "");
        // A senha real não é enviada no token, então manteremos oculta
      } catch (err) {
        console.error("Token inválido:", err);
      }
    }
  }, []);

  const toggleSenha = () => {
    setMostrarSenha(!mostrarSenha);
    setSenha(prev => (mostrarSenha ? "********" : "nn entendi como puxa a senha na real"));
  };

  return (
    <div className="perfilContainer">
      <h2>Perfil</h2>
      <div className="perfilItem">
        <span>Email:</span> <span>{email}</span>
      </div>
      <div className="perfilItem">
        <span>Senha:</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>{senha}</span>
          <button className="verSenhaBtn" onClick={toggleSenha}>
            {mostrarSenha ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
