import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import tz from "dayjs/plugin/timezone.js";
import { dbs } from "../database/sqlite.js";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault("America/Sao_Paulo");

function parseTimeOnDate(dateISO, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return dayjs.tz(dateISO, "America/Sao_Paulo").hour(h).minute(m).second(0).millisecond(0);
}
function buildSlotsForDay({ dateISO, windows, durationMin }) {
  const out = [];
  for (const w of windows) {
    const [s, e] = w.split("-");
    let cursor = parseTimeOnDate(dateISO, s);
    const end = parseTimeOnDate(dateISO, e);
    while (cursor.add(durationMin, "minute").isSameOrBefore(end)) {
      const st = cursor; const en = cursor.add(durationMin, "minute");
      out.push({ start: st.toISOString(), end: en.toISOString() });
      cursor = en;
    }
  }
  return out;
}
function overlaps(aS, aE, bS, bE) {
  return !(dayjs(aE).isSameOrBefore(bS) || dayjs(aS).isSameOrAfter(bE));
}

export function getWorkWindows({ ownerId, dateISO }) {
  const dowMap = ["sun","mon","tue","wed","thu","fri","sat"];
  const dow = dowMap[dayjs.tz(dateISO).day()];
  const rows = dbs.profissional.prepare(
    `SELECT janela FROM horarios_trabalho WHERE owner_id=? AND dow=? ORDER BY id`
  ).all(ownerId, dow);
  return rows.map(r => r.janela);
}

export function getAdminCalendar({ ownerId, dateISO }) {
  const startDay = dayjs.tz(dateISO).startOf("day").toISOString();
  const endDay   = dayjs.tz(dateISO).endOf("day").toISOString();

  const appointments = dbs.agendamento.prepare(`
    SELECT a.*, s.titulo AS servico_titulo, COALESCE(s.duration_min,30) AS duration_min
    FROM agendamentos a
    LEFT JOIN ${'servicos'} s ON s.id = a.servico_id
    WHERE a.owner_id=? AND a.data_hora BETWEEN ? AND ?
      AND (a.status IS NULL OR a.status <> 'cancelled')
    ORDER BY a.data_hora
  `).all(ownerId, startDay, endDay);

  const blocks = dbs.agendamento.prepare(`
    SELECT * FROM bloqueios
    WHERE owner_id=? AND NOT (end_iso <= ? OR start_iso >= ?)
    ORDER BY start_iso
  `).all(ownerId, startDay, endDay);

  return { date: dateISO, appointments, blocks };
}

export function getUserCalendar({ ownerId, dateISO, serviceId, userId }) {
  const svc = dbs.profissional.prepare(
    `SELECT id, titulo, COALESCE(duration_min,30) AS duration_min, COALESCE(active,1) AS active
     FROM servicos WHERE owner_id=? AND id=?`
  ).get(ownerId, serviceId);
  if (!svc || !svc.active) return { error: "Serviço inválido" };

  const windows = getWorkWindows({ ownerId, dateISO });
  const allSlots = buildSlotsForDay({ dateISO, windows, durationMin: svc.duration_min });

  const startDay = dayjs.tz(dateISO).startOf("day").toISOString();
  const endDay   = dayjs.tz(dateISO).endOf("day").toISOString();

  const appts = dbs.agendamento.prepare(`
    SELECT a.data_hora, COALESCE(s.duration_min,30) AS duration_min
    FROM agendamentos a
    LEFT JOIN ${'servicos'} s ON s.id = a.servico_id
    WHERE a.owner_id=? AND a.data_hora BETWEEN ? AND ?
      AND (a.status IS NULL OR a.status <> 'cancelled')
  `).all(ownerId, startDay, endDay);

  const blocks = dbs.agendamento.prepare(`
    SELECT start_iso, end_iso FROM bloqueios
    WHERE owner_id=? AND NOT (end_iso <= ? OR start_iso >= ?)
  `).all(ownerId, startDay, endDay);

  const busy = [
    ...appts.map(a => {
      const st = dayjs(a.data_hora); const en = st.add(a.duration_min, "minute");
      return { start: st.toISOString(), end: en.toISOString() };
    }),
    ...blocks.map(b => ({ start: b.start_iso, end: b.end_iso }))
  ];

  const free = allSlots.filter(sl => !busy.some(b => overlaps(sl.start, sl.end, b.start, b.end)));

  const myAppointments = dbs.agendamento.prepare(`
    SELECT a.*, s.titulo AS servico_titulo, COALESCE(s.duration_min,30) AS duration_min
    FROM agendamentos a
    LEFT JOIN ${'servicos'} s ON s.id = a.servico_id
    WHERE a.owner_id=? AND a.cliente_id=? AND a.data_hora BETWEEN ? AND ?
      AND (a.status IS NULL OR a.status <> 'cancelled')
    ORDER BY a.data_hora
  `).all(ownerId, userId, startDay, endDay);

  return { date: dateISO, serviceId, windows, slots: free, myAppointments };
}
