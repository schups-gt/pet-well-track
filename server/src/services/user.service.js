import { db } from "../database/sqlite.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    reset_token TEXT,
    reset_expires INTEGER
  );
`);

export async function findUserByEmail(email) {
  return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) || null;
}

export async function findUserById(id) {
  return db.prepare(`SELECT id, name, email FROM users WHERE id = ?`).get(id) || null;
}

export async function createUser({ name, email, password_hash }) {
  const stmt = db.prepare(`
    INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)
  `);
  const info = stmt.run(name, email, password_hash);
  return { id: info.lastInsertRowid, name, email };
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
