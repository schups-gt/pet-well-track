import express from "express";
import { createPet, getPets } from "../controllers/pets.controller.js";

const router = express.Router();

router.post("/", createPet);   // Cadastrar pet
router.get("/", getPets);      // Listar pets

export default router;