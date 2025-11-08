import dayjs from "dayjs";
import { dbs } from "../database/sqlite.js";

export async function createBlockController(req, res, next) {
  try {
    const { ownerId, startISO, endISO, reason, kind } = req.body || {};
    if (!ownerId || !startISO || !endISO) return res.status(400).json({ error:"ownerId, startISO e endISO são obrigatórios" });
    const st = dayjs(startISO), en = dayjs(endISO);
    if (!en.isAfter(st)) return res.status(400).json({ error:"Intervalo inválido" });

    const has = dbs.agendamento.prepare(`
      SELECT 1
      FROM agendamentos a
      LEFT JOIN ${'servicos'} s ON s.id = a.servico_id
      WHERE a.owner_id=?
        AND (a.status IS NULL OR a.status <> 'cancelled')
        AND NOT (
          datetime(a.data_hora, '+' || COALESCE(s.duration_min,30) || ' minutes') <= ?
          OR a.data_hora >= ?
        )
      LIMIT 1
    `).get(ownerId, st.toISOString(), en.toISOString());
    if (has) return res.status(409).json({ error:"Há consultas nesse intervalo" });

    dbs.agendamento.prepare(`
      INSERT INTO bloqueios (owner_id, start_iso, end_iso, reason, kind)
      VALUES (?,?,?,?,?)
    `).run(ownerId, st.toISOString(), en.toISOString(), reason || null, kind || "admin");

    res.status(201).json({ ok:true });
  } catch (e) { next(e); }
}

export async function setWorkWeekController(req, res, next) {
  try {
    const { ownerId, weekly } = req.body || {};
    if (!ownerId || !weekly) return res.status(400).json({ error:"ownerId e weekly são obrigatórios" });
    const keys = ["mon","tue","wed","thu","fri","sat","sun"];
    const ins = dbs.profissional.prepare(`INSERT INTO horarios_trabalho (owner_id, dow, janela) VALUES (?,?,?)`);
    const del = dbs.profissional.prepare(`DELETE FROM horarios_trabalho WHERE owner_id=?`);
    dbs.profissional.transaction(() => {
      del.run(ownerId);
      for (const k of keys) for (const j of (weekly[k]||[])) ins.run(ownerId, k, j);
    })();
    res.json({ ok:true });
  } catch (e) { next(e); }
}
