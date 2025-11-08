// server/src/services/pets.service.js
import { dbs } from "../database/sqlite.js";
import { makeScopedCrud } from "./base-crud.js";

const repo = makeScopedCrud(dbs.animal, "pets", {
  searchCols: ["nome", "especie"]
});

export async function listPets({ ownerId, search }) {
  return repo.list({ ownerId, search });
}

export async function getPetById({ ownerId, id }) {
  return repo.getById({ ownerId, id });
}

export async function createPet({ ownerId, tutor_id, nome, especie, idade }) {
  return repo.create({
    ownerId,
    data: {
      tutor_id,
      nome,
      especie: especie || null,
      idade: Number.isFinite(Number(idade)) ? Number(idade) : null
    }
  });
}

export async function updatePet({ ownerId, id, tutor_id, nome, especie, idade }) {
  return repo.update({
    ownerId,
    id,
    data: {
      tutor_id,
      nome,
      especie,
      idade: Number.isFinite(Number(idade)) ? Number(idade) : null
    }
  });
}

export async function deletePet({ ownerId, id }) {
  return repo.remove({ ownerId, id });
}
