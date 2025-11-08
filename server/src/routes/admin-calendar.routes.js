import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { requireRole } from "../middleware/requireRole.js";
import { createBlockController, setWorkWeekController } from "../controllers/admin-calendar.controller.js";

const router = Router();
router.use(verifyJWT);
router.post("/blocks", requireRole("admin","vet"), createBlockController);
router.post("/work",   requireRole("admin","vet"), setWorkWeekController);
export default router;
