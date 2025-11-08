export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.userRole; // definido pelo verifyJWT
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: "Acesso negado: privilégio insuficiente"
      });
    }
    next();
  };
}
