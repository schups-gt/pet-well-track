import { Router } from "express";
import { resetPasswordController } from "../controllers/auth.controller.js";
import {
  registerController,
  loginController,
  logoutController,
  meController,
  resetPasswordConfirmController
} from "../controllers/auth.controller.js";
import { authGuard } from "../middleware/authGuard.js";
const API_URL = "http://localhost:3000";



/* -> Para quando for usar com banco de dados
export default function authGuard(req, res, next) {
  try {
    // cookie first
    const token = req.cookies?.[COOKIE_NAME] || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ message: 'Não autenticado' });

    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
*/


const router = Router();

router.post("/register", registerController);
router.post("/reset", resetPasswordController);
router.post("/reset-password/:token", resetPasswordConfirmController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", authGuard, meController);

export default router;
