import axios from "axios";
import { dbs } from "./src/database/sqlite.js";

const API_URL = "http://localhost:3000/api";

async function testPetCreation() {
  console.log("\n🧪 TESTE DE CRIAÇÃO DE PET\n");
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
    console.log("✅ Usuário registrado:", registerRes.data);
    const userId = registerRes.data.data.id;

    // STEP 2: Verify Email (extrai token do banco e verifica)
    console.log("\n✉️  STEP 2: Verificando email...");
    const userRecord = dbs.cliente.prepare("SELECT verification_token FROM users WHERE id = ?").get(userId);
    if (!userRecord?.verification_token) {
      throw new Error("Token de verificação não encontrado no banco");
    }
    const verificationToken = userRecord.verification_token;
    console.log("Token obtido:", verificationToken.substring(0, 20) + "...");
    
    const verifyRes = await axios.post(`${API_URL}/auth/verify-email/${verificationToken}`);
    console.log("✅ Email verificado:", verifyRes.data);

    // STEP 3: Login
    console.log("\n🔑 STEP 3: Fazendo login...");
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    console.log("✅ Login bem-sucedido!");
    console.log("Token:", loginRes.data.data.token.substring(0, 50) + "...");
    const token = loginRes.data.data.token;

    // STEP 4: Create Pet
    console.log("\n🐾 STEP 4: Criando pet...");
    const petRes = await axios.post(`${API_URL}/pets`, {
      nome: "Rex Teste",
      especie: "cachorro",
      raca: "Labrador",
      idade: "2 anos",
      peso_kg: "30kg",
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Pet criado com sucesso!");
    console.log("Pet ID:", petRes.data.data?.id);
    console.log("Pet Data:", JSON.stringify(petRes.data.data, null, 2));

    // STEP 5: List Pets
    console.log("\n📋 STEP 5: Listando pets...");
    const listRes = await axios.get(`${API_URL}/pets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Pets carregados!");
    console.log("Total de pets:", listRes.data.data?.length || 0);
    console.log("Pets:", JSON.stringify(listRes.data.data, null, 2));

    console.log("\n" + "=".repeat(60));
    console.log("✅ TODOS OS TESTES PASSARAM!\n");

  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.log("❌ ERRO ENCONTRADO!\n");
    
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("URL:", error.response.config.url);
      console.log("Método:", error.response.config.method.toUpperCase());
      console.log("Dados Enviados:", error.response.config.data);
      console.log("Resposta do Servidor:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Erro:", error.message);
    }
    console.log("=" .repeat(60) + "\n");
  }
}

testPetCreation();
