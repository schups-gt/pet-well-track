import nodemailer from "nodemailer";

// Configuração do transporter (você deve configurar as variáveis de ambiente)
console.log(`[EMAIL] Inicializando serviço de email com:`);
console.log(`[EMAIL] - Service: ${process.env.EMAIL_SERVICE || "gmail"}`);
console.log(`[EMAIL] - User: ${process.env.EMAIL_USER || "NÃO DEFINIDO"}`);
console.log(`[EMAIL] - Password: ${process.env.EMAIL_PASSWORD ? "***" : "NÃO DEFINIDA"}`);

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verificar conexão ao iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error(`[EMAIL] ❌ Erro na conexão SMTP:`, error.message);
  } else {
    console.log(`[EMAIL] ✅ Conexão SMTP verificada com sucesso`);
  }
});

/**
 * Envia email de verificação de email
 * @param {string} email - Email do destinatário
 * @param {string} verificationToken - Token de verificação
 * @param {string} baseURL - URL base da aplicação (ex: http://localhost:8080)
 */
export async function sendVerificationEmail(email, verificationToken, baseURL = "http://localhost:8080") {
  const verificationLink = `${baseURL}/verificar-email/${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || "noreply@petwelltrack.com",
    to: email,
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
    console.log(`[EMAIL] Enviando email de verificação para: ${email}`);
    console.log(`[EMAIL] From: ${mailOptions.from}`);
    console.log(`[EMAIL] Subject: ${mailOptions.subject}`);
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`[EMAIL] ✅ Email de verificação enviado com sucesso para ${email}`);
    console.log(`[EMAIL] Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL] ❌ Erro ao enviar email para ${email}:`);
    console.error(`[EMAIL] - Mensagem: ${error.message}`);
    console.error(`[EMAIL] - Code: ${error.code}`);
    console.error(`[EMAIL] - Resposta: ${error.response}`);
    throw error;
  }
}

/**
 * Envia email de redefinição de senha
 * @param {string} email - Email do destinatário
 * @param {string} resetToken - Token de redefinição
 * @param {string} baseURL - URL base da aplicação
 */
export async function sendPasswordResetEmail(email, resetToken, baseURL = "http://localhost:8080") {
  const resetLink = `${baseURL}/redefinir-senha/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || "noreply@petwelltrack.com",
    to: email,
    subject: "Redefinir Senha - Pet Well Track",
    html: `
      <h2>Redefinir Senha</h2>
      <p>Você solicitou para redefinir sua senha. Clique no link abaixo:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Redefinir Senha
      </a>
      <p style="margin-top: 20px; color: #666;">Ou copie e cole este link no seu navegador:</p>
      <p style="word-break: break-all; color: #999;">${resetLink}</p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">Este link expira em 1 hora.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de redefinição de senha enviado para ${email}`);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar email de redefinição para ${email}:`, error);
    throw error;
  }
}
