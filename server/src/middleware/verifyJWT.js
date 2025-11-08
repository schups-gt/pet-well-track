// src/middleware/verifyJWT.js
import jwt from "jsonwebtoken";

export function verifyJWT(req, res, next) {
  const auth = req.headers.authorization;
  let token = null;

  if (auth && auth.startsWith("Bearer ")) {
    token = auth.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success:false, error:"Token ausente" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success:false, error:"Token inválido" });
    req.userId = decoded.userId;
    req.role = decoded.role || null;
    req.ownerId = decoded.ownerId || null;
    next();
  });
}
