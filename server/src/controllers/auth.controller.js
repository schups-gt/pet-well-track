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
} from "../services/user.service.js";

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
    const user = await createUser({ email, name, password_hash, role, owner_id });

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

    const token = jwt.sign(
      { userId: user.id, role: user.role, ownerId: user.owner_id },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    res.cookie("token", token, COOKIE_OPTIONS);
    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        owner_id: user.owner_id,
        token, // útil para Postman/front
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

    const token = jwt.sign(
      { userId: user.id, role: user.role, ownerId: user.owner_id },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    res.cookie("token", token, COOKIE_OPTIONS);
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        owner_id: user.owner_id,
        token, // devolve também no login
      },
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
