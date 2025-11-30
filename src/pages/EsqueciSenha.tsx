import React, { useState } from 'react';
import api from '../lib/api';

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" ou "success"

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Se o email existir, enviaremos um link de redefinição.");
      setMessageType("success");
    } catch {
      setMessage("Erro ao solicitar redefinição.");
      setMessageType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-black-500 mb-6">Esqueci minha senha</h1>

        {message && (
          <div className={`mb-4 text-center font-semibold ${
            messageType === "error" ? "text-red-500" : "text-green-500"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4" autoComplete="off">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              placeholder="Digite seu e-mail"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
          >
            Enviar
          </button>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <a href="/entrar" className="text-purple-500 hover:underline">Voltar para login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EsqueciSenha;
