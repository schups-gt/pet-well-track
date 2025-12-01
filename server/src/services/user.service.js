import { dbs } from "../database/sqlite.js";

/**
 * OBS:
 * - A criação de tabelas já é feita em sqlite.js (ensureTables()).
 * - Mantive aqui apenas as operações de dados.
 */

export async function findUserByEmail(email) {
  return (
    dbs.cliente
      .prepare(`
        SELECT id, name, email, password_hash, role, owner_id, email_verified
        FROM users
        WHERE email = ?
      `)
      .get(email) || null
  );
}

export async function findUserById(id) {
  return (
    dbs.cliente
      .prepare(`
        SELECT id, name, email, role, owner_id, telefone, endereco, cidade, estado, cep
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
    const stmt = dbs.cliente.prepare(`
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
  dbs.cliente.prepare(
    `UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?`
  ).run(token, expires, id);
}

export async function findUserByResetToken(token) {
  const now = Date.now();
  return (
    dbs.cliente
      .prepare(
        `SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?`
      )
      .get(token, now) || null
  );
}

export async function updateUserPassword(id, password_hash) {
  dbs.cliente.prepare(
    `UPDATE users
     SET password_hash = ?, reset_token = NULL, reset_expires = NULL
     WHERE id = ?`
  ).run(password_hash, id);
}

/**
 * Atualiza token e expiration de verificação de email
 */
export async function updateEmailVerificationToken(id, token, expires) {
  dbs.cliente.prepare(
    `UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?`
  ).run(token, expires, id);
}

/**
 * Verifica se um usuário tem email confirmado
 */
export async function isEmailVerified(id) {
  const user = dbs.cliente.prepare(
    `SELECT email_verified FROM users WHERE id = ?`
  ).get(id);
  
  return user ? user.email_verified === 1 : false;
}

/**
 * Busca usuário pelo token de verificação
 */
export async function findUserByVerificationToken(token) {
  const now = Date.now();
  console.log(`[USER.SERVICE] Buscando usuário com token: ${token.substring(0, 20)}...`);
  console.log(`[USER.SERVICE] Timestamp atual: ${now}`);
  
  const user = dbs.cliente
    .prepare(
      `SELECT id, email, email_verified FROM users 
       WHERE verification_token = ? AND verification_expires > ?`
    )
    .get(token, now);
  
  if (user) {
    console.log(`[USER.SERVICE] ✓ Usuário encontrado: ID=${user.id}, Email=${user.email}`);
  } else {
    console.log(`[USER.SERVICE] ❌ Nenhum usuário encontrado com esse token`);
  }
  
  return user || null;
}

/**
 * Marca email como verificado
 */
export async function markEmailAsVerified(userId) {
  console.log(`[USER.SERVICE] Marcando email verificado para user ID: ${userId}`);
  
  const result = dbs.cliente.prepare(
    `UPDATE users 
     SET email_verified = 1, verification_token = NULL, verification_expires = NULL
     WHERE id = ?`
  ).run(userId);
  
  
  console.log(`[USER.SERVICE] ✓ Linhas afetadas: ${result.changes}`);
  
  // Verificar se foi atualizado
  const updated = dbs.cliente.prepare(
    `SELECT id, email, email_verified FROM users WHERE id = ?`
  ).get(userId);
  
  console.log(`[USER.SERVICE] Novo estado do usuário: email_verified=${updated?.email_verified}`);
}

/**
 * Atualiza perfil do usuário (name, telefone, endereco, cidade, estado, cep)
 */
export async function updateUserProfile(userId, profileData) {
  const { name, telefone, endereco, cidade, estado, cep } = profileData;
  
  const result = dbs.cliente.prepare(`
    UPDATE users 
    SET 
      name = COALESCE(?, name),
      telefone = COALESCE(?, telefone),
      endereco = COALESCE(?, endereco),
      cidade = COALESCE(?, cidade),
      estado = COALESCE(?, estado),
      cep = COALESCE(?, cep)
    WHERE id = ?
  `).run(name, telefone, endereco, cidade, estado, cep, userId);
  
  // Retornar dados atualizados
  const updatedUser = dbs.cliente.prepare(`
    SELECT id, name, email, telefone, endereco, cidade, estado, cep, role, owner_id
    FROM users
    WHERE id = ?
  `).get(userId);
  
  return updatedUser;
}
