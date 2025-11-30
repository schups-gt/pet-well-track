import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import PawPatternBackground from '@/components/ui/PawPatternBackground';

const ReenviarVerificacaoPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Por favor, informe seu email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/resend-verification', { email });
      
      if (response.data.success) {
        setMessage('Email de verificação reenviado com sucesso! Verifique sua caixa de entrada.');
        setMessageType('success');
        setEmail('');
        
        // Redireciona para login após 3 segundos
        setTimeout(() => {
          navigate('/entrar');
        }, 3000);
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || 
        'Erro ao reenviar email de verificação'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 relative">
      <PawPatternBackground opacity={0.05} />
      <div className="z-10 w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">Reenviar Verificação</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Digite seu email para receber um novo link de verificação
        </p>

        {message && (
          <div className={`mb-4 text-center font-semibold text-sm ${
            messageType === 'error' ? 'text-red-500' : 'text-green-500'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleResend} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="seu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Reenviar Email'}
          </button>

          <div className="flex justify-center gap-2 mt-4 text-sm">
            <a href="/entrar" className="text-purple-500 hover:underline">Voltar para login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReenviarVerificacaoPage;
