// server/src/services/clientes.service.js
import { dbs } from "../database/sqlite.js";

dbs.cliente.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    criado_em TEXT DEFAULT (datetime('now'))
  );
`);

export async function listClientes({ ownerId, search }) {
  if (search) {
    const s = `%${search.toLowerCase()}%`;
    return dbs.cliente.prepare(`
      SELECT * FROM clientes
      WHERE owner_id = ?
        AND (lower(nome) LIKE ? OR lower(email) LIKE ? OR lower(telefone) LIKE ?)
      ORDER BY id DESC
    `).all(ownerId, s, s, s);
  }
  return dbs.cliente.prepare(`
    SELECT * FROM clientes
    WHERE owner_id = ?
    ORDER BY id DESC
  `).all(ownerId);
}

export async function getClienteById({ ownerId, id }) {
  return db
    .prepare(`SELECT * FROM clientes WHERE owner_id = ? AND id = ?`)
    .get(ownerId, id) || null;
}

export async function createCliente({ ownerId, nome, email, telefone }) {
  const info = db
    .prepare(`
      INSERT INTO clientes (owner_id, nome, email, telefone, criado_em)
      VALUES (?, ?, ?, ?, datetime('now'))
    `)
    .run(ownerId, nome, email || null, telefone || null);

  return getClienteById({ ownerId, id: Number(info.lastInsertRowid) });
}

export async function updateCliente({ ownerId, id, nome, email, telefone }) {
  const atual = await getClienteById({ ownerId, id });
  if (!atual) return null;

  db.prepare(`
    UPDATE clientes
       SET nome = ?,
           email = ?,
           telefone = ?
     WHERE owner_id = ? AND id = ?
  `).run(
    nome ?? atual.nome,
    email ?? atual.email,
    telefone ?? atual.telefone,
    ownerId,
    id
  );

  return getClienteById({ ownerId, id });
}

export async function deleteCliente({ ownerId, id }) {
  const info = db
    .prepare(`DELETE FROM clientes WHERE owner_id = ? AND id = ?`)
    .run(ownerId, id);
  return info.changes > 0;
}