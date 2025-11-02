// server/src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
// import nodemailer from "nodemailer"; // deixe comentado se não for usar agora

import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserToken,
  findUserByResetToken,
  updateUserPassword
} from "../services/user.service.js";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

// REGISTER -> cria usuário e já retorna JWT
export async function registerController(req, res, next) {
  try {
    const { email, password, name } = req.body;

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
    const user = await createUser({ email, name, password_hash });

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: EXPIRES_IN });

    return res.status(201).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    next(err);
  }
}

// LOGIN -> valida credenciais e retorna JWT
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

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: EXPIRES_IN });

    return res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    next(err);
  }
}

// LOGOUT -> com JWT stateless basta o front descartar o token
export async function logoutController(_req, res, _next) {
  return res.status(204).end();
}

// ME -> requer verifyJWT para preencher req.userId
export async function meController(req, res, next) {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }
    return res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}

// RESET DE SENHA (fluxo por token próprio, independente do JWT)
export async function resetPasswordController(req, res, next) {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 60; // 1 hora
    await updateUserToken(user.id, token, expires);

    console.log(`Token gerado para ${email}: ${token}`);
    console.log(`Link de redefinição: http://localhost:8080/redefinir-senha/${token}`);

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

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