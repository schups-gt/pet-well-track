import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { requireRole } from "../middleware/requireRole.js";
import { createBlockController, setWorkWeekController } from "../controllers/admin-calendar.controller.js";

const router = Router();
router.post("/blocks", verifyJWT, requireRole("admin","vet"), createBlockController);
router.post("/work", verifyJWT, requireRole("admin","vet"), setWorkWeekController);
export default router;
