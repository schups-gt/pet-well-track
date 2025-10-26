import app from "./src/app.js";
import dotenv from "dotenv";
import 'dotenv/config'; 

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});