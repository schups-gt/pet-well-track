# 🧪 Teste Manual - Email Verification Frontend

## Pré-requisitos
- ✅ Backend rodando em `http://localhost:3000`
- ✅ Frontend rodando em `http://localhost:8080`
- ✅ Email configurado (`mctiraboschi25@gmail.com`)

---

## 📝 Step-by-Step

### 1️⃣ Abrir Página de Registro
**URL:** `http://localhost:8080/registrar`

```
Você deve ver:
- Campo "Nome Completo"
- Campo "Email"  
- Campo "Senha"
- Campo "Confirmar Senha"
- Botão "Registrar"
- Link "Já tem conta? Entrar"
```

---

### 2️⃣ Preencher Formulário

**Dados de teste**:
```
Nome:              Teste User
Email:             seuemail@gmail.com  (use UM DOS 8 DOMINIOS)
Senha:             Senha123!
Confirmar Senha:   Senha123!
```

**Os 8 domínios permitidos**:
- gmail.com
- outlook.com
- icloud.com
- hotmail.com
- yahoo.com
- yahoo.com.br
- me.com
- baraodemaua.edu.br

**Validação em Tempo Real**:
- ❌ Se usar outro domínio → botão fica desabilitado
- ✅ Se usar um dos 8 dominios → botão habilitado

---

### 3️⃣ Clicar "Registrar"

**Esperado**:
```
Redirecionamento para: /verificacao-pendente
```

**Página que aparece**:
```
┌─────────────────────────────────────────────┐
│  ⏳ VERIFICAÇÃO PENDENTE                    │
│                                             │
│  Enviamos um email para:                   │
│  seuemail@gmail.com                        │
│                                             │
│  Clique no link dentro do email para        │
│  completar seu registro.                    │
│                                             │
│  [Reenviar email]                           │
│  [Já verificou? Entrar]                     │
└─────────────────────────────────────────────┘
```

---

### 4️⃣ Abrir Email de Verificação

**Onde procurar**:
- Gmail: pasta "Principal" ou "Promotions"
- Outlook: "Inbox"
- Outros: check inbox

**Email esperado**:
```
De:       noreply@pet-well-track.com
Assunto:  Verifique seu email - Pet Well Track
Corpo:    
  Clique no link abaixo para verificar seu email:
  
  http://localhost:8080/verificar-email/TOKEN_AQUI
  
  Este link expira em 24 horas.
```

---

### 5️⃣ Clicar no Link de Verificação

**O que acontece**:
1. Frontend detecta o token na URL
2. Envia POST para `/api/auth/verify-email/TOKEN`
3. Backend valida e marca email como verificado
4. Página mostra sucesso

**Página de Sucesso**:
```
┌─────────────────────────────────────────────┐
│  ✅ EMAIL VERIFICADO!                      │
│                                             │
│  Seu email foi verificado com sucesso.      │
│  Você será redirecionado em 3 segundos...   │
│                                             │
│  [Ir para login agora]                      │
└─────────────────────────────────────────────┘
```

**Redirecionamento**: Após 2-3 segundos → `/entrar`

---

### 6️⃣ Fazer Login

**URL**: `http://localhost:8080/entrar`

**Dados**:
```
Email:   seuemail@gmail.com  (mesmo que registrou)
Senha:   Senha123!
```

**Esperado**:
- ✅ Login bem-sucedido
- ✅ JWT token salvo em `localStorage`
- ✅ Redirecionamento para `/` (home page)

**Se falhar**:
- ❌ "Email não verificado" → Email não foi marcado como verificado (verificar logs)
- ❌ "Senha incorreta" → Password mismatch
- ❌ "Usuário não encontrado" → Email não registrado

---

## 🔍 Debugging

### Console do Browser (F12)

**Abra DevTools e procure por**:

```javascript
// Network tab
POST http://localhost:3000/api/auth/register    → Status 201
POST http://localhost:3000/api/auth/verify-email/TOKEN → Status 200
POST http://localhost:3000/api/auth/login       → Status 200

// Storage → LocalStorage
localStorage.getItem('token')  // Deve ter JWT após login
localStorage.getItem('user')   // Deve ter dados do usuário
```

### Logs do Backend

**Abra terminal onde backend está rodando**:

```
[REGISTER] Registrando novo usuário: seuemail@gmail.com
[REGISTER] ✓ Usuário criado com ID: 10
[REGISTER] ✓ Email enviado

[VERIFY] Verificando token: abc123...
[VERIFY] ✓ Email verificado

[LOGIN] Tentativa de login: seuemail@gmail.com
[LOGIN] ✓ Email verificado
[LOGIN] ✓ Autenticação bem-sucedida
```

### Logs do Servidor de Email

```
[EMAIL] ✅ Conexão SMTP verificada com sucesso
[EMAIL] ✓ Email enviado para: seuemail@gmail.com
```

---

## ✅ Checklist - Tudo Funcionando?

- [ ] Registro com domínio válido aceito
- [ ] Registro com domínio inválido rejeitado
- [ ] Email recebido em < 2 minutos
- [ ] Link do email funciona
- [ ] Página de sucesso aparece
- [ ] Redirecionamento para login automático
- [ ] Login bem-sucedido com credenciais corretas
- [ ] Login rejeitado com credenciais erradas
- [ ] JWT token salvo em localStorage após login
- [ ] Dashboard carrega após login

---

## 🆘 Problemas Comuns

### Email não chega
```
Causa: App Password inválida no .env
Solução: 
  - Verifique .env: EMAIL_PASSWORD=fjgwxfyobrgffkig
  - Sem espaços no meio!
  - Reinicie backend
```

### "Email não verificado" mesmo após clicar link
```
Causa: Token não está sendo salvo no banco
Solução:
  - Reinicie backend
  - Execute test-complete-flow.js para debug
  - Verifique database logs
```

### Link de verificação não funciona
```
Causa: Token expirado (> 24h) ou inválido
Solução:
  - Registre-se novamente
  - Clique no link dentro de 24h
  - Use "Reenviar email" se necessário
```

### Login funciona mas sem token
```
Causa: localStorage não está sendo salvo
Solução:
  - Verifique se backend retorna token
  - Check DevTools → Storage → LocalStorage
  - Clear cache e tente novamente
```

---

## 📊 Fluxo Visual Esperado

```
┌──────────────────┐
│  http://localhost:8080/registrar
│  Preencher dados
└──────────────────┘
        ↓
┌──────────────────┐
│  POST /api/auth/register
│  Status: 201
└──────────────────┘
        ↓
┌──────────────────┐
│  /verificacao-pendente
│  Aguardando email
└──────────────────┘
        ↓
┌──────────────────┐
│  Usuário recebe email
│  Clica em link
└──────────────────┘
        ↓
┌──────────────────┐
│  http://localhost:8080/verificar-email/TOKEN
│  POST /api/auth/verify-email/TOKEN
│  Status: 200
└──────────────────┘
        ↓
┌──────────────────┐
│  Sucesso!
│  Redireciona para login
└──────────────────┘
        ↓
┌──────────────────┐
│  http://localhost:8080/entrar
│  Fazer login
└──────────────────┘
        ↓
┌──────────────────┐
│  POST /api/auth/login
│  Status: 200
│  JWT salvo
└──────────────────┘
        ↓
┌──────────────────┐
│  http://localhost:8080
│  Autenticado!
└──────────────────┘
```

---

## 🚀 Resumo

**O sistema está pronto para testes!**

1. Registro → Email enviado automaticamente
2. Verificação → Token validado
3. Login → Acesso concedido
4. Sessão → Mantida via JWT

Teste agora em: **http://localhost:8080/registrar**
