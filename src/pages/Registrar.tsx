import React, { useState } from "react";
import api from "../lib/api";

const RegistrarPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" ou "success"

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", { name, email, password: senha });
      setMessage("Registrado com sucesso!");
      setMessageType("success");
      setTimeout(() => {
        window.location.href = "/"; // leva pra página inicial ou login
      }, 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Erro ao registrar");
      setMessageType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">Registrar</h1>

        {message && (
          <div className={`mb-4 text-center font-semibold ${
            messageType === "error" ? "text-red-500" : "text-green-500"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="new-password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
          >
            Registrar
          </button>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <a href="/entrar" className="text-purple-500 hover:underline">Já tenho conta</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarPage;