// server/src/services/clientes.service.js
import { dbs } from "../database/sqlite.js";
import { makeScopedCrud } from "./base-crud.js";

// NADA de CREATE TABLE aqui — isso está no sqlite.js
const repo = makeScopedCrud(dbs.cliente, "clientes", {
  searchCols: ["nome", "email", "telefone"],
});

export async function listClientes({ ownerId, search }) {
  return repo.list({ ownerId, search });
}

export function getClienteById({ ownerId, id }) {
  return (
    dbs.cliente
      .prepare(`SELECT * FROM clientes WHERE owner_id=? AND id=?`)
      .get(ownerId, id) || null
  );
}

export function getClienteByUserId({ ownerId, userId }) {
  return (
    dbs.cliente
      .prepare(
        `SELECT * FROM clientes WHERE owner_id=? AND user_id=? LIMIT 1`
      )
      .get(ownerId, userId) || null
  );
}

// cria cliente mínimo a partir dos dados do usuário
export function createClienteFromUser({ ownerId, user }) {
  const info = dbs.cliente
    .prepare(
      `
      INSERT INTO clientes (owner_id, nome, email, telefone, user_id)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .run(
      ownerId,
      user.name ?? "Sem nome",
      user.email ?? null,
      null,
      user.id
    );

  return dbs.cliente
    .prepare(`SELECT * FROM clientes WHERE id=? AND owner_id=?`)
    .get(info.lastInsertRowid, ownerId);
}

// garante que exista um cliente vinculado ao user atual
export function ensureClienteForUser({ ownerId, user }) {
  if (!user?.id) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err; // não tente acessar user.id se não houver user
  }

  // tenta achar o cliente pelo user_id
  const existing = dbs.cliente.prepare(`
    SELECT * FROM clientes WHERE owner_id=? AND user_id=? LIMIT 1
  `).get(ownerId, user.id);
  if (existing) return existing;

  // cria cliente mínimo a partir do user
  const info = dbs.cliente.prepare(`
    INSERT INTO clientes (owner_id, nome, email, user_id)
    VALUES (?, ?, ?, ?)
  `).run(ownerId, user.name ?? "Sem nome", user.email ?? null, user.id);

  return dbs.cliente.prepare(`
    SELECT * FROM clientes WHERE id=? AND owner_id=?
  `).get(info.lastInsertRowid, ownerId);
}

export async function createCliente({ ownerId, nome, email, telefone }) {
  // normaliza valores nulos
  return repo.create({
    ownerId,
    data: {
      nome,
      email: email || null,
      telefone: telefone || null,
      criado_em: new Date().toISOString().slice(0, 19).replace("T", " "),
    },
  });
}

export async function updateCliente({ ownerId, id, nome, email, telefone }) {
  return repo.update({
    ownerId,
    id,
    data: { nome, email, telefone },
  });
}

export async function deleteCliente({ ownerId, id }) {
  return repo.remove({ ownerId, id });
}
