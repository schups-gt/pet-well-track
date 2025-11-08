import { listUsers, getUserById, updateUserRole, deleteUser } from "../services/admin.service.js";

export async function listController(req, res, next) {
  try {
    const data = await listUsers();
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getByIdController(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const user = await getUserById(id);
    if (!user) return res.status(404).json({ success:false, error:"Usuário não encontrado" });

    return res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function updateRoleController(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ success:false, error:"Role inválido" });
    }
    const updated = await updateUserRole(id, role);
    if (!updated) return res.status(404).json({ success:false, error:"Usuário não encontrado" });
    return res.json({ success:true, data: updated });
  } catch (err) { next(err); }
}

export async function deleteController(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success:false, error:"ID inválido" });

    const ok = await deleteUser(id);
    if (!ok) return res.status(404).json({ success:false, error:"Usuário não encontrado" });

    return res.status(204).end();
  } catch (err) { next(err); }
}
