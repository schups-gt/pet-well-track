import { dbs } from "../database/sqlite.js";

export async function listUsers() {
  return dbs.cliente.prepare(`SELECT id, name, email, role, owner_id FROM users ORDER BY id DESC`).all();
}

export async function getUserById(id) {
  return dbs.cliente.prepare(`SELECT id, name, email, role, owner_id FROM users WHERE id = ?`).get(id) || null;
}

export async function updateUserRole(id, role) {
  const info = dbs.cliente.prepare(`UPDATE users SET role = ? WHERE id = ?`).run(role, id);
  return info.changes > 0 ? getUserById(id) : null;
}

export async function deleteUser(id) {
  const info = dbs.cliente.prepare(`DELETE FROM users WHERE id = ?`).run(id);
  return info.changes > 0;
}
