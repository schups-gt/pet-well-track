import jwt from "jsonwebtoken";

export function verifyJWT(req, res, next) {
  const auth = req.headers.authorization; // "Bearer <token>"
  if (!auth) return res.status(401).json({ success: false, error: "Token ausente" });

  const [, token] = auth.split(" ");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, error: "Token inválido" });
    req.userId = decoded.userId;
    next();
  });
}
