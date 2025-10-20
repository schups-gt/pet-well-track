import { Router } from "express";
import { resetPasswordController } from "../controllers/auth.controller.js";
import {
  registerController,
  loginController,
  logoutController,
  meController
} from "../controllers/auth.controller.js";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();

router.post("/register", registerController);
router.post("/reset", resetPasswordController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", authGuard, meController);

export default router;
