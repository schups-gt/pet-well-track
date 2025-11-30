import axios from "axios";
import { dbs } from "./src/database/sqlite.js";
import jwt from "jsonwebtoken";

const API_URL = "http://localhost:3000/api";

async function debugToken() {
  console.log("\n🔍 DEBUG: Analisando token JWT\n");
  console.log("=" .repeat(60));

  try {
    // STEP 1: Register
    console.log("\n📝 STEP 1: Registrando usuário...");
    const email = `test-pet-${Date.now()}@test.com`;
    const password = "Test@123456";
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: "Usuario Teste",
      email,
      password,
    });
    const userId = registerRes.data.data.id;

    // STEP 2: Verify Email
    console.log("\n✉️  STEP 2: Verificando email...");
    const userRecord = dbs.cliente.prepare("SELECT verification_token FROM users WHERE id = ?").get(userId);
    const verificationToken = userRecord.verification_token;
    await axios.post(`${API_URL}/auth/verify-email/${verificationToken}`);

    // STEP 3: Login
    console.log("\n🔑 STEP 3: Fazendo login...");
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const token = loginRes.data.data.token;

    // STEP 4: Decodificar e analisar token
    console.log("\n🔐 STEP 4: Decodificando JWT...");
    const decoded = jwt.decode(token);
    console.log("Payload decodificado:");
    console.log(JSON.stringify(decoded, null, 2));

    // STEP 5: Verificar user no banco
    console.log("\n🗄️  STEP 5: Verificando user no banco...");
    const userInDb = dbs.cliente.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    console.log("User no banco:");
    console.log(JSON.stringify({
      id: userInDb.id,
      email: userInDb.email,
      role: userInDb.role,
      owner_id: userInDb.owner_id
    }, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("✅ DEBUG COMPLETO\n");

  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.log("❌ ERRO:\n", error.message);
  }
}

debugToken();
