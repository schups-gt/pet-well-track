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
