import { db } from "../database/sqlite.js";

export async function listUsers() {
  return db.prepare(`SELECT id, name, email, role, owner_id FROM users ORDER BY id DESC`).all();
}

export async function getUserById(id) {
  return db.prepare(`SELECT id, name, email, role, owner_id FROM users WHERE id = ?`).get(id) || null;
}

export async function updateUserRole(id, role) {
  const info = db.prepare(`UPDATE users SET role = ? WHERE id = ?`).run(role, id);
  return info.changes > 0 ? getUserById(id) : null;
}

export async function deleteUser(id) {
  const info = db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
  return info.changes > 0;
}
