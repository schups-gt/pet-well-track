// src/controllers/pets.controller.js
import {
  listPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from "../services/pets.service.js";
import { ensureClienteForUser } from "../services/clientes.service.js";


// GET /api/pets?search=
export async function listController(req, res, next) {
  try {
    const ownerId = req.ownerId;
    const { search } = req.query;
    const data = await listPets({ ownerId, search });
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// GET /api/pets/:id
export async function getByIdController(req, res, next) {
  try {
    const ownerId = req.ownerId;
    const id = Number(req.params.id);
    const data = await getPetById({ ownerId, id });
    if (!data) return res.status(404).json({ success: false, error: "Pet não encontrado" });
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// POST /api/pets
export async function createController(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const ownerId = req.ownerId;
    // garante cliente vinculado ao user logado
    const cliente = ensureClienteForUser({ ownerId, user: req.user });

    const { nome, especie, raca, idade, peso_kg } = req.body;
    if (!nome) return res.status(400).json({ success: false, error: "Campo obrigatório: nome" });

    const data = await createPet({
      ownerId,
      cliente_id: cliente.id, // usa cliente_id (não tutor_id)
      nome,
      especie,
      raca,
      idade,
      peso_kg,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// PUT /api/pets/:id
export async function updateController(req, res, next) {
  try {
    const ownerId = req.ownerId;
    const id = Number(req.params.id);
    const { nome, especie, raca, idade, peso_kg } = req.body;

    // opcional: permitir trocar o cliente para o user atual
    const cliente = ensureClienteForUser({ ownerId, user: req.user });
    const cliente_id = cliente.id;

    const idadeNum = (idade === undefined || idade === null || `${idade}`.trim() === "")
      ? null : Number(idade);
    const pesoNum = (peso_kg === undefined || peso_kg === null || `${peso_kg}`.trim() === "")
      ? null : Number(String(peso_kg).replace(",", "."));

    const data = await updatePet({
      ownerId,
      id,
      cliente_id,
      nome,
      especie,
      raca,
      idade: Number.isNaN(idadeNum) ? null : idadeNum,
      peso_kg: Number.isNaN(pesoNum) ? null : pesoNum,
    });

    if (!data) return res.status(404).json({ success: false, error: "Pet não encontrado" });
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

// DELETE /api/pets/:id
export async function deleteController(req, res, next) {
  try {
    const ownerId = req.ownerId;
    const id = Number(req.params.id);
    const ok = await deletePet({ ownerId, id });
    if (!ok) return res.status(404).json({ success: false, error: "Pet não encontrado" });
    res.status(204).end();
  } catch (err) { next(err); }
}
