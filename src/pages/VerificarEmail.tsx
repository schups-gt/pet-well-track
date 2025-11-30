import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import PawPatternBackground from '@/components/ui/PawPatternBackground';

const VerificarEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token não fornecido');
        return;
      }

      try {
        const response = await api.post(`/auth/verify-email/${token}`);
        if (response.data.success) {
          setStatus('success');
          setMessage('Email verificado com sucesso!');
          setEmail(response.data.data?.email || '');
          
          // Redireciona para login após 3 segundos
          setTimeout(() => {
            navigate('/entrar');
          }, 3000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(
          error.response?.data?.error || 
          'Erro ao verificar email. Token inválido ou expirado.'
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 relative">
      <PawPatternBackground opacity={0.05} />
      <div className="z-10 w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">Verificar Email</h1>

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Verificando seu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <p className="text-center text-green-600 font-semibold mb-2">{message}</p>
            {email && (
              <p className="text-center text-gray-600 text-sm mb-4">
                Email: <strong>{email}</strong>
              </p>
            )}
            <p className="text-center text-gray-600 text-sm">
              Redirecionando para login em 3 segundos...
            </p>
            <button
              onClick={() => navigate('/entrar')}
              className="mt-4 bg-gradient-to-r from-purple-500 to-blue-400 w-full py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
            >
              Ir para Login Agora
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <p className="text-center text-red-600 font-semibold mb-4">{message}</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => navigate('/registrar')}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-400 py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
              >
                Registrar Novamente
              </button>
              <button
                onClick={() => navigate('/reenviar-verificacao')}
                className="flex-1 bg-gray-300 py-2 px-4 rounded-full text-gray-800 font-semibold hover:bg-gray-400 transition duration-300"
              >
                Reenviar Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificarEmailPage;
