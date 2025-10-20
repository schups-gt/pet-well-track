import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { findUserByEmail, createUser, findUserById, updateUserToken } from "../services/user.service.js";

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
  console.log("Reset de senha solicitado para:", req.body.email);
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    // Não vaza se o email existe ou não
    if (!user) return res.json({ success: true });

    // Gera token temporário
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 60; // 1 hora

    // Salva token no usuário
    await updateUserToken(user.id, token, expires);

    // Apenas mostra o link no console (não envia email de verdade)
    const resetLink = `http://localhost:8080/redefinir-senha/${token}`;
    console.log(`Link de redefinição para ${email}: ${resetLink}`);

    return res.json({ success: true });
  } catch (err) {
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
