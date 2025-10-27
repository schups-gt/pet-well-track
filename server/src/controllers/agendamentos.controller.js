import { getClienteById } from "../services/clientes.service.js";
import { getServicoById } from "../services/servicos.service.js";
import {
  listAgendamentos,
  getAgendamentoById,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
  hasConflito
} from "../services/agendamentos.service.js";

function isISODate(s) {
  return typeof s === "string" && !Number.isNaN(Date.parse(s));
}

function validateCreate(body) {
  const { cliente_id, servico_id, data_hora } = body || {};
  if (!Number.isInteger(cliente_id) || cliente_id <= 0) return "cliente_id inválido";
  if (!Number.isInteger(servico_id) || servico_id <= 0) return "servico_id inválido";
  if (!isISODate(data_hora)) return "data_hora deve ser uma string ISO (ex.: 2025-11-27T10:30:00.000Z)";
  return null;
}

export async function listController(req, res, next) {
  try {
    const ownerId = req.userId;
    const { from, to } = req.query;
    const data = await listAgendamentos({ ownerId, from, to });
    return res.json({ success: true, data });
  } catch (e) { next(e); }
}

export async function getByIdController(req, res, next) {
  try {
    const ownerId = req.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const row = await getAgendamentoById({ ownerId, id });
    if (!row) return res.status(404).json({ success:false, error:"Agendamento não encontrado" });

    return res.json({ success: true, data: row });
  } catch (e) { next(e); }
}

export async function createController(req, res, next) {
  try {
    const ownerId = req.userId;
    const err = validateCreate(req.body);
    if (err) return res.status(400).json({ success:false, error: err });

    const { cliente_id, servico_id, data_hora, observacoes } = req.body;

    // valida existência de cliente e serviço
    const cliente = await getClienteById({ ownerId, id: Number(cliente_id) });
    if (!cliente) return res.status(400).json({ success:false, error:"Cliente inexistente" });

    const servico = await getServicoById({ ownerId, id: Number(servico_id) });
    if (!servico) return res.status(400).json({ success:false, error:"Serviço inexistente" });

    // conflito simples
    const conflito = await hasConflito({ ownerId, cliente_id: Number(cliente_id), data_hora });
    if (conflito) return res.status(409).json({ success:false, error:"Conflito: cliente já possui agendamento nesse horário" });

    const novo = await createAgendamento({
      ownerId,
      cliente_id: Number(cliente_id),
      servico_id: Number(servico_id),
      data_hora,
      observacoes
    });
    return res.status(201).json({ success: true, data: novo });
  } catch (e) { next(e); }
}

export async function updateController(req, res, next) {
  try {
    const ownerId = req.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const { data_hora, status, observacoes } = req.body || {};
    if (data_hora !== undefined && !isISODate(data_hora)) {
      return res.status(400).json({ success:false, error:"data_hora inválida" });
    }
    if (status !== undefined && !["marcado","concluido","cancelado"].includes(status)) {
      return res.status(400).json({ success:false, error:"status inválido" });
    }

    const upd = await updateAgendamento({ ownerId, id, data_hora, status, observacoes });
    if (!upd) return res.status(404).json({ success:false, error:"Agendamento não encontrado" });
    return res.json({ success: true, data: upd });
  } catch (e) { next(e); }
}

export async function deleteController(req, res, next) {
  try {
    const ownerId = req.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const ok = await deleteAgendamento({ ownerId, id });
    if (!ok) return res.status(404).json({ success:false, error:"Agendamento não encontrado" });

    return res.status(204).end();
  } catch (e) { next(e); }
}
