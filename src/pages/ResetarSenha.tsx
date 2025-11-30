import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

const RedefinirSenha = () => {
  const { token } = useParams();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmar) return setMensagem("As senhas não coincidem.");

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { newPassword: senha });
      setMensagem(res.data.message || "Senha redefinida com sucesso!");
    } catch (err: any) {
      setMensagem(err.response?.data?.error || "Erro ao redefinir senha.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Redefinir senha
        </h1>

        {mensagem && (
          <p className="text-center text-sm mb-4 font-semibold text-gray-700">{mensagem}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
          >
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default RedefinirSenha;
