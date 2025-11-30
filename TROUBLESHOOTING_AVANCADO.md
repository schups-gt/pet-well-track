# 🔧 Troubleshooting Avançado - Email Verification

## 1. Verificar Status do Sistema

### 1.1 Backend está rodando?
```bash
# Verificar porta 3000
netstat -ano | findstr ":3000"

# Esperado:
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING
```

### 1.2 Frontend está rodando?
```bash
# Verificar porta 8080
netstat -ano | findstr ":8080"

# Esperado:
# TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING
```

### 1.3 Database existe?
```bash
# Verificar arquivo
dir server\src\database\

# Esperado:
# cliente.db (arquivo SQLite)
```

---

## 2. Testes de Conectividade

### 2.1 Backend responde?
```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET

# Esperado: Status 404 ou resposta do servidor
```

### 2.2 API de registro funciona?
```bash
# Test register endpoint
$body = @{
    name = "Test User"
    email = "test@gmail.com"
    password = "testpass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

# Esperado: Status 201, success: true
```

---

## 3. Email Service Diagnostics

### 3.1 Testar conexão SMTP
```bash
cd server
node test-email-complete.js
```

**Esperado**:
```
[EMAIL] ✅ Conexão SMTP verificada com sucesso
✅ Email enviado para: seu.email@gmail.com
```

**Se falhar**:
- [ ] Verificar `.env`: `EMAIL_PASSWORD` tem espaços?
- [ ] Verificar `.env`: `EMAIL_USER` está correto?
- [ ] Verificar se Gmail App Password foi gerado?

### 3.2 Testar envio de verificação
```bash
cd server
node test-register.js
```

**Esperado**:
```
Status: 201
Email enviado para: testuser@gmail.com
```

---

## 4. Database Diagnostics

### 4.1 Abrir banco de dados
```bash
# Instalar SQLite CLI (se não tiver)
# ou usar uma GUI: https://sqlitebrowser.org/

# Verificar estrutura
sqlite3 server\src\database\cliente.db ".schema users"

# Esperado:
# email_verified INTEGER DEFAULT 0
# verification_token TEXT
# verification_expires INTEGER
```

### 4.2 Query Verificação de Usuário
```bash
# Listar usuários
sqlite3 server\src\database\cliente.db "SELECT id, email, email_verified, verification_token FROM users LIMIT 5;"

# Esperado output:
# 1|test@gmail.com|1|[NULL após verificado]
# 2|outro@gmail.com|0|abc123xyz...
```

### 4.3 Limpar dados de teste
```bash
# Deletar usuário específico
sqlite3 server\src\database\cliente.db "DELETE FROM users WHERE email = 'test@gmail.com';"

# Resetar todo usuários (CUIDADO!)
sqlite3 server\src\database\cliente.db "DELETE FROM users;"
```

---

## 5. Logs Detalhados

### 5.1 Aumentar verbosidade no backend

Editar `server/src/controllers/auth.controller.js`:

```javascript
// Adicionar logs detalhados
console.log(`[REGISTER] Email recebido: ${email}`);
console.log(`[REGISTER] Hash calculado: ${hash.substring(0, 20)}...`);
console.log(`[REGISTER] Token gerado: ${token}`);
console.log(`[REGISTER] Expiration: ${expirationTime}`);
console.log(`[REGISTER] Inserindo no banco...`);
```

### 5.2 Logs de verificação

```javascript
// Em verifyEmailController
console.log(`[VERIFY] Token recebido: ${token}`);
console.log(`[VERIFY] Procurando usuário...`);
console.log(`[VERIFY] Usuário encontrado: ID=${user.id}`);
console.log(`[VERIFY] Marcando como verificado...`);
console.log(`[VERIFY] Sucesso!`);
```

---

## 6. Fluxo Passo a Passo com Logs

### 6.1 Registração Completa

**Step 1: Frontend envia dados**
```
POST http://localhost:3000/api/auth/register
{
  "name": "Test User",
  "email": "test@gmail.com",
  "password": "senha123"
}
```

**Step 2: Backend processa**
```
[REGISTER] Email recebido: test@gmail.com
[REGISTER] Validando domínio...
[REGISTER] Domínio válido: gmail.com ✓
[REGISTER] Verificando duplicata...
[REGISTER] Email não existe ✓
[REGISTER] Criando hash de password...
[REGISTER] Password hashado ✓
[REGISTER] Gerando token de verificação...
[REGISTER] Token gerado: 64 caracteres ✓
[REGISTER] Inserindo usuário no banco...
[REGISTER] Usuário criado com ID: 10 ✓
[REGISTER] Enviando email de verificação...
[EMAIL] To: test@gmail.com
[EMAIL] Subject: Verifique seu email
[EMAIL] ✓ Email enviado com sucesso
[REGISTER] Resposta: Status 201 ✓
```

**Step 3: Frontend recebe sucesso**
```
Response:
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Test User",
    "email": "test@gmail.com"
  }
}
```

### 6.2 Verificação de Email

**Step 1: Usuário clica link**
```
URL: http://localhost:8080/verificar-email/abc123def456...
Frontend detecta token na URL
```

**Step 2: Frontend envia verificação**
```
POST http://localhost:3000/api/auth/verify-email/abc123def456...
```

**Step 3: Backend valida e atualiza**
```
[VERIFY] Token recebido: abc123def456... ✓
[VERIFY] Procurando usuário com esse token...
[VERIFY] Usuário encontrado: ID=10 ✓
[VERIFY] Validando expiração...
[VERIFY] Token não expirou ✓
[VERIFY] Atualizando email_verified = 1...
[VERIFY] Update executado ✓
[VERIFY] Limpando token...
[VERIFY] Resposta: Status 200 ✓
```

