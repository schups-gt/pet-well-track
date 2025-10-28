import { db } from "../database/sqlite.js";

export async function findUserByEmail(email) {
  return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) || null;
}

export async function findUserById(id) {
  return db.prepare(`SELECT id, name, email FROM users WHERE id = ?`).get(id) || null;
}

export async function createUser({ name, email, password_hash }) {
  console.log('📝 Tentando criar usuário:', { name, email });
  try {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)
    `);
    const info = stmt.run(name, email, password_hash);
    console.log('Cliente cadastrado com sucesso:', { id: info.lastInsertRowid });
    return { id: info.lastInsertRowid, name, email };
  } catch (error) {
    console.error('Erro ao cadastrar o cliente:', error);
    throw error;
  }
}

export async function updateUserToken(id, token, expires) {
  db.prepare(`UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?`)
    .run(token, expires, id);
}

export async function findUserByResetToken(token) {
  const now = Date.now();
  return db.prepare(`
    SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?
  `).get(token, now) || null;
}

export async function updateUserPassword(id, password_hash) {
  db.prepare(`UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?`)
    .run(password_hash, id);
}
