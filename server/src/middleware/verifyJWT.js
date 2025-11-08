import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;

export function verifyJWT(req, res, next) {
  const auth = req.headers.authorization || req.cookies.token;
  if (!auth) return res.status(401).json({ error: "Token ausente" });

  try {
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role; // <- ESSENCIAL
    req.ownerId = decoded.ownerId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
