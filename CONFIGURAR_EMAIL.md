# 📧 Configurar Gmail para Enviar Emails - Pet Well Track

## ⚠️ Situação Atual
```
❌ EMAIL_USER: seu.email@gmail.com (placeholder, não é real)
❌ EMAIL_PASSWORD: qkjcofrrtdywssrj (senha inválida)
```

Erro: `Invalid login: 535-5.7.8 Username and Password not accepted`

---

## ✅ Solução: Gerar App Password do Gmail

### Passo 1️⃣ - Abrir Configurações do Gmail
1. Vá para: **https://myaccount.google.com**
2. Clique em **"Segurança"** (menu esquerdo)

### Passo 2️⃣ - Ativar Verificação em Duas Etapas (se não tiver)
1. Procure por **"Verificação em duas etapas"**
2. Se não estiver ativada, clique em **"Ativar"**
3. Siga as instruções (vai pedir confirmação por SMS ou app)

### Passo 3️⃣ - Gerar App Password
1. Após ativar 2FA, procure por **"Senhas de app"** na página de segurança
2. Clique em **"Senhas de app"**
3. Na janela que abrir:
   - **Selecione aplicativo:** `Mail`
   - **Selecione dispositivo:** `Windows Computer`
   - Clique em **"Gerar"**

### Passo 4️⃣ - Copiar e Salvar
1. Uma janela amarela aparecerá com **16 caracteres**: `xyzabc 123 456 wxyz`
2. **Copie a senha** (sem espaços)
3. Salve em local seguro

### Passo 5️⃣ - Atualizar .env
Abra o arquivo `server/.env` e substitua:

```env
EMAIL_USER=seu_email_real@gmail.com
EMAIL_PASSWORD=xyzabc123456wxyz
```

**Exemplo completo:**
```env
PORT=3000
SESSION_SECRET=segredo_super_seguro_123
EMAIL_SERVICE=gmail
EMAIL_USER=joao.silva@gmail.com
EMAIL_PASSWORD=xyzabc123456wxyz
BASE_URL=http://localhost:8080
NODE_ENV=development
JWT_SECRET=uma_frase_bem_grande_e_aleatoria_123
JWT_EXPIRES_IN=2h
COOKIE_NAME=token
DB_PATH=./data/app.db
```

---

## 🧪 Testar Configuração

Após atualizar o `.env`, execute:

```bash
cd server
node test-email.js
```

**Resultado esperado:**
```
✅ Conexão SMTP verificada com sucesso!
✅ Email enviado com sucesso!
Message ID: <...>
```

---

## 🔒 Segurança

- ✅ **App Password** é diferente da sua senha do Gmail
- ✅ A App Password funciona APENAS para Nodemailer
- ✅ Você pode revogar a qualquer momento
- ✅ Cada app pode ter sua própria senha

---

## ⚠️ Problemas Comuns

### "Conexão recusada"
- Seu firewall pode estar bloqueando SMTP
- Tente desabilitar antivírus temporariamente

### "Username and Password not accepted"
- ✅ Copie a senha sem espaços
- ✅ Use uma App Password, não sua senha normal
- ✅ Certifique-se de ter 2FA ativado

### "Too many login attempts"
- Aguarde 5 minutos e tente novamente
- Não tente múltiplas vezes com senhas erradas

---

## 📱 Alternativa: Usar Email Diferente

Se quiser usar outro serviço de email:

### Gmail (recomendado)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_app_password
```

### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook365
EMAIL_USER=seu_email@outlook.com
EMAIL_PASSWORD=sua_senha_real
```

### Yahoo Mail
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=seu_email@yahoo.com
EMAIL_PASSWORD=sua_app_password
```

---

## ✅ Próximos Passos

1. Gerar App Password do Gmail
2. Atualizar `server/.env`
3. Reiniciar servidor: `npm run dev`
4. Testar: `node test-email.js`
5. Tentar registrar novo usuário no frontend

---

**Dúvidas?** Veja: https://support.google.com/accounts/answer/185833

