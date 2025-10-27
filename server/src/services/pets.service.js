import { db } from "../database/sqlite.js";

export async function list({ ownerId, tutor_id }) {
  if (tutor_id) {
    return db.prepare(`SELECT * FROM pets WHERE owner_id = ? AND tutor_id = ? ORDER BY id DESC`)
             .all(ownerId, Number(tutor_id));
  }
  return db.prepare(`SELECT * FROM pets WHERE owner_id = ? ORDER BY id DESC`).all(ownerId);
}

export async function getById({ ownerId, id }) {
  return db.prepare(`SELECT * FROM pets WHERE owner_id = ? AND id = ?`).get(ownerId, id) || null;
}

export async function create({ ownerId, tutor_id, nome, especie, idade }) {
  const info = db.prepare(`
    INSERT INTO pets (owner_id, tutor_id, nome, especie, idade) VALUES (?, ?, ?, ?, ?)
  `).run(ownerId, Number(tutor_id), nome, especie || null, idade ?? null);
  return getById({ ownerId, id: Number(info.lastInsertRowid) });
}

export async function update({ ownerId, id, ...fields }) {
  const pet = await getById({ ownerId, id });
  if (!pet) return null;
  const { nome = pet.nome, especie = pet.especie, idade = pet.idade, tutor_id = pet.tutor_id } = fields;
  db.prepare(`UPDATE pets SET nome = ?, especie = ?, idade = ?, tutor_id = ? WHERE owner_id = ? AND id = ?`)
    .run(nome, especie, idade, Number(tutor_id), ownerId, id);
  return getById({ ownerId, id });
}

export async function remove({ ownerId, id }) {
  const info = db.prepare(`DELETE FROM pets WHERE owner_id = ? AND id = ?`).run(ownerId, id);
  return info.changes > 0;
}
