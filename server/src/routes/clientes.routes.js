import {Router} from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
    listController,
    getByIdController,
    createController,
    updateController,
    deleteController
} from "../controllers/clientes.controller.js";

const router = Router();

router.use(verifyJWT);
router.get("/", listController);          // GET /api/clientes?search=
router.get("/:id", getByIdController);    // GET /api/clientes/:id
router.post("/", createController);       // POST /api/clientes
router.put("/:id", updateController);     // PUT /api/clientes/:id
router.delete("/:id", deleteController);  // DELETE /api/clientes/:id

export default router;