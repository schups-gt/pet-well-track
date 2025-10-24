import React, { useState } from "react";
import api from "../lib/api";

const Registrar = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", { name, email, password: senha });
      alert("Registrado com sucesso!");
      console.log(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao registrar");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" required />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Registrar;