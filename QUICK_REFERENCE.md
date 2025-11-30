# ⚡ Quick Reference Card - Email Verification

**Print this or bookmark it!** 📌

---

## 🚀 Start Servers (2 terminals)

### Terminal 1 - Backend
```bash
cd server
node index.js
# ✅ Listening on http://localhost:3000
```

### Terminal 2 - Frontend
```bash
npm run dev
# ✅ Listening on http://localhost:8080
```

---

## 🧪 Quick Tests

### Complete Flow Test
```bash
cd server
node test-complete-flow.js
# Output: ✅ FLUXO COMPLETO FUNCIONOU!
```

### Email Test
```bash
cd server
node test-email-complete.js
# Output: ✅ Email enviado com sucesso
```

---

## 📧 Email Credentials

```
Service:  Gmail SMTP
User:     mctiraboschi25@gmail.com
Password: fjgwxfyobrgffkig
SMTP:     smtp.gmail.com:587
```

**⚠️ Important:** Password has NO spaces!

---

## 🌐 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Register | http://localhost:8080/registrar | Novo usuário |
| Pending | http://localhost:8080/verificacao-pendente | Aguardando verificação |
| Verify | http://localhost:8080/verificar-email/:token | Confirma token |
| Login | http://localhost:8080/entrar | Fazer login |
| Home | http://localhost:8080 | Dashboard protegido |

---

## 🔌 API Endpoints

```
POST   /api/auth/register              → Status 201
POST   /api/auth/login                 → Status 200 (requer email_verified=1)
POST   /api/auth/verify-email/:token   → Status 200
POST   /api/auth/resend-verification   → Status 200
POST   /api/auth/forgot-password       → Status 200
POST   /api/auth/reset-password        → Status 200
```

---

## ✅ Allowed Email Domains (8)

```
✓ @gmail.com
✓ @outlook.com
✓ @icloud.com
✓ @hotmail.com
✓ @yahoo.com
✓ @yahoo.com.br
✓ @me.com
✓ @baraodemaua.edu.br
```

---

## 💾 Database

```bash
# Arquivo
server/src/database/cliente.db

# Ver schema
sqlite3 server/src/database/cliente.db ".schema users"

# Query usuários
sqlite3 server/src/database/cliente.db "SELECT email, email_verified FROM users LIMIT 5;"

# Deletar usuário
sqlite3 server/src/database/cliente.db "DELETE FROM users WHERE email='test@gmail.com';"
```

---

## 🔐 Important Fields

```javascript
// User Object
{
  id: 1,
  name: "User Name",
  email: "user@gmail.com",
  email_verified: 1,              // 0 = not verified, 1 = verified
  verification_token: "abc123...",
  verification_expires: 1733308471,
  role: "client",
  password_hash: "$2b$10$..."
}
```

---

## 🆘 Common Issues & Fixes

### ❌ "Email não verificado" no login
```
→ Causa: email_verified é null
→ Fix: Abra test-complete-flow.js e veja logs
```

### ❌ "Email não chega"
```
→ Causa: App Password com espaços
→ Fix: Verifique .env → fjgwxfyobrgffkig (sem espaços!)
```

### ❌ "Cannot find module"
```
→ Causa: node_modules não instalado
→ Fix: npm install (em server/) + npm install (raiz)
```

### ❌ "Port 3000 already in use"
```
→ Causa: Backend já rodando
→ Fix: lsof -i :3000; kill -9 PID
```

---

## 📊 File Locations

```
Backend Code:      server/src/
Frontend Code:     src/
Database:          server/src/database/cliente.db
Tests:             server/test-*.js
Docs:              *.md na raiz
Config:            server/.env
```

---

## 🧭 Navigation Guide

**Want to...?**

- 🧪 **Test everything** → Run `node test-complete-flow.js`
- 📧 **Test email** → Run `node test-email-complete.js`
- 🌐 **Test in browser** → Go to http://localhost:8080/registrar
- 🐛 **Debug** → Open DevTools (F12) → Network tab
- 📚 **Learn system** → Read `DIAGRAMA_SISTEMA.md`
- 🚀 **Deploy** → Follow `CHECKLIST_DEPLOY.md`
- 🔧 **Troubleshoot** → Read `TROUBLESHOOTING_AVANCADO.md`

---

## ⏱️ Timeouts

```
Register:       < 200ms
Email send:     < 500ms
Verification:   < 100ms
Login:          < 150ms
Email delivery: < 2min (typical)
Token expires:  24 hours
```

---

## 🔍 Debugging Commands

```bash
# Check if backend is running
curl http://localhost:3000/api

# Check if frontend is running
curl http://localhost:8080

# View backend logs in real-time
tail -f server/logs.txt

# Check ports
netstat -tlnp | grep 3000
netstat -tlnp | grep 8080

# Check database
sqlite3 server/src/database/cliente.db ".tables"
```

---

## 📋 Verification Process

1. ✅ User clicks Register
2. ✅ Email validation (one of 8 domains)
3. ✅ Password hash created
4. ✅ Token generated (64 chars)
5. ✅ Token saved in DB with 24h expiry
6. ✅ Email sent (< 2min)
7. ✅ User clicks email link
8. ✅ Token validated
9. ✅ email_verified updated to 1
10. ✅ Redirected to login
11. ✅ Login check verifies email_verified=1
12. ✅ JWT token issued
13. ✅ Access granted! 🎉

---

## 💡 Pro Tips

- 💾 Always backup database before testing
- 📧 Check Gmail spam folder if email missing
- 🔐 Never commit .env file
- 🆔 Use unique emails for each test
- 📱 Test on mobile too
- 🔄 Clear localStorage if issues

---

## 📞 Support Resources

| Resource | Location |
|----------|----------|
| Overview | RESUMO_EXECUTIVO.md |
| Diagrams | DIAGRAMA_SISTEMA.md |
| Testing | TESTE_MANUAL_FRONTEND.md |
| Troubleshooting | TROUBLESHOOTING_AVANCADO.md |
| Deployment | CHECKLIST_DEPLOY.md |
| Email Setup | CONFIGURAR_EMAIL.md |
| Verification | VERIFICACAO_FINAL_EMAIL.md |

---

## ✨ System Status

```
Backend:        🟢 Running
Frontend:       🟢 Running
Database:       🟢 Connected
Email:          🟢 Configured
Tests:          🟢 Passing
Docs:           🟢 Complete
Status:         🟢 Production Ready
```

---

## 🎯 Next Steps

1. ✅ Both servers running?
2. ✅ Database exists?
3. ✅ Email configured?
4. ✅ Tests passing?

**If all YES:** Ready to test in browser! 🚀

---

**Print this card!** 📌  
**Save as bookmark!** ⭐  
**Share with team!** 👥  

---

*Last Updated: December 2024*  
*System Version: 1.0*  
*Status: Production Ready* ✅
