import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserToken,
  findUserByResetToken,
  updateUserPassword,
  updateEmailVerificationToken,
  findUserByVerificationToken,
  markEmailAsVerified,
  isEmailVerified,
  updateUserProfile,
} from "../services/user.service.js";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service.js";

import {
  isValidEmailDomain,
  getAllowedDomains,
} from "../services/email-validation.service.js";

import { dbs } from "../database/sqlite.js";
import { createCliente } from "../services/clientes.service.js";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

// Cookie do JWT (se você não usa cookie no front, pode remover)
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 24h
};

// util: busca cliente por email (escopo do owner)
function findClienteByEmail(ownerId, email) {
  return (
    dbs.cliente
      .prepare(
        `SELECT id FROM clientes WHERE owner_id = ? AND email = ? LIMIT 1`
      )
      .get(ownerId, email) || null
  );
}

// REGISTER
export async function registerController(req, res, next) {
  try {
    const { email, password, name, role = "user", owner_id = 1 } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, error: "Campos obrigatórios: name, email, password" });
    }

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.status(409).json({ success: false, error: "E-mail já cadastrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    
    // Gerar token de verificação de email
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas

    const user = await createUser({ email, name, password_hash, role, owner_id });

    // Salvar token de verificação
    await updateEmailVerificationToken(user.id, verificationToken, verificationExpires);

    // Enviar email de verificação
    try {
      const baseURL = process.env.BASE_URL || "http://localhost:8080";
      console.log(`[REGISTER] Tentando enviar email para ${email}`);
      console.log(`[REGISTER] Base URL: ${baseURL}`);
      console.log(`[REGISTER] Token de verificação: ${verificationToken.substring(0, 10)}...`);
      await sendVerificationEmail(email, verificationToken, baseURL);
      console.log(`[REGISTER] Email enviado com sucesso para ${email}`);
    } catch (emailError) {
      console.error(`[REGISTER] ❌ Erro ao enviar email para ${email}:`, emailError.message);
      console.error(`[REGISTER] Stack:`, emailError.stack);
      // Não bloqueia o registro se o email falhar
    }

    // se for tutor (user comum), garanta a ficha em "clientes" e vincule ao user_id
    if ((user.role || "user") === "user") {
      const cli = findClienteByEmail(user.owner_id, user.email);
      if (!cli) {
        await createCliente({
          ownerId: user.owner_id,
          nome: user.name,
          email: user.email,
          telefone: null,
        });
      }
      // amarra o cliente (existente ou recém-criado) ao user_id
      dbs.cliente
        .prepare(
          `UPDATE clientes SET user_id = ? WHERE owner_id = ? AND email = ?`
        )
        .run(user.id, user.owner_id, user.email);
    }

    // Não gera token JWT ainda - usuário precisa verificar email primeiro
    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso. Verifique seu email para confirmar a conta.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        owner_id: user.owner_id,
        email_verified: false,
      },
    });
  } catch (err) {
    next(err);
  }
}

// LOGIN
export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: "Informe email e password" });

    console.log(`[LOGIN] Tentando login com email: ${email}`);
    const user = await findUserByEmail(email);
    if (!user) {
      console.log(`[LOGIN] ❌ Usuário não encontrado: ${email}`);
      return res.status(401).json({ success: false, error: "Credenciais inválidas" });
    }

    console.log(`[LOGIN] ✓ Usuário encontrado: ID=${user.id}, Email_Verified=${user.email_verified}`);

    // Verificar se email foi confirmado
    if (!user.email_verified) {
      console.log(`[LOGIN] ❌ Email não verificado: ${email}`);
      return res.status(403).json({ 
        success: false, 
        error: "Por favor, verifique seu email antes de fazer login",
        code: "EMAIL_NOT_VERIFIED"
      });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log(`[LOGIN] ❌ Senha incorreta para: ${email}`);
      return res.status(401).json({ success: false, error: "Credenciais inválidas" });
    }

    console.log(`[LOGIN] ✓ Autenticação bem-sucedida para: ${email}`);
    const token = jwt.sign(
      { userId: user.id, role: user.role, ownerId: user.owner_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        owner_id: user.owner_id,
        token // <- importante para o front guardar
      }
    });
  } catch (err) {
    next(err);
  }
}

// LOGOUT
export async function logoutController(_req, res, _next) {
  return res.status(204).end();
}

