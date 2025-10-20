import {
  listClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from "../services/clientes.service.js";

function validateCreate(body) {
  const { nome, email, telefone } = body || {};
  if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
    return "Campo 'nome' é obrigatório e deve ter pelo menos 2 caracteres.";
  }
  if (email && typeof email !== "string") return "Campo 'email' inválido.";
  if (telefone && typeof telefone !== "string") return "Campo 'telefone' inválido.";
  return null;
}

export async function listController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const search = (req.query.search || "").toString();
    const data = await listClientes({ ownerId, search });
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getByIdController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const row = await getClienteById({ ownerId, id });
    if (!row) return res.status(404).json({ success:false, error:"Cliente não encontrado" });

    return res.json({ success: true, data: row });
  } catch (err) { next(err); }
}

export async function createController(req, res, next) {
  try {
    const errMsg = validateCreate(req.body);
    if (errMsg) return res.status(400).json({ success:false, error: errMsg });

    const ownerId = req.session.userId;
    const { nome, email, telefone } = req.body;
    const novo = await createCliente({ ownerId, nome: nome.trim(), email, telefone });
    return res.status(201).json({ success: true, data: novo });
  } catch (err) { next(err); }
}

export async function updateController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const { nome, email, telefone } = req.body || {};
    if (nome !== undefined && (typeof nome !== "string" || nome.trim().length < 2)) {
      return res.status(400).json({ success:false, error:"Nome inválido" });
    }

    const upd = await updateCliente({ ownerId, id, nome, email, telefone });
    if (!upd) return res.status(404).json({ success:false, error:"Cliente não encontrado" });

    return res.json({ success: true, data: upd });
  } catch (err) { next(err); }
}

export async function deleteController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const ok = await deleteCliente({ ownerId, id });
    if (!ok) return res.status(404).json({ success:false, error:"Cliente não encontrado" });

    return res.status(204).end();
  } catch (err) { next(err); }
}
