import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Redireciona se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password: senha });
      setMessage("Login realizado com sucesso!");
      setMessageType("success");
      
      // Usa o método login do AuthContext
      login(res.data.data, res.data.data.token);
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Erro ao fazer login");
      setMessageType("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h1>
        
        {message && (
          <div className={`mb-4 text-center font-semibold ${
            messageType === "error" ? "text-red-500" : "text-green-500"
          }`}>
            {message}
          </div>
        )}

           <form 
            onSubmit={handleLogin} 
            className="space-y-4" 
            autoComplete={messageType === "error" ? "off" : "on"}
            >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              autoComplete={messageType === "error" ? "new-password" : "current-password"}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
          >
            Entrar
          </button>

          <div className="flex flex-col items-center space-y-2 mt-4 text-sm">
          {/* 1. LINK "Esqueci minha senha" (mantido na coluna) */}
          <a href="/esqueci-senha" className="text-black hover:underline">
            Esqueci minha senha
          </a>
          
          {/* 2. NOVO GRUPO: "Não tem uma conta" + "Registrar" (na mesma linha) */}
          <div className="flex items-center gap-1">
            {/* Texto estático */}
            <span className="text-muted-foreground">
              Não tem uma conta?
            </span>
            {/* Link de Registrar */}
            <a href="/registrar" className="text-purple-500 hover:underline font-medium">
              Registrar
            </a>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
