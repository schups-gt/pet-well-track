import React from 'react';
// IMPORTAÇÕES DE COMPONENTES DE LAYOUT DEVEM IR AQUI

const Serviços = () => {
  // NOVO LINK: Usando um link PNG do Imgur, que tem maior probabilidade de não ser bloqueado por CORS/CSP.
  const rickAstleyImageUrl = "https://media.tenor.com/IB9ol7welioAAAAM/dance-vibing.gif";
  
  return (
    // A tag div abaixo serve como um container básico para sua página
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      
      {/* 1. TEXTO INICIAL (MANTIDO) */}
      <h1 className="text-4xl font-bold text-teal-600 mb-4">Página de Serviços</h1>
      <p className="text-lg text-gray-700 mb-8">
        Página para visualizar serviços disponíveis.
      </p>
    </div>
  );
};

// ESSA LINHA É ESSENCIAL PARA RESOLVER O ERRO "no default export"!
export default Serviços;
