// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import 'dotenv/config'; 

import authRoutes from "./routes/auth.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import servicosRoutes from "./routes/servicos.routes.js";
import agendamentosRoutes from "./routes/agendamentos.routes.js";
import petsRoutes from "./routes/pets.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Configuração do CORS
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares essenciais
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Healthcheck
app.get("/ping", (req, res) => {
  res.json({ message: "API online" });
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/servicos", servicosRoutes);
app.use("/api/agendamentos", agendamentosRoutes);

// handler de erro (sempre por último)
app.use(errorHandler);

export default app;
