import {
  listServicos,
  getServicoById,
  createServico,
  updateServico,
  deleteServico
} from "../services/servicos.service.js";

function validateCreate(body) {
  const { titulo, preco_cents } = body || {};
  if (!titulo || typeof titulo !== "string" || titulo.trim().length < 2) {
    return "Campo 'titulo' é obrigatório (mín. 2 caracteres).";
  }
  const n = Number(preco_cents);
  if (!Number.isInteger(n) || n < 0) {
    return "Campo 'preco_cents' deve ser inteiro ≥ 0 (centavos).";
  }
  return null;
}

export async function listController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const search = (req.query.search || "").toString();
    const data = await listServicos({ ownerId, search });
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getByIdController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const row = await getServicoById({ ownerId, id });
    if (!row) return res.status(404).json({ success:false, error:"Serviço não encontrado" });

    return res.json({ success: true, data: row });
  } catch (err) { next(err); }
}

export async function createController(req, res, next) {
  try {
    const errMsg = validateCreate(req.body);
    if (errMsg) return res.status(400).json({ success:false, error: errMsg });

    const ownerId = req.session.userId;
    const { titulo, descricao, preco_cents } = req.body;
    const novo = await createServico({
      ownerId,
      titulo: titulo.trim(),
      descricao,
      preco_cents: Number(preco_cents)
    });
    return res.status(201).json({ success: true, data: novo });
  } catch (err) { next(err); }
}

export async function updateController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const { titulo, descricao, preco_cents } = req.body || {};
    if (titulo !== undefined && (typeof titulo !== "string" || titulo.trim().length < 2)) {
      return res.status(400).json({ success:false, error:"Título inválido" });
    }
    if (preco_cents !== undefined) {
      const n = Number(preco_cents);
      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({ success:false, error:"preco_cents inválido" });
      }
    }

    const upd = await updateServico({
      ownerId, id,
      titulo, descricao,
      preco_cents: (preco_cents !== undefined ? Number(preco_cents) : undefined)
    });
    if (!upd) return res.status(404).json({ success:false, error:"Serviço não encontrado" });

    return res.json({ success: true, data: upd });
  } catch (err) { next(err); }
}

export async function deleteController(req, res, next) {
  try {
    const ownerId = req.session.userId;
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const ok = await deleteServico({ ownerId, id });
    if (!ok) return res.status(404).json({ success:false, error:"Serviço não encontrado" });

    return res.status(204).end();
  } catch (err) { next(err); }
}
