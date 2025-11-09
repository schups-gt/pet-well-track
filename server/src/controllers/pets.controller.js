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
    const ownerId = req.ownerId ?? req.user?.owner_id ?? 1; // fallback seguro
    const tutor_id = req.user?.id;                           // vem do JWT

    const { nome, especie, idade } = req.body;

    if (!nome) {
      return res
        .status(400)
        .json({ success: false, error: "Campo obrigatório: nome" });
    }

    // idade chega como string no front; normalizar para número ou null
    const idadeNum = (idade !== undefined && idade !== null && `${idade}`.trim() !== "")
      ? Number(idade)
      : null;

    const data = await createPet({
      ownerId,
      tutor_id,
      nome,
      especie: especie ?? null,
      idade: isNaN(idadeNum) ? null : idadeNum,
    });

    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

// PUT /api/pets/:id
export async function updateController(req, res, next) {
  try {
    const ownerId = req.ownerId;
    const id = Number(req.params.id);
    const { nome, especie, idade } = req.body;

    const idadeNum = (idade !== undefined && idade !== null && `${idade}`.trim() !== "")
      ? Number(idade)
      : null;

    const data = await updatePet({
      ownerId,
      id,
      tutor_id: req.user?.id ?? null,
      nome,
      especie: especie ?? null,
      idade: isNaN(idadeNum) ? null : idadeNum,
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
