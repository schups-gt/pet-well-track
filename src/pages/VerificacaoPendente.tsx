import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PawPatternBackground from '@/components/ui/PawPatternBackground';

interface LocationState {
  email?: string;
}

const VerificacaoPendentePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    // Tenta pegar o email do estado da navegação
    const state = location.state as LocationState;
    if (state?.email) {
      setEmail(state.email);
    } else {
      // Se não tiver email, redireciona para registro
      navigate('/registrar');
    }
  }, [location, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleResendClick = () => {
    navigate('/reenviar-verificacao', { state: { email } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 relative">
      <PawPatternBackground opacity={0.05} />
      <div className="z-10 w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Verifique seu Email</h1>
          <p className="text-gray-600">
            Enviamos um link de verificação para:
          </p>
          <p className="text-lg font-semibold text-purple-600 mt-2">{email}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Próximos passos:</h3>
          <ol className="text-sm text-blue-900 space-y-2">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Abra seu email</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Clique no link de verificação</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Você será redirecionado para fazer login</span>
            </li>
          </ol>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold">Dica:</span> O link expira em 24 horas
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleResendClick}
            className="w-full bg-gray-300 py-2 px-4 rounded-full text-gray-800 font-semibold hover:bg-gray-400 transition duration-300"
          >
            Não recebi o email
          </button>

          <button
            onClick={() => navigate('/entrar')}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-400 py-2 px-4 rounded-full text-white font-semibold hover:opacity-90 transition duration-300"
          >
            Já verifiquei
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            <a href="/registrar" className="text-purple-500 hover:underline">
              Voltar para registro
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificacaoPendentePage;
