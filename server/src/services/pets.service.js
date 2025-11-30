// server/src/services/pets.service.js
import { dbs } from "../database/sqlite.js";
import { makeScopedCrud } from "./base-crud.js";

const repo = makeScopedCrud(dbs.animal, "pets", {
  searchCols: ["nome", "especie"]
});

export function listPets({ ownerId, search }) {
  if (search) {
    return dbs.animal.prepare(`
      SELECT * FROM pets
      WHERE owner_id=? AND (nome LIKE ? OR especie LIKE ? OR raca LIKE ?)
      ORDER BY id DESC
    `).all(ownerId, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  return dbs.animal.prepare(`
    SELECT * FROM pets
    WHERE owner_id=?
    ORDER BY id DESC
  `).all(ownerId);
}

export function getPetById({ ownerId, id }) {
  return dbs.animal.prepare(`
    SELECT * FROM pets WHERE owner_id=? AND id=?
  `).get(ownerId, id) || null;
}

export function createPet({ ownerId, cliente_id, nome, especie, raca, nascimento, peso_kg }) {
  const info = dbs.animal.prepare(`
    INSERT INTO pets (owner_id, cliente_id, nome, especie, raca, nascimento, peso_kg)
    VALUES (?,?,?,?,?,?,?)
  `).run(
    ownerId,
    cliente_id,
    nome,
    especie ?? null,
    raca ?? null,
    nascimento ?? null,
    (peso_kg ?? null)
  );
  return getPetById({ ownerId, id: Number(info.lastInsertRowid) });
}

export async function updatePet({ ownerId, id, cliente_id, nome, especie, raca, nascimento, peso_kg }) {
  const cur = await getPetById({ ownerId, id });
  if (!cur) return null;

  dbs.animal.prepare(`
    UPDATE pets
       SET cliente_id = COALESCE(?, cliente_id),
           nome       = COALESCE(?, nome),
           especie    = COALESCE(?, especie),
           raca       = COALESCE(?, raca),
           nascimento = COALESCE(?, nascimento),
           peso_kg    = COALESCE(?, peso_kg),
           updated_at = datetime('now')
     WHERE owner_id=? AND id=?
  `).run(
    cliente_id ?? cur.cliente_id,
    nome ?? cur.nome,
    especie ?? cur.especie,
    raca ?? cur.raca,
    nascimento ?? cur.nascimento,
    (peso_kg ?? cur.peso_kg),
    ownerId, id
  );

  return getPetById({ ownerId, id });
}

export function deletePet({ ownerId, id }) {
  const r = dbs.animal.prepare(`
    DELETE FROM pets WHERE owner_id=? AND id=?
  `).run(ownerId, id);
  return r.changes > 0;
}