import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  listController,
  getByIdController,
  updateRoleController,
  deleteController
} from "../controllers/admin.controller.js";

const router = Router();

// middleware para restringir apenas admins
router.use(verifyJWT, (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ success: false, error: "Acesso negado: apenas administradores." });
  }
  next();
});

router.get("/", listController);
router.get("/:id", getByIdController);
router.put("/:id/role", updateRoleController);
router.delete("/:id", deleteController);

export default router;
