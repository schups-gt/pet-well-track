import { Router } from "express";
import { authGuard } from "../middleware/authGuard.js";
import {
    listController,
    getByIdController,
    createController,
    updateController,
    deleteController
} from "../controllers/agendamentos.controller.js";

const router = Router();

router.use(authGuard);

router.get("/", listController);          // GET /api/agendamentos?from&to
router.get("/:id", getByIdController);    // GET /api/agendamentos/:id
router.post("/", createController);       // POST /api/agendamentos
router.put("/:id", updateController);     // PUT /api/agendamentos/:id
router.delete("/:id", deleteController);  // DELETE /api/agendamentos/:id

export default router;