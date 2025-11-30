# 🐾 Pet Well Track - Verificação de Email

## 📢 Novidades

Implementação completa de **Verificação de Email com Validação de Domínios**!

### ✨ Recursos Principais

✅ **Validação de Domínio em Tempo Real**
- Frontend valida enquanto você digita
- Backend valida por segurança
- 8 domínios permitidos (Gmail, Outlook, Yahoo, etc)

✅ **Fluxo Completo de Verificação**
- Registro com geração de token
- Email de confirmação automático
- Link de verificação com expiração (24h)
- Reenvio de email disponível

✅ **Login Seguro**
- Apenas emails verificados podem acessar
- Mensagem clara se email não verificado
- Botão para reenviar verificação

✅ **Segurança em Camadas**
- Validação frontend E backend
- Tokens aleatórios (32 bytes)
- Senhas hasheadas com bcrypt
- CORS configurado

---

## 🚀 Quick Start

### 1. Configurar Backend

```bash
cd server

# Instalar dependências
npm install

# Configurar .env (ver .env.example)
echo "JWT_SECRET=sua_chave_aqui" >> .env
echo "EMAIL_USER=seu@gmail.com" >> .env
echo "EMAIL_PASSWORD=sua-app-password" >> .env
echo "BASE_URL=http://localhost:8080" >> .env

# Iniciar servidor
npm run dev
```

### 2. Configurar Frontend

```bash
# Instalar dependências
npm install

# Iniciar frontend
npm run dev
```

### 3. Testar

Ir para: http://localhost:8080/registrar

1. Tentar com email @empresa.com → ❌ Inválido
2. Tentar com email @gmail.com → ✅ Válido
3. Completar registro
4. Verificar email e clicar no link
5. Fazer login

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| **GUIA_COMPLETO.md** | Guia completo de implementação e uso |
| **CHECKLIST.md** | Checklist para validar tudo |
| **RESUMO_VISUAL.md** | Resumo visual das mudanças |
| **VERIFICACAO_EMAIL.md** | Documentação técnica do backend |
| **VERIFICACAO_EMAIL_FRONTEND.md** | Documentação técnica do frontend |

---

## 🔐 Domínios Permitidos

```
@gmail.com
@outlook.com
@icloud.com
@hotmail.com
@yahoo.com
@yahoo.com.br
@me.com
@baraodemaua.edu.br
```

---

## 📊 Arquivos Adicionados

**Backend:**
- `server/src/services/email.service.js`
- `server/src/services/email-validation.service.js`
- `server/.env.example`
- `server/test-email-validation.js`

**Frontend:**
- `src/pages/VerificarEmail.tsx`
- `src/pages/VerificacaoPendente.tsx`
- `src/pages/ReenviarVerificacao.tsx`
- `src/lib/email-validation.ts`

**Documentação:**
- `GUIA_COMPLETO.md`
- `CHECKLIST.md`
- `RESUMO_VISUAL.md`
- `VERIFICACAO_EMAIL_FRONTEND.md`
- `server/VERIFICACAO_EMAIL.md`

---

## 🔧 Configurar Gmail (Recomendado)

1. Ir para: https://myaccount.google.com
2. Ativar 2FA
3. Ir para: https://myaccount.google.com/apppasswords
4. Selecionar "Mail" e "Windows Computer"
5. Copiar a senha de aplicativo
6. Usar em `EMAIL_PASSWORD` no `.env`

---

## 🧪 Rotas de API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrar com verificação |
| POST | `/api/auth/login` | Login (requer email verificado) |
| POST | `/api/auth/verify-email/:token` | Verificar email via token |
| POST | `/api/auth/resend-verification` | Reenviar email |

---

## 🐛 Troubleshooting

### Email não é enviado?
- Verificar credentials no `.env`
- Para Gmail: usar "Senha de Aplicativo"
- Verificar logs do backend

### Domínio não é reconhecido?
- Adicionar em `server/src/services/email-validation.service.js`
- Adicionar em `src/lib/email-validation.ts`
- Ambas as listas devem estar sincronizadas

### Rota 404?
- Verificar imports em `src/App.tsx`
- Limpar cache do navegador

---

## 📝 Próximos Passos

1. ✅ Ler `CHECKLIST.md`
2. ✅ Configurar variáveis de ambiente
3. ✅ Testar fluxo completo
4. ✅ Fazer commit no Git

---

## 📞 Comandos Úteis

```bash
# Testar validação de email (backend)
cd server
node test-email-validation.js

# Limpar banco de dados
rm server/src/database/cliente.db

# Ver logs em tempo real
npm run dev 2>&1 | grep -i "email\|verify"
```

---

## ✅ Status

- ✅ Backend completo
- ✅ Frontend completo
- ✅ Documentação completa
- ✅ Pronto para uso
- ⏳ Aguardando testes

---

**Implementado em: 30 de Novembro de 2025**

Para mais informações, leia `GUIA_COMPLETO.md`
