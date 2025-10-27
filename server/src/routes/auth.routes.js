// server/src/routes/auth.routes.js
import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  meController,
  resetPasswordController,
  resetPasswordConfirmController,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.js"; // JWT

const router = Router();

// públicas
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/reset", resetPasswordController);
router.post("/reset-password/:token", resetPasswordConfirmController);

// “logout” stateless (só 204)
router.post("/logout", logoutController);

// protegida por JWT
router.get("/me", verifyJWT, meController); // trocado

export default router;

