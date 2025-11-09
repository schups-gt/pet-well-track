
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../lib/api';
import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import UserTypes from '@/components/UserTypes';
import Footer from '@/components/Footer';

type Pet = {
  id: number;
  nome: string;
  especie?: string;
  status?: string;
  imagem?: string;
};

export default function MeusPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // CHAME a rota com /api
        const res = await api.get("/pets");
        const data = res.data?.data ?? res.data;
        const arr: Pet[] = Array.isArray(data) ? data : [];
        if (alive) setPets(arr);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          navigate("/entrar"); // sem token ou token inválido
        }
        if (alive) setPets([]); // evita quebra do map
        console.error("Erro ao carregar pets", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Header />

      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center spacing-x-2 mt-10">
        Meus <span className="text-purple-500">Pets</span>
      </h1>
      <p className="text-gray-600 text-lg max-w-xl mb-10 mx-auto text-center">
        Acompanhe o status e as informações de cada um dos seus pets em tempo real.
      </p>

      {loading ? (
        <div className="text-center text-gray-500">Carregando…</div>
      ) : pets.length === 0 ? (
        <div className="text-center text-gray-500">Nenhum pet cadastrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 justify-items-center">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center w-80"
            >
              <img
                src={
                  pet.imagem ||
                  "https://via.placeholder.com/160x160.png?text=Pet"
                }
                alt={pet.nome}
                className="w-40 h-40 object-cover rounded-full mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">{pet.nome}</h2>
              <p className="text-gray-500">{pet.especie || "—"}</p>
              <span
                className={`mt-2 text-sm font-medium px-3 py-1 rounded-full ${
                  pet.status === "Saudável"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {pet.status || "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Link to="/cadastro-pet" className="text-white">
          <Button className="bg-gradient-to-r from-purple-500 to-blue-400 mx-auto mb-10 block font-semibold text-white px-6 py-3 rounded-full shadow-md hover:opacity-90 transition duration-300">
            + Adicionar Novo Pet
          </Button>
        </Link>
      </div>
    </div>
  );
}