// ME (requer verifyJWT)
export async function meController(req, res, next) {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        owner_id: user.owner_id,
        telefone: user.telefone,
        endereco: user.endereco,
        cidade: user.cidade,
        estado: user.estado,
        cep: user.cep,
      },
    });
  } catch (err) {
    next(err);
  }
}

// RESET DE SENHA (solicitar token)
export async function resetPasswordController(req, res, next) {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 60; // 1h
    await updateUserToken(user.id, token, expires);

    console.log(`Token gerado para ${email}: ${token}`);
    console.log(`Link de redefinição: http://localhost:8080/redefinir-senha/${token}`);

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// RESET DE SENHA (confirmar nova senha)
export async function resetPasswordConfirmController(req, res, next) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ success: false, error: "Token e nova senha são obrigatórios" });
    }

    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ success: false, error: "Token inválido ou expirado" });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.id, password_hash);

    return res.json({ success: true, message: "Senha redefinida com sucesso!" });
  } catch (err) {
    next(err);
  }
}

// VERIFICAR EMAIL
export async function verifyEmailController(req, res, next) {
  try {
    const { token } = req.params;

    console.log(`[VERIFY] Recebido token para verificação: ${token.substring(0, 20)}...`);

    if (!token) {
      console.log(`[VERIFY] ❌ Token não fornecido`);
      return res
        .status(400)
        .json({ success: false, error: "Token de verificação é obrigatório" });
    }

    console.log(`[VERIFY] Buscando usuário com token...`);
    const user = await findUserByVerificationToken(token);
    
    if (!user) {
      console.log(`[VERIFY] ❌ Usuário não encontrado com esse token ou token expirado`);
      return res.status(400).json({ 
        success: false, 
        error: "Token inválido ou expirado" 
      });
    }

    console.log(`[VERIFY] ✓ Usuário encontrado: ID=${user.id}, Email=${user.email}, Email_Verified=${user.email_verified}`);

    // Marcar email como verificado
    console.log(`[VERIFY] Marcando email como verificado para user ID ${user.id}...`);
    await markEmailAsVerified(user.id);
    console.log(`[VERIFY] ✅ Email marcado como verificado`);

    return res.json({ 
      success: true, 
      message: "Email verificado com sucesso!",
      data: {
        email: user.email
      }
    });
  } catch (err) {
    console.error(`[VERIFY] ❌ Erro ao verificar email:`, err);
    next(err);
  }
}

// REENVIAR EMAIL DE VERIFICAÇÃO
export async function resendVerificationEmailController(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email é obrigatório" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Não informar se o email existe ou não (segurança)
      return res.json({ success: true });
    }

    // Se já verificou, não precisa reenviar
    if (user.email_verified) {
      return res.status(400).json({ 
        success: false, 
        error: "Este email já foi verificado" 
      });
    }

    // Gerar novo token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas

    await updateEmailVerificationToken(user.id, verificationToken, verificationExpires);

    // Enviar email
    try {
      const baseURL = process.env.BASE_URL || "http://localhost:8080";
      console.log(`[RESEND] Tentando enviar email para ${email}`);
      console.log(`[RESEND] Novo token gerado`);
      await sendVerificationEmail(email, verificationToken, baseURL);
      console.log(`[RESEND] Email enviado com sucesso para ${email}`);
    } catch (emailError) {
      console.error(`[RESEND] ❌ Erro ao enviar email para ${email}:`, emailError.message);
      console.error(`[RESEND] Stack:`, emailError.stack);
      return res.status(500).json({ 
        success: false, 
        error: "Erro ao enviar email de verificação" 
      });
    }

    return res.json({ 
      success: true, 
      message: "Email de verificação reenviado" 
    });
  } catch (err) {
    next(err);
  }
}

// ATUALIZAR PERFIL (requer verifyJWT)
export async function updateProfileController(req, res, next) {
  try {
    const { name, telefone, endereco, cidade, estado, cep } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: "Nome é obrigatório" 
      });
    }

    const updatedUser = await updateUserProfile(req.userId, {
      name,
      telefone: telefone || null,
      endereco: endereco || null,
      cidade: cidade || null,
      estado: estado || null,
      cep: cep || null,
    });

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        error: "Usuário não encontrado" 
      });
    }

    return res.json({
      success: true,
      message: "Perfil atualizado com sucesso!",
      user: updatedUser
    });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    next(err);
  }
}
