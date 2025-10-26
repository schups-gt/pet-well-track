import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  listController,
  getByIdController,
  createController,
  updateController,
  deleteController
} from "../controllers/servicos.controller.js";
//import authGuard from '../middleware/authGuard.js'; -> Para quando for usar com banco de dados
const router = Router();

router.use(verifyJWT);

router.get("/", listController);          // GET /api/servicos?search=
router.get("/:id", getByIdController);    // GET /api/servicos/:id
router.post("/", createController);       // POST /api/servicos
router.put("/:id", updateController);     // PUT /api/servicos/:id
router.delete("/:id", deleteController);  // DELETE /api/servicos/:id
//router.get('/', authGuard, getServicos); -> Para quando for usar com banco de dados
export default router;
