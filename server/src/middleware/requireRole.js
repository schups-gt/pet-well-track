export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.role) return res.status(403).json({ success:false, error:"Perfil não identificado" });
    if (!roles.includes(req.role)) return res.status(403).json({ success:false, error:"Sem permissão" });
    next();
  };
}
