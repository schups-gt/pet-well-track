// server/src/reset-db.js
import { dbs } from "./database/sqlite.js";

console.log("🧹 Limpando tabelas...");

db.exec(`
  DELETE FROM clientes;
  DELETE FROM users;
  VACUUM; -- libera espaço físico
`);

console.log("✅ Tabelas 'clientes' e 'users' limpas com sucesso.");
