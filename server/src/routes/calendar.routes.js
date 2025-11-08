import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { requireRole } from "../middleware/requireRole.js";
import { adminCalendarController, userCalendarController } from "../controllers/calendar.controller.js";
import { getAvailabilityController } from "../controllers/calendar.controller.js";

const router = Router();
router.get("/admin", verifyJWT, requireRole("admin","vet"), adminCalendarController);
router.get("/user", verifyJWT, userCalendarController);
router.get("/availability", getAvailabilityController);
export default router;