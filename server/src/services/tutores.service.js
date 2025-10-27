import { db } from "../database/sqlite.js";

export async function list({ ownerId, search }) {
  if (search) {
    const s = `%${search.toLowerCase()}%`;
    return db.prepare(`
      SELECT * FROM tutores
      WHERE owner_id = ? AND (lower(nome) LIKE ? OR lower(email) LIKE ?)
      ORDER BY id DESC
    `).all(ownerId, s, s);
  }
  return db.prepare(`
    SELECT * FROM tutores WHERE owner_id = ? ORDER BY id DESC
  `).all(ownerId);
}

export async function getById({ ownerId, id }) {
  return db.prepare(`SELECT * FROM tutores WHERE owner_id = ? AND id = ?`).get(ownerId, id) || null;
}

export async function create({ ownerId, nome, email, telefone }) {
  const info = db.prepare(`
    INSERT INTO tutores (owner_id, nome, email, telefone) VALUES (?, ?, ?, ?)
  `).run(ownerId, nome, email || null, telefone || null);
  return getById({ ownerId, id: Number(info.lastInsertRowid) });
}

export async function update({ ownerId, id, nome, email, telefone }) {
  const tutor = await getById({ ownerId, id });
  if (!tutor) return null;
  db.prepare(`
    UPDATE tutores SET nome = ?, email = ?, telefone = ? WHERE owner_id = ? AND id = ?
  `).run(nome ?? tutor.nome, email ?? tutor.email, telefone ?? tutor.telefone, ownerId, id);
  return getById({ ownerId, id });
}

export async function remove({ ownerId, id }) {
  const info = db.prepare(`DELETE FROM tutores WHERE owner_id = ? AND id = ?`).run(ownerId, id);
  return info.changes > 0;
}
