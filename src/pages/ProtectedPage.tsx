// src/pages/ProtectedPage.tsx
import { Link } from "react-router-dom";

const ProtectedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-md p-8 text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Você precisa estar logado</h1>
        <p className="mb-6">Para acessar esta página, faça login na sua conta.</p>
        <div className="flex justify-between gap-4">
          <Link to="/">
            <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:opacity-90 transition">
              Voltar para início
            </button>
          </Link>
          <Link to="/entrar">
            <button className="bg-purple-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition">
              Logar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProtectedPage;
