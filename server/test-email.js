import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testEmail() {
  console.log("=== TESTE DE CONFIGURAÇÃO DE EMAIL ===\n");
  
  console.log("Variáveis de Ambiente:");
  console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "***" : "NÃO DEFINIDA");
  console.log("BASE_URL:", process.env.BASE_URL);
  console.log("\n");

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log("Testando conexão com servidor SMTP...");
    await transporter.verify();
    console.log("✅ Conexão SMTP verificada com sucesso!\n");

    const testEmail = process.env.EMAIL_USER;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: "Teste de Email - Pet Well Track",
      html: `
        <h2>Email de Teste</h2>
        <p>Se você recebeu este email, a configuração de email está funcionando!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    };

    console.log("Enviando email de teste para:", testEmail);
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado com sucesso!");
    console.log("Message ID:", result.messageId);
  } catch (error) {
    console.error("❌ ERRO:", error.message);
    console.error("\nDetalhes do erro:");
    console.error(error);
    
    console.log("\n=== DICAS DE RESOLUÇÃO ===");
    console.log("1. Se estiver usando Gmail:");
    console.log("   - Acesse: https://myaccount.google.com/apppasswords");
    console.log("   - Crie uma 'App Password' (não é sua senha do Gmail)");
    console.log("   - Use essa senha no .env como EMAIL_PASSWORD");
    console.log("\n2. Verifique se EMAIL_USER e EMAIL_PASSWORD estão corretos no .env");
    console.log("\n3. Se estiver fora dos EUA/BR, pode ter restrições de acesso");
    console.log("\n4. Tente desabilitar 2FA temporariamente no Gmail");
  }
}

testEmail();
