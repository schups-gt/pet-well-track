import { getAdminCalendar, getUserCalendar } from "../services/calendar.service.js";

export async function adminCalendarController(req, res, next) {
  try {
    const ownerId = Number(req.query.ownerId || req.ownerId || req.userId);
    const date = String(req.query.date || "");
    if (!ownerId || !date) return res.status(400).json({ error:"ownerId e date são obrigatórios" });
    return res.json(getAdminCalendar({ ownerId, dateISO: date }));
  } catch (e) { next(e); }
}

export async function userCalendarController(req, res, next) {
  try {
    const ownerId = Number(req.query.ownerId || req.ownerId || req.userId);
    const date = String(req.query.date || "");
    const serviceId = Number(req.query.serviceId);
    const userId = Number(req.query.userId || req.userId);
    if (!ownerId || !date || !serviceId || !userId)
      return res.status(400).json({ error:"ownerId, date, serviceId e userId são obrigatórios" });
    const data = getUserCalendar({ ownerId, dateISO: date, serviceId, userId });
    if (data.error) return res.status(400).json({ error: data.error });
    return res.json(data);
  } catch (e) { next(e); }
}

export async function getAvailabilityController(req, res) {
  const { ownerId, date } = req.query;

  if (!ownerId || !date)
    return res.status(400).json({ success: false, error: "ownerId e date são obrigatórios" });

  try {
    // busca horários de trabalho do dia da semana
    const dow = new Date(date).toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
    const workRows = dbs.profissional
      .prepare("SELECT janela FROM horarios_trabalho WHERE owner_id = ? AND dow = ?")
      .all(ownerId, dow);

    if (!workRows.length)
      return res.json({ success: true, data: [] });

    // busca agendamentos do mesmo dia
    const booked = dbs.agendamento
      .prepare("SELECT data_hora FROM agendamentos WHERE owner_id = ? AND date(data_hora) = date(?)")
      .all(ownerId, date);

    const bookedTimes = booked.map(b => new Date(b.data_hora).toISOString().substring(11, 16));

    // gera lista de intervalos disponíveis
    const available = [];
    for (const w of workRows) {
      const [start, end] = w.janela.split("-");
      for (let h = parseInt(start); h < parseInt(end); h++) {
        const slot = `${String(h).padStart(2, "0")}:00`;
        if (!bookedTimes.includes(slot)) available.push(slot);
      }
    }

    res.json({ success: true, data: available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Erro interno ao consultar disponibilidade" });
  }
}