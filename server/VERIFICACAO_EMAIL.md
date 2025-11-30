# Verificação de Email - Documentação

## Visão Geral

A implementação de verificação de email adiciona uma camada de segurança ao sistema, garantindo que apenas usuários com email válido consigam acessar a plataforma.

## Mudanças Realizadas

### 1. Banco de Dados
- **Arquivo**: `server/src/database/sqlite.js`
- **Alterações**:
  - Adicionada coluna `email_verified` (INTEGER, DEFAULT 0) à tabela `users`
  - Adicionada coluna `verification_token` (TEXT) à tabela `users`
  - Adicionada coluna `verification_expires` (INTEGER) à tabela `users`

### 2. Serviço de Email
- **Novo arquivo**: `server/src/services/email.service.js`
- **Funções**:
  - `sendVerificationEmail()` - Envia email de verificação com token
  - `sendPasswordResetEmail()` - Envia email de redefinição de senha

### 3. Serviço de Validação de Domínios
- **Novo arquivo**: `server/src/services/email-validation.service.js`
- **Funções**:
  - `isValidEmailDomain()` - Valida se o email possui domínio permitido
  - `extractEmailDomain()` - Extrai o domínio do email
  - `getAllowedDomains()` - Retorna lista de domínios permitidos
- **Domínios Permitidos**:
  - @gmail.com
  - @outlook.com
  - @icloud.com
  - @hotmail.com
  - @yahoo.com
  - @yahoo.com.br
  - @me.com
  - @baraodemaua.edu.br

### 4. Serviço de Usuário
- **Arquivo**: `server/src/services/user.service.js`
- **Novas funções**:
  - `updateEmailVerificationToken()` - Salva token de verificação
  - `findUserByVerificationToken()` - Busca usuário pelo token
  - `markEmailAsVerified()` - Marca email como verificado
  - `isEmailVerified()` - Verifica se email está confirmado

### 5. Controlador de Autenticação
- **Arquivo**: `server/src/controllers/auth.controller.js`
- **Alterações**:
  - **Register**: Valida domínio de email, gera token de verificação e envia email, não retorna JWT imediatamente
  - **Login**: Valida se email está verificado antes de permitir login (retorna erro 403 se não)
  - **Novas funções**:
    - `verifyEmailController()` - Confirma email via token
    - `resendVerificationEmailController()` - Reenvia email de verificação

### 6. Rotas
- **Arquivo**: `server/src/routes/auth.routes.js`
- **Novas rotas**:
  - `POST /api/auth/verify-email/:token` - Confirmar email
  - `POST /api/auth/resend-verification` - Reenviar email

## Fluxo de Verificação

### 1. Registro
```
1. Usuário faz POST /api/auth/register
2. Sistema valida domínio do email
   - Se inválido: retorna 400 com lista de domínios permitidos
   - Se válido: continua
3. Sistema cria usuário com email_verified = 0
4. Sistema gera token de verificação (válido por 24h)
5. Sistema envia email com link de verificação
6. Resposta: 201 (sucesso, mas sem token JWT)
```

### 2. Verificação de Email
```
1. Usuário clica no link do email
2. Navegador acessa GET/POST /api/auth/verify-email/:token
3. Sistema valida token
4. Sistema marca email como verificado
5. Usuário pode fazer login
```

### 3. Login
```
1. Usuário faz POST /api/auth/login com email e senha
2. Sistema verifica credenciais
3. Sistema verifica se email está verificado
   - Se não: retorna 403 com code "EMAIL_NOT_VERIFIED"
   - Se sim: gera JWT e retorna token
```

### 4. Reenviar Verificação (Opcional)
```
1. Usuário faz POST /api/auth/resend-verification com email
2. Sistema busca usuário
3. Se não verificado: gera novo token e reenvia email
4. Se já verificado: retorna erro
```

## Variáveis de Ambiente Necessárias

Adicione ao arquivo `.env`:

```env
# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-ou-app-password

# Base URL para links nos emails
BASE_URL=http://localhost:8080
```

### Para Gmail:
1. Ative autenticação de 2 fatores
2. Gere uma "Senha de Aplicativo" em https://myaccount.google.com/apppasswords
3. Use a senha de aplicativo no `EMAIL_PASSWORD`

### Para outros serviços:
Veja documentação do Nodemailer: https://nodemailer.com/smtp/

## Respostas da API

### POST /api/auth/register
**Sucesso (201)**:
```json
{
  "success": true,
  "message": "Usuário criado com sucesso. Verifique seu email para confirmar a conta.",
  "data": {
    "id": 1,
    "name": "João",
    "email": "joao@gmail.com",
    "role": "user",
    "owner_id": 1,
    "email_verified": false
  }
}
```

**Erro - Domínio Inválido (400)**:
```json
{
  "success": false,
  "error": "Email inválido. Domínios permitidos: @gmail.com, @outlook.com, @icloud.com, @hotmail.com, @yahoo.com, @yahoo.com.br, @me.com, @baraodemaua.edu.br",
  "allowed_domains": [
    "@gmail.com",
    "@outlook.com",
    "@icloud.com",
    "@hotmail.com",
    "@yahoo.com",
    "@yahoo.com.br",
    "@me.com",
    "@baraodemaua.edu.br"
  ]
}
```

### POST /api/auth/login (Email não verificado)
**Erro (403)**:
```json
{
  "success": false,
  "error": "Por favor, verifique seu email antes de fazer login",
  "code": "EMAIL_NOT_VERIFIED"
}
```

### POST /api/auth/verify-email/:token
**Sucesso (200)**:
```json
{
  "success": true,
  "message": "Email verificado com sucesso!",
  "data": {
    "email": "joao@example.com"
  }
}
```

### POST /api/auth/resend-verification
**Sucesso (200)**:
```json
{
  "success": true,
  "message": "Email de verificação reenviado"
}
```

## Frontend - Implementação Recomendada

### Componente de Registro
```typescript
// Após registro, exibir mensagem pedindo para verificar email
const response = await api.post('/auth/register', {
  name, email, password
});

if (response.status === 201) {
  // Redirecionar para página de verificação pendente
  showMessage("Verifique seu email para confirmar a conta");
  redirectTo("/verificacao-pendente", { email });
}
```

### Página de Verificação
```typescript
// Em /verificar-email/:token
useEffect(() => {
  const verifyEmail = async () => {
    try {
      const response = await api.post(`/auth/verify-email/${token}`);
      if (response.data.success) {
        showSuccess("Email verificado!");
        setTimeout(() => redirectTo("/entrar"), 2000);
      }
    } catch (error) {
      showError("Link inválido ou expirado");
    }
  };
  
  verifyEmail();
}, [token]);
```

### Erro de Login
```typescript
// No componente de login
try {
  const response = await api.post('/auth/login', { email, password });
  // ...
} catch (error) {
  if (error.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
    showWarning("Email não verificado");
    showLink("Reenviar email", () => resendVerification(email));
  }
}
```

## Considerações de Segurança

1. ✅ Tokens de verificação são 32 bytes aleatórios
2. ✅ Tokens expiram em 24 horas
3. ✅ Email não pode ser usado sem verificação
4. ✅ Senhas são hasheadas com bcrypt
5. ✅ JWT requer email verificado

## Teste no Postman

### 1. Registrar Usuário (com domínio permitido)
```
POST http://localhost:3000/api/auth/register
Body (JSON):
{
  "name": "João Silva",
  "email": "joao@gmail.com",
  "password": "123456"
}
```

### 2. Registrar Usuário (com domínio NÃO permitido - erro)
```
POST http://localhost:3000/api/auth/register
Body (JSON):
{
  "name": "João Silva",
  "email": "joao@empresa.com.br",
  "password": "123456"
}
```
Resposta: 400 com mensagem de domínios permitidos

### 3. Verificar Token (do console do servidor)
Será exibido no terminal algo como:
```
Token gerado para joao@gmail.com: abc123...
Link de verificação: http://localhost:8080/verificar-email/abc123...
```

### 4. Verificar Email (use o token)
```
POST http://localhost:3000/api/auth/verify-email/abc123...
```

### 5. Login
```
POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "email": "joao@gmail.com",
  "password": "123456"
}
```

## Possíveis Problemas

### Email não é enviado
- Verifique variáveis de ambiente
- Verifique logs do console
- Teste credenciais do email
- Para Gmail, use senha de aplicativo, não a senha da conta

### Domínio não permitido
- Verifique se o domínio está na lista de permitidos
- Para adicionar um novo domínio, edite `server/src/services/email-validation.service.js`
- Adicione o domínio no array `ALLOWED_DOMAINS`

### Modificar Domínios Permitidos

Para adicionar ou remover domínios, edite o arquivo `server/src/services/email-validation.service.js`:

```javascript
const ALLOWED_DOMAINS = [
  "@gmail.com",
  "@outlook.com",
  "@icloud.com",
  "@hotmail.com",
  "@yahoo.com",
  "@yahoo.com.br",
  "@me.com",
  "@baraodemaua.edu.br",
  // Adicione novos domínios aqui:
  // "@seudominio.com.br",
];
```

Após editar, reinicie o servidor para que as mudanças tenham efeito.

### Token inválido
- Token expirou (24 horas)
- Token foi digitado errado
- Use `/api/auth/resend-verification` para gerar novo token

### Usuário antigo não consegue logar
- Marque email como verificado manualmente via SQL:
```sql
UPDATE users SET email_verified = 1 WHERE id = 1;
```

## Próximos Passos Opcionais

1. Implementar 2FA (autenticação de dois fatores)
2. Adicionar captcha no registro
3. Rate limiting em endpoints de verificação
4. Blacklist de emails
5. Confirmação de email em background job (como Celery)
