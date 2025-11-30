import React, { useState } from "react";
import api from "../lib/api";
import PawPatternBackground from '@/components/ui/PawPatternBackground';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../lib/email-validation";

const RegistrarPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" ou "success"
  const [emailError, setEmailError] = useState(""); // Erro específico de email
  const { login } = useAuth(); // pega a função login do contexto
  const navigate = useNavigate();

  // Valida o email em tempo real
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    if (!emailValue) {
      setEmailError("");
      return;
    }

    const validation = validateEmail(emailValue);
    if (!validation.valid) {
      setEmailError(validation.error || "Email inválido");
    } else {
      setEmailError("");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar email antes de enviar
    const validation = validateEmail(email);
    if (!validation.valid) {
      setMessage("Por favor, use um email com domínio permitido");
      setMessageType("error");
      return;
    }

    if (!name.trim()) {
      setMessage("Por favor, informe seu nome");
      setMessageType("error");
      return;
    }

    if (senha.length < 6) {
      setMessage("Senha deve ter pelo menos 6 caracteres");
      setMessageType("error");
      return;
    }

    try {
      console.log('Enviando dados de registro:', { name, email, password: '***' });
      const res = await api.post("/auth/register", { 
        name, 
        email, 
        password: senha 
      });
      
      console.log('Resposta do registro:', res.data);
      
      if (res.data.success || res.status === 201) {
        setMessage("Registrado com sucesso! Verifique seu email.");
        setMessageType("success");
        
        // Redireciona para página de verificação pendente
        setTimeout(() => {
          navigate("/verificacao-pendente", { state: { email } });
        }, 1500);
      } else {
        throw new Error(res.data.error || "Erro ao registrar");
      }
    } catch (err: any) {
      console.error('Erro no registro:', err);
      const errorMessage = err.response?.data?.error || err.message || "Erro ao registrar";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 relative">
      <PawPatternBackground opacity={0.05} />
      <div className="z-10 w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">Criar conta</h1>

        {message && (
          <div className={`mb-4 text-center font-semibold text-sm ${
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
              onChange={handleEmailChange}
              required
              autoComplete="off"
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
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
            disabled={!!emailError}
            className="bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Registrar
          </button>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <a href="/entrar" className="text-purple-500 hover:underline">Já tenho uma conta</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarPage;
