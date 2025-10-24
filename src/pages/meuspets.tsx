import React from 'react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import UserTypes from '@/components/UserTypes';
import Footer from '@/components/Footer';


const MeusPets = () => {
  const pets = [
    { nome: "Rex", especie: "Cachorro", status: "Saudável", imagem: "https://i.imgur.com/6a0PzVY.png" },
    { nome: "Mimi", especie: "Gato", status: "Em consulta", imagem: "https://i.imgur.com/svGvZ1U.png" },
  ];

  return (
    <div className="min-h-screen">
        <Header />
      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center spacing-x-2 mt-10">
        Meus <span className="text-purple-500">Pets</span>
      </h1>
      <p className="text-gray-600 text-lg  max-w-xl mb-10 mx-auto text-center">
        Acompanhe o status e as informações de cada um dos seus pets em tempo real.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 justify-items-center">
        {pets.map((pet, index) => (
          <div key={index} className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center w-80">
            <img src={pet.imagem} alt={pet.nome} className="w-40 h-40 object-cover rounded-full mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">{pet.nome}</h2>
            <p className="text-gray-500">{pet.especie}</p>
            <span
              className={`mt-2 text-sm font-medium px-3 py-1 rounded-full ${
                pet.status === "Saudável" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {pet.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Button className="bg-gradient-to-r from-purple-500 to-blue-400 mx-auto  mb-10 block font-semibold
        text-white px-6 py-3 rounded-full shadow-md hover:opacity-90 transition duration-300">
          + Adicionar Novo Pet
        </Button>
      </div>
    </div>
  );
};

export default MeusPets;