import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  listController,
  getByIdController,
  createController,
  updateController,
  deleteController
} from "../controllers/pets.controller.js";

const router = Router();

router.use(verifyJWT); // precisa estar ANTES das rotas

router.get("/", listController);
router.get("/:id", getByIdController);
router.post("/", createController);
router.put("/:id", updateController);
router.delete("/:id", deleteController);

export default router;
