import { db } from "../database/sqlite.js";

/**
 * OBS:
 * - A criação de tabelas já é feita em sqlite.js (ensureTables()).
 * - Mantive aqui apenas as operações de dados.
 */

export async function findUserByEmail(email) {
  return (
    db
      .prepare(`
        SELECT id, name, email, password_hash, role, owner_id
        FROM users
        WHERE email = ?
      `)
      .get(email) || null
  );
}

export async function findUserById(id) {
  return (
    db
      .prepare(`
        SELECT id, name, email, role, owner_id
        FROM users
        WHERE id = ?
      `)
      .get(id) || null
  );
}

export async function createUser({
  name,
  email,
  password_hash,
  role = "user",
  owner_id = 1,
}) {
  try {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, owner_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, email, password_hash, role, owner_id);

    return {
      id: info.lastInsertRowid,
      name,
      email,
      role,
      owner_id,
    };
  } catch (error) {
    // se for UNIQUE constraint em email, propague para o controller tratar 409
    throw error;
  }
}

export async function updateUserToken(id, token, expires) {
  db.prepare(
    `UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?`
  ).run(token, expires, id);
}

export async function findUserByResetToken(token) {
  const now = Date.now();
  return (
    db
      .prepare(
        `SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?`
      )
      .get(token, now) || null
  );
}

export async function updateUserPassword(id, password_hash) {
  db.prepare(
    `UPDATE users
     SET password_hash = ?, reset_token = NULL, reset_expires = NULL
     WHERE id = ?`
  ).run(password_hash, id);
}
