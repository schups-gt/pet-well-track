// server/src/controllers/pets.controller.js
import {
  listPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from "../services/pets.service.js";

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
    const ownerId = req.ownerId;
    const { tutor_id, nome, especie, idade } = req.body;
    if (!tutor_id || !nome) {
      return res.status(400).json({ success: false, error: "Campos obrigatórios: tutor_id, nome" });
    }
    const data = await createPet({ ownerId, tutor_id, nome, especie, idade });
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

// PUT /api/pets/:id
export async function updateController(req, res, next) {
  try {
    const ownerId = req.ownerId;
    const id = Number(req.params.id);
    const { tutor_id, nome, especie, idade } = req.body;
    const data = await updatePet({ ownerId, id, tutor_id, nome, especie, idade });
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
