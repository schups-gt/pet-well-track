async function testCompleteFlow() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║     TESTE COMPLETO: REGISTRO → VERIFICAÇÃO → LOGIN              ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  const testEmail = "testuser" + Math.random().toString(36).substring(7) + "@gmail.com";
  const testPassword = "senha123";
  const testName = "Test User";

  // 1. REGISTRAR
  console.log("1️⃣  REGISTRANDO NOVO USUÁRIO");
  console.log(`   Email: ${testEmail}`);
  console.log(`   Nome: ${testName}\n`);

  try {
    const registerRes = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword
      })
    });

    const registerData = await registerRes.json();
    console.log(`   Status: ${registerRes.status}`);

    if (!registerData.success) {
      console.log(`   ❌ Falha: ${registerData.error}\n`);
      return;
    }

    const userId = registerData.data.id;
    console.log(`   ✅ Usuário registrado! ID: ${userId}\n`);

    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. BUSCAR TOKEN NO BANCO (usando better-sqlite3)
    console.log("2️⃣  RECUPERANDO TOKEN DE VERIFICAÇÃO DO BANCO\n");
    
    const Database = (await import("better-sqlite3")).default;
    const db = new Database("src/database/cliente.db");
    const user = db.prepare(
      "SELECT verification_token, verification_expires, email_verified FROM users WHERE email = ?"
    ).get(testEmail);

    db.close();

    if (!user) {
      console.log("   ❌ Usuário não encontrado no banco!\n");
      return;
    }

    console.log(`   Token: ${user.verification_token.substring(0, 20)}...`);
    console.log(`   Expires: ${new Date(user.verification_expires).toISOString()}`);
    console.log(`   Email Verified: ${user.email_verified}\n`);

    if (!user.verification_token) {
      console.log("   ❌ Token de verificação é nulo!\n");
      return;
    }

    // 3. VERIFICAR EMAIL
    console.log("3️⃣  VERIFICANDO EMAIL COM TOKEN\n");

    const verifyRes = await fetch(`http://localhost:3000/api/auth/verify-email/${user.verification_token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const verifyData = await verifyRes.json();
    console.log(`   Status: ${verifyRes.status}`);
    
    if (!verifyData.success) {
      console.log(`   ❌ Falha: ${verifyData.error}\n`);
      return;
    }

    console.log(`   ✅ Email verificado com sucesso!\n`);

    // 4. FAZER LOGIN
    console.log("4️⃣  FAZENDO LOGIN COM CREDENCIAIS\n");

    const loginRes = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const loginData = await loginRes.json();
    console.log(`   Status: ${loginRes.status}`);
    
    if (!loginData.success) {
      console.log(`   ❌ Falha: ${loginData.error}\n`);
      return;
    }

    console.log(`   ✅ Login bem-sucedido!\n`);

    console.log("╔════════════════════════════════════════════════════════════════╗");
    console.log("║           ✅ FLUXO COMPLETO FUNCIONOU!                        ║");
    console.log("╚════════════════════════════════════════════════════════════════╝\n");

  } catch (error) {
    console.log("   ❌ Erro:", error.message, "\n");
  }
}

testCompleteFlow();
