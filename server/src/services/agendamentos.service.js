import { db } from "../database/sqlite.js";

export async function listAgendamentos({ ownerId, from, to }) {
  if (from && to) {
    return db.prepare(`
      SELECT * FROM agendamentos
      WHERE owner_id = ? AND data_hora BETWEEN ? AND ? ORDER BY data_hora ASC
    `).all(ownerId, from, to);
  }
  return db.prepare(`SELECT * FROM agendamentos WHERE owner_id = ? ORDER BY data_hora ASC`).all(ownerId);
}

export async function getAgendamentoById({ ownerId, id }) {
  return db.prepare(`SELECT * FROM agendamentos WHERE owner_id=? AND id=?`).get(ownerId, id) || null;
}

export async function createAgendamento({ ownerId, cliente_id, servico_id, data_hora, observacoes }) {
  // conflito: mesmo cliente na mesma data/hora
  const exists = db.prepare(`
    SELECT 1 FROM agendamentos WHERE owner_id=? AND cliente_id=? AND data_hora=? LIMIT 1
  `).get(ownerId, cliente_id, data_hora);
  if (exists) return { conflict: true };

  const info = db.prepare(`
    INSERT INTO agendamentos (owner_id, cliente_id, servico_id, data_hora, observacoes)
    VALUES (?, ?, ?, ?, ?)
  `).run(ownerId, cliente_id, servico_id, data_hora, observacoes || null);
  return getAgendamentoById({ ownerId, id: Number(info.lastInsertRowid) });
}

export async function updateAgendamento({ ownerId, id, status, observacoes }) {
  const cur = await getAgendamentoById({ ownerId, id });
  if (!cur) return null;
  db.prepare(`
    UPDATE agendamentos SET status=?, observacoes=? WHERE owner_id=? AND id=?
  `).run(status ?? cur.status, observacoes ?? cur.observacoes, ownerId, id);
  return getAgendamentoById({ ownerId, id });
}

export async function deleteAgendamento({ ownerId, id }) {
  const info = db.prepare(`DELETE FROM agendamentos WHERE owner_id=? AND id=?`).run(ownerId, id);
  return info.changes > 0;
}

export async function hasConflito({ ownerId, cliente_id, data_hora }) {
  // verifica se já existe agendamento para o mesmo cliente no mesmo horário
  const row = dbs.agendamento.prepare(`
    SELECT 1
    FROM agendamentos
    WHERE owner_id = ?
      AND cliente_id = ?
      AND data_hora = ?
    LIMIT 1
  `).get(ownerId, cliente_id, data_hora);
  return !!row; // true = conflitou
}