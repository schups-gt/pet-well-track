import axios from "axios";
import { dbs } from "./src/database/sqlite.js";

const API_URL = "http://localhost:3000/api";

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 500) {
      console.log("\n❌ ERRO 500 RECEBIDO!");
      console.log("Resposta completa:", JSON.stringify(err.response.data, null, 2));
    }
    throw err;
  }
);

async function test() {
  try {
    // Register
    const email = `test-pet-${Date.now()}@test.com`;
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: "Usuario Teste",
      email,
      password: "Test@123456",
    });
    const userId = registerRes.data.data.id;

    // Verify Email
    const userRecord = dbs.cliente.prepare("SELECT verification_token FROM users WHERE id = ?").get(userId);
    await axios.post(`${API_URL}/auth/verify-email/${userRecord.verification_token}`);

    // Login
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password: "Test@123456",
    });
    const token = loginRes.data.data.token;

    console.log("✅ Token obtido");
    console.log("Tentando criar pet com token:", token.substring(0, 50) + "...\n");

    // Create Pet - com debug extra
    try {
      const petRes = await axios.post(`${API_URL}/pets`, {
        nome: "Rex Teste",
        especie: "cachorro",
        raca: "Labrador",
        nascimento: "2 anos",
        peso_kg: "30kg",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ Pet criado:", petRes.data);
    } catch (petErr) {
      console.log("\n❌ ERRO ao criar pet:");
      if (petErr.response?.data) {
        console.log("Status:", petErr.response.status);
        console.log("Dados:", JSON.stringify(petErr.response.data, null, 2));
      } else {
        console.log("Erro:", petErr.message);
      }
    }

  } catch (err) {
    console.log("❌ Erro geral:", err.message);
  }
}

test();
