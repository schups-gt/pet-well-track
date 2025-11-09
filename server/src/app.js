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
import calendarRoutes from "./routes/calendar.routes.js";
import adminCalendarRoutes from "./routes/admin-calendar.routes.js";


dotenv.config();
const app = express();

// Configuração do CORS
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
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
app.use("/api/calendar", calendarRoutes);
app.use("/api/admin/calendar", adminCalendarRoutes);
app.use("/api/auth/pets", petsRoutes);

// handler de erro (sempre por último)
app.use(errorHandler);

export default app;