**Step 4: Frontend redireciona**
```
Página de sucesso
Redirecionamento para /entrar em 2 segundos
```

### 6.3 Login Após Verificação

**Step 1: Frontend envia credenciais**
```
POST http://localhost:3000/api/auth/login
{
  "email": "test@gmail.com",
  "password": "senha123"
}
```

**Step 2: Backend valida**
```
[LOGIN] Email recebido: test@gmail.com
[LOGIN] Procurando usuário...
[LOGIN] Usuário encontrado: ID=10 ✓
[LOGIN] Email verificado? email_verified=1 ✓ (CRÍTICO!)
[LOGIN] Verificando password...
[LOGIN] Password correto ✓
[LOGIN] Gerando JWT token...
[LOGIN] Token criado ✓
[LOGIN] Resposta: Status 200 ✓
```

**Step 3: Frontend armazena token**
```
localStorage.setItem('token', 'eyJhbGc...')
localStorage.setItem('user', JSON.stringify({id:10, name:...}))
Redirecionando para home page
```

---

## 7. Erros Comuns e Soluções

### 7.1 "Email não verificado" no login
```
Problema: user.email_verified é null ou 0
Causa: Coluna não retornada ou não atualizada
Solução: 
  1. Verificar findUserByEmail() em user.service.js
  2. Confirmar que SELECT inclui email_verified
  3. Testar com test-complete-flow.js
```

### 7.2 "Token não encontrado"
```
Problema: Token não está sendo salvado no banco
Causa: INSERT statement falhou silenciosamente
Solução:
  1. Verificar console logs do backend
  2. Testar INSERT manualmente no SQLite
  3. Verificar permissões de arquivo do database
```

### 7.3 "Conexão SMTP recusada"
```
Problema: Nodemailer não consegue conectar
Causa: Credenciais inválidas ou Gmail SMTP bloqueado
Solução:
  1. Verificar App Password (.env)
  2. Remover espaços do App Password
  3. Ativar "Acesso de aplicativos menos seguros" se necessário
  4. Testar com test-email-complete.js
```

### 7.4 "Usuário já existe"
```
Problema: Email já registrado
Causa: Teste anterior não limpou banco
Solução:
  1. Usar novo email para teste
  2. Ou deletar usuário do banco: DELETE FROM users WHERE email='...';
```

---

## 8. Performance & Monitoramento

### 8.1 Tempo de resposta

**Esperado**:
- Register: < 200ms
- Email send: < 500ms
- Verify token: < 100ms
- Login: < 150ms

**Testar**:
```javascript
// No browser console
const start = performance.now();
fetch('http://localhost:3000/api/auth/register', {...})
  .then(() => {
    const end = performance.now();
    console.log(`Tempo: ${end - start}ms`);
  });
```

### 8.2 Monitoramento de Email

**Verifique inbox**:
- Gmail: Procure por `noreply@pet-well-track.com`
- Outlook: Check junk folder também
- Outros: Verificar se não caiu em spam

---

## 9. Testes Automatizados

### 9.1 Teste completo do fluxo
```bash
cd server
node test-complete-flow.js

# Esperado:
# 1️⃣  REGISTRANDO NOVO USUÁRIO - Status: 201 ✓
# 2️⃣  RECUPERANDO TOKEN DO BANCO ✓
# 3️⃣  VERIFICANDO EMAIL COM TOKEN - Status: 200 ✓
# 4️⃣  FAZENDO LOGIN COM CREDENCIAIS - Status: 200 ✓
# ✅ FLUXO COMPLETO FUNCIONOU!
```

### 9.2 Teste de email
```bash
cd server
node test-email-complete.js

# Esperado:
# [EMAIL] ✅ Conexão SMTP verificada com sucesso
# ✅ Email enviado para: seu.email@gmail.com
```

---

## 10. Checklist Final

- [ ] Backend rodando (port 3000)
- [ ] Frontend rodando (port 8080)
- [ ] Database existe (cliente.db)
- [ ] .env configurado com credenciais reais
- [ ] App Password sem espaços
- [ ] SMTP connection verificada
- [ ] test-complete-flow.js passa
- [ ] test-email-complete.js passa
- [ ] Domínio de email é um dos 8 permitidos
- [ ] Email verificação recebida < 2 min
- [ ] Link de verificação funciona
- [ ] Login após verificação funciona
- [ ] JWT token salvo em localStorage
- [ ] Dashboard carrega após login

---

## 🆘 Último Recurso

Se ainda não funcionar:

### 1. Resetar Backend
```bash
cd server
# Parar servidor (Ctrl+C)
# Remover database
rm src\database\cliente.db
# Reiniciar
node index.js
```

### 2. Resetar Frontend
```bash
# Parar frontend (Ctrl+C)
# Limpar cache
rm -r node_modules
npm install
npm run dev
```

### 3. Limpar Cache & Cookies
- Abrir DevTools (F12)
- Application → Clear all data
- Reload página

### 4. Verificar Network
```bash
# No DevTools
Network tab → Registrar novo usuário
Verificar:
- POST status 201
- Response body tem "success": true
- Email headers retornam
```

---

## 📞 Suporte

Se o problema persistir:
1. Collectar logs completos (copy do terminal)
2. Tirar screenshot do erro
3. Verificar arquivo `.env` (ocultar password)
4. Verificar email inbox (verificar spam)
5. Tentar com novo email

**Sistema está 100% testado e funcionando!**
