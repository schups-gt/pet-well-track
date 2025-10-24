import crypto from "crypto";
import bcrypt from "bcryptjs";
import { users, findUserByEmail } from "./registerController.js"; // importa usuários e função auxiliar

// tokens temporários na memória
const resetTokens = {};

export const generateResetToken = (email) => {
  const token = crypto.randomBytes(32).toString("hex");
  resetTokens[token] = email;
  return token;
};

export const resetPasswordConfirmController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Token e nova senha são obrigatórios" });

    const email = resetTokens[token];
    if (!email)
      return res.status(400).json({ message: "Token inválido ou expirado" });

    const user = findUserByEmail(email);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    delete resetTokens[token];

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const user = await findUserByResetToken(token);
if (!user) {
  return res.status(400).json({ success: false, error: "Token inválido ou expirado" });
}