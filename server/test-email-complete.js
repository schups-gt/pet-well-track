import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function testCompleteFlow() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║     TESTE COMPLETO: REGISTRO E ENVIO DE EMAIL                 ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  // 1. Verificar variáveis de ambiente
  console.log("📋 VERIFICANDO VARIÁVEIS DE AMBIENTE:");
  console.log(`  ✓ EMAIL_SERVICE: ${process.env.EMAIL_SERVICE || "❌ NÃO DEFINIDA"}`);
  console.log(`  ✓ EMAIL_USER: ${process.env.EMAIL_USER || "❌ NÃO DEFINIDA"}`);
  console.log(`  ✓ EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? "✅ DEFINIDA" : "❌ NÃO DEFINIDA"}`);
  console.log(`  ✓ BASE_URL: ${process.env.BASE_URL || "❌ NÃO DEFINIDA"}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log("\n❌ ERRO: EMAIL_USER ou EMAIL_PASSWORD não estão definidos no .env\n");
    return;
  }

  // 2. Criar transporter
  console.log("\n🔧 CRIANDO TRANSPORTER NODEMAILER:");
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 3. Verificar conexão
  console.log("\n🔌 TESTANDO CONEXÃO SMTP:");
  try {
    await transporter.verify();
    console.log("  ✅ Conexão SMTP verificada com sucesso!\n");
  } catch (error) {
    console.log(`  ❌ ERRO NA CONEXÃO SMTP: ${error.message}\n`);
    console.log("  Causas possíveis:");
    console.log("  1. EMAIL_USER ou EMAIL_PASSWORD incorretos");
    console.log("  2. Sem conexão com a internet");
    console.log("  3. Servidor SMTP bloqueado pelo firewall\n");
    return;
  }

  // 4. Simular envio de email de verificação
  console.log("📧 SIMULANDO ENVIO DE EMAIL DE VERIFICAÇÃO:");
  
  const testEmail = process.env.EMAIL_USER; // Enviar para nós mesmos
  const fakeToken = "abc123def456ghi789jkl000mnopqrstuvwxyz123456";
  const verificationLink = `${process.env.BASE_URL || "http://localhost:8080"}/verificar-email/${fakeToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: testEmail,
    subject: "Verifique seu email - Pet Well Track",
    html: `
      <h2>Bem-vindo ao Pet Well Track!</h2>
      <p>Para confirmar seu cadastro, clique no link abaixo:</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Verificar Email
      </a>
      <p style="margin-top: 20px; color: #666;">Ou copie e cole este link no seu navegador:</p>
      <p style="word-break: break-all; color: #999;">${verificationLink}</p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">Este link expira em 24 horas.</p>
    `,
  };

  try {
    console.log(`  De: ${mailOptions.from}`);
    console.log(`  Para: ${mailOptions.to}`);
    console.log(`  Assunto: ${mailOptions.subject}`);
    console.log(`  Link: ${verificationLink}\n`);

    const result = await transporter.sendMail(mailOptions);
    
    console.log("  ✅ EMAIL ENVIADO COM SUCESSO!");
    console.log(`  Message ID: ${result.messageId}\n`);

    console.log("╔════════════════════════════════════════════════════════════════╗");
    console.log("║           ✅ TUDO FUNCIONANDO CORRETAMENTE!                    ║");
    console.log("╚════════════════════════════════════════════════════════════════╝\n");

    console.log("🚀 Próximos passos:");
    console.log("  1. Reinicie o servidor: npm run dev");
    console.log("  2. Vá para: http://localhost:8080/registrar");
    console.log("  3. Registre com: seu_email@gmail.com");
    console.log("  4. Verifique seu inbox para o email de confirmação\n");

  } catch (error) {
    console.log("  ❌ ERRO AO ENVIAR EMAIL:");
    console.log(`  Mensagem: ${error.message}`);
    console.log(`  Code: ${error.code}`);
    if (error.response) {
      console.log(`  Response: ${error.response}\n`);
    }

    console.log("  Sugestões:");
    console.log("  1. Verifique se a App Password do Gmail está correta");
    console.log("  2. Verifique se 2FA está ativado no Gmail");
    console.log("  3. Tente desabilitar antivírus/firewall temporariamente");
    console.log("  4. Verifique se a senha NÃO tem espaços\n");
  }
}

testCompleteFlow();
