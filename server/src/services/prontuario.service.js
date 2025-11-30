import { dbs } from "../database/sqlite.js";

export async function list({ ownerId, pet_id }) {
  if (pet_id) {
    return db.prepare(`
      SELECT * FROM prontuario WHERE owner_id=? AND pet_id=? ORDER BY id DESC
    `).all(ownerId, Number(pet_id));
  }
  return db.prepare(`SELECT * FROM prontuario WHERE owner_id=? ORDER BY id DESC`).all(ownerId);
}

export async function create({ ownerId, pet_id, descricao, dataISO }) {
  const info = db.prepare(`
    INSERT INTO prontuario (owner_id, pet_id, descricao, data_iso) VALUES (?, ?, ?, ?)
  `).run(ownerId, Number(pet_id), descricao, dataISO || new Date().toISOString());
  return db.prepare(`SELECT * FROM prontuario WHERE id=?`).get(Number(info.lastInsertRowid));
}
