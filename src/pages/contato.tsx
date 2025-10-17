import React from 'react';
// IMPORTAÇÕES DE COMPONENTES DE LAYOUT DEVEM IR AQUI

const Contato = () => {
  // NOVO LINK: Usando um link PNG do Imgur, que tem maior probabilidade de não ser bloqueado por CORS/CSP.
  const rickAstleyImageUrl = "https://media.tenor.com/IB9ol7welioAAAAM/dance-vibing.gif";
  
  return (
    // A tag div abaixo serve como um container básico para sua página
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      
      {/* 1. TEXTO INICIAL (MANTIDO) */}
      <h1 className="text-4xl font-bold text-teal-600 mb-4">Página de Contato</h1>
      <p className="text-lg text-gray-700 mb-8">
        IIIIIIIIIIIIIHHHHHH ALA ELE Ó.
      </p>

      {/* 2. ADICIONANDO A IMAGEM (Rick Roll Estático) */}
      <div className="w-full max-w-lg shadow-2xl rounded-lg overflow-hidden border-4 border-teal-500">
        <img 
          src={rickAstleyImageUrl} // Usando o novo link do Imgur
          alt="Rick Astley na capa do single Never Gonna Give You Up" 
          // Classes Tailwind para garantir que a imagem seja responsiva
          className="w-full h-auto object-cover"
          // Mantenho o onError para garantir que, se tudo falhar, o placeholder apareça.
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/400x300/CCCCCC/333333?text=IMAGEM+DE+RICK+ASTLEY";
          }}
        />
      </div>

    </div>
  );
};

// ESSA LINHA É ESSENCIAL PARA RESOLVER O ERRO "no default export"!
export default Contato;
