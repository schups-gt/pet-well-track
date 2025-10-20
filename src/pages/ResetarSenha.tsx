import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

const ResetSenhaPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" ou "error"

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmaSenha) {
      setMessage("As senhas não coincidem!");
      setMessageType("error");
      return;
    }

    try {
      await api.post("/auth/reset/confirm", { token, password: senha });
      setMessage("Senha redefinida com sucesso!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/entrar"); // volta pro login
      }, 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Erro ao redefinir a senha");
      setMessageType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Redefinir Senha
        </h1>

        {message && (
          <div
            className={`mb-4 text-center font-semibold ${
              messageType === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirme a Senha
            </label>
            <input
              type="password"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetSenhaPage;
