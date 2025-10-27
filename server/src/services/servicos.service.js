import { db } from "../database/sqlite.js";

export async function listServicos({ ownerId }) {
  return db.prepare(`SELECT * FROM servicos WHERE owner_id = ? ORDER BY id DESC`).all(ownerId);
}
export async function getServicoById({ ownerId, id }) {
  return db.prepare(`SELECT * FROM servicos WHERE owner_id = ? AND id = ?`).get(ownerId, id) || null;
}
export async function createServico({ ownerId, titulo, descricao, preco_cents }) {
  const info = db.prepare(`
    INSERT INTO servicos (owner_id, titulo, descricao, preco_cents) VALUES (?, ?, ?, ?)
  `).run(ownerId, titulo, descricao || null, Number(preco_cents));
  return getServicoById({ ownerId, id: Number(info.lastInsertRowid) });
}
export async function updateServico({ ownerId, id, titulo, descricao, preco_cents }) {
  const cur = await getServicoById({ ownerId, id });
  if (!cur) return null;
  db.prepare(`
    UPDATE servicos SET titulo=?, descricao=?, preco_cents=? WHERE owner_id=? AND id=?
  `).run(titulo ?? cur.titulo, descricao ?? cur.descricao, Number(preco_cents ?? cur.preco_cents), ownerId, id);
  return getServicoById({ ownerId, id });
}
export async function deleteServico({ ownerId, id }) {
  const info = db.prepare(`DELETE FROM servicos WHERE owner_id = ? AND id = ?`).run(ownerId, id);
  return info.changes > 0;
}
