export function authGuard(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ success: false, error: "Não autenticado" });
}
