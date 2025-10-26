// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import 'dotenv/config'; 


import authRoutes from "./routes/auth.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import servicosRoutes from "./routes/servicos.routes.js";
import agendamentosRoutes from "./routes/agendamentos.routes.js";

dotenv.config();
const app = express();

// CORS - ajustar pro front
app.use(cors({
  origin: "http://localhost:8080", // porta do seu front
  credentials: true,
}));

app.use(express.json());

//app.use(cookieParser()); -> Para quando estiver com o banco de dados

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

export default app;
