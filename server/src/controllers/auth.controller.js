import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { findUserByEmail, createUser, findUserById, updateUserToken, findUserByResetToken, updateUserPassword } from "../services/user.service.js";
const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';

export async function registerController(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: "Campos obrigatórios: name, email, password" });
    }

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.status(409).json({ success: false, error: "E-mail já cadastrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, name, password_hash });

    // cria sessão
    req.session.userId = user.id;

    return res.status(201).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}


export async function resetPasswordController(req, res, next) {
  try {
    const { email } = req.body;
    console.log("Redefinição de senha solicitada para:", email);

    const user = await findUserByEmail(email);
    if (!user) {
      console.log("Nenhum usuário com esse email (ok).");
      return res.json({ success: true });
    }

    // Gera token temporário
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 60; // 1 hora

    // Salva token no usuário
    await updateUserToken(user.id, token, expires);

    // Imprime token e link no console
    console.log(`Token gerado para ${email}: ${token}`);
    console.log(`Link de redefinição: http://localhost:8080/redefinir-senha/${token}`);

    return res.json({ success: true });
  } catch (err) {
    console.error("Erro em resetPasswordController:", err);
    next(err);
  }
}

export async function resetPasswordConfirmController(req, res, next) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ success: false, error: "Token e nova senha são obrigatórios" });

    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ success: false, error: "Token inválido ou expirado" });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.id, password_hash);

    console.log(`Senha redefinida com sucesso para ${user.email}`);
    return res.json({ success: true, message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro em resetPasswordConfirmController:", err);
    next(err);
  }
}


export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Informe email e password" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: "Credenciais inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, error: "Credenciais inválidas" });
    }

    req.session.userId = user.id;

    return res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}

export async function logoutController(req, res, next) {
  try {
    req.session.destroy(() => {});
    res.clearCookie("connect.sid");
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function meController(req, res, next) {
  try {
    const user = await findUserById(req.session.userId);
    return res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}

//Para quando utilizar banco de dados
/*
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email e senha são obrigatórios' });

  const user = await userService.findByEmail(email); // adapte
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' });

  const payload = { sub: user.id, roles: user.roles || [] };
  const token = jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 // 1h, ou ajuste
  });
   const { password: _pwd, ...userSafe } = user;
  res.json({ user: userSafe });
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Desconectado' });
}*/