import dayjs from "dayjs";
import { dbs } from "../database/sqlite.js";

// Util: normaliza ISO (sempre em string ISO)
const toISO = (d) => dayjs(d).toISOString();

/**
 * Calcula se [start, end) sobrepõe [bs, be)
 */
function overlaps(startISO, endISO, busyStartISO, busyEndISO) {
  return !(dayjs(endISO).isSameOrBefore(busyStartISO) || dayjs(startISO).isSameOrAfter(busyEndISO));
}

/**
 * Busca duration_min do serviço (default 30)
 */
function getServiceDurationMin(ownerId, servico_id) {
  const row = dbs.profissional
    .prepare(`SELECT COALESCE(duration_min, 30) AS duration_min FROM servicos WHERE owner_id=? AND id=?`)
    .get(ownerId, servico_id);
  return row?.duration_min ?? 30;
}

/**
 * Verifica sobreposição contra agendamentos e bloqueios no dia
 * (sem JOIN cross-DB; resolve em JS)
 */
function checaConflito({ ownerId, servico_id, data_hora }) {
  const dur = getServiceDurationMin(ownerId, servico_id);
  const start = dayjs(data_hora);
  const end = start.add(dur, "minute");
  const startISO = start.toISOString();
  const endISO = end.toISOString();

  // Janela do dia para filtrar candidatos
  const dayStart = start.startOf("day").toISOString();
  const dayEnd = start.endOf("day").toISOString();

  // 1) Agendamentos do dia (status != 'cancelled')
  // 1) Agendamentos do dia (status != 'cancelado')
const appts = dbs.agendamento
  .prepare(`
    SELECT a.id, a.servico_id, a.data_hora, COALESCE(a.status,'') AS status
    FROM agendamentos a
    WHERE a.owner_id = ?
      AND a.data_hora BETWEEN ? AND ?
      AND (a.status IS NULL OR a.status <> 'cancelado')
    ORDER BY a.data_hora
  `)
  .all(ownerId, dayStart, dayEnd);

  // Calcula ranges ocupados dos agendamentos existentes
  for (const a of appts) {
    const aDur = getServiceDurationMin(ownerId, a.servico_id);
    const aStartISO = toISO(a.data_hora);
    const aEndISO = dayjs(a.data_hora).add(aDur, "minute").toISOString();
    if (overlaps(startISO, endISO, aStartISO, aEndISO)) {
      return true;
    }
  }

  // 2) Bloqueios do dia
  const blocks = dbs.agendamento
    .prepare(`
      SELECT start_iso, end_iso
      FROM bloqueios
      WHERE owner_id=? AND NOT (end_iso <= ? OR start_iso >= ?)
    `)
    .all(ownerId, dayStart, dayEnd);

  for (const b of blocks) {
    if (overlaps(startISO, endISO, b.start_iso, b.end_iso)) {
      return true;
    }
  }

  return false;
}

// ===== CRUD =====

export async function listAgendamentos({ ownerId, from, to }) {
  if (from && to) {
    return dbs.agendamento
      .prepare(`
        SELECT * FROM agendamentos
        WHERE owner_id=? AND data_hora BETWEEN ? AND ?
        ORDER BY data_hora ASC
      `)
      .all(ownerId, from, to);
  }
  return dbs.agendamento
    .prepare(`SELECT * FROM agendamentos WHERE owner_id=? ORDER BY data_hora ASC`)
    .all(ownerId);
}

export async function getAgendamentoById({ ownerId, id }) {
  return (
    dbs.agendamento
      .prepare(`SELECT * FROM agendamentos WHERE owner_id=? AND id=?`)
      .get(ownerId, id) || null
  );
}

export async function createAgendamento({ ownerId, cliente_id, servico_id, data_hora, observacoes }) {
  const startISO = toISO(data_hora);

  // conflito 1: mesmo cliente, mesmo instante exato (regra que você já tinha)
  const sameInstant = dbs.agendamento
    .prepare(`
      SELECT 1 FROM agendamentos
      WHERE owner_id=? AND cliente_id=? AND data_hora=?
      LIMIT 1
    `)
    .get(ownerId, cliente_id, startISO);
  if (sameInstant) return { conflict: true, reason: "same-instant" };

  // conflito 2: sobreposição por duração de serviço + bloqueios
  if (checaConflito({ ownerId, servico_id, data_hora: startISO })) {
    return { conflict: true, reason: "overlap" };
  }

  const info = dbs.agendamento
    .prepare(
      `INSERT INTO agendamentos (owner_id, cliente_id, servico_id, data_hora, observacoes)
       VALUES (?,?,?,?,?)`
    )
    .run(ownerId, cliente_id, servico_id, startISO, observacoes || null);

  return getAgendamentoById({ ownerId, id: Number(info.lastInsertRowid) });
}

export async function updateAgendamento({ ownerId, id, status, observacoes }) {
  const cur = await getAgendamentoById({ ownerId, id });
  if (!cur) return null;

  dbs.agendamento
    .prepare(`UPDATE agendamentos SET status=?, observacoes=? WHERE owner_id=? AND id=?`)
    .run(status ?? cur.status, observacoes ?? cur.observacoes, ownerId, id);

  return getAgendamentoById({ ownerId, id });
}

export async function deleteAgendamento({ ownerId, id }) {
  const info = dbs.agendamento
    .prepare(`DELETE FROM agendamentos WHERE owner_id=? AND id=?`)
    .run(ownerId, id);
  return info.changes > 0;
}

/**
 * (Opcional) Mantive essa função só se você quiser checar
 * "mesmo cliente no mesmo instante" isoladamente.
 * Agora ela usa o handle correto (dbs.agendamento).
 */
export async function hasConflito({ ownerId, cliente_id, data_hora }) {
  const row = dbs.agendamento
    .prepare(
      `SELECT 1 FROM agendamentos
       WHERE owner_id=? AND cliente_id=? AND data_hora=? LIMIT 1`
    )
    .get(ownerId, cliente_id, toISO(data_hora));
  return !!row;
}
