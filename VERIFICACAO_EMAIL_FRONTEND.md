# Integração de Verificação de Email - Frontend

## Visão Geral

A verificação de email foi integrada ao frontend com validação de domínios em tempo real e um fluxo completo de verificação.

## Arquivos Adicionados/Modificados

### Páginas Novas
1. **`src/pages/VerificarEmail.tsx`**
   - Página acessada via link do email
   - Valida o token de verificação
   - Redireciona automaticamente para login após sucesso

2. **`src/pages/VerificacaoPendente.tsx`**
   - Exibida após o registro bem-sucedido
   - Instrui o usuário a verificar o email
   - Oferece opção de reenviar email

3. **`src/pages/ReenviarVerificacao.tsx`**
   - Permite reenviar email de verificação
   - Aceita qualquer email registrado

### Serviços
1. **`src/lib/email-validation.ts`** (NOVO)
   - Validação centralizada de domínios
   - Funções reutilizáveis
   - Sincronizado com backend

### Páginas Modificadas
1. **`src/pages/Registrar.tsx`**
   - Validação de domínio em tempo real
   - Desabilita botão se email inválido
   - Redireciona para verificação pendente

2. **`src/pages/Entrar.tsx`**
   - Detecta erro de email não verificado
   - Oferece link para reenviar verificação
   - Tratamento de código de erro específico

3. **`src/App.tsx`**
   - Novas rotas adicionadas
   - Todas as rotas de email são públicas (não protegidas)

## Fluxo de Usar

### 1. Registro
```
1. Usuário preenche formulário em /registrar
2. Email é validado em tempo real (domínio)
3. Ao enviar:
   - Backend valida novamente
   - Token de verificação é gerado
   - Email é enviado
4. Usuário é redirecionado para /verificacao-pendente
```

### 2. Verificação Pendente
```
1. Página exibe email e instruções
2. Usuário recebe email com link
3. Link contém token e aponta para /verificar-email/:token
4. Usuário clica no link
```

### 3. Verificação de Email
```
1. Página /verificar-email/:token é carregada
2. Requisição é feita para backend
3. Token é validado
4. Email é marcado como verificado
5. Usuário é redirecionado para /entrar automaticamente
```

### 4. Login
```
1. Usuário vai para /entrar
2. Tenta fazer login com email e senha
3. Backend verifica se email está verificado
4. Se não: retorna erro 403 com código EMAIL_NOT_VERIFIED
5. Frontend mostra opção de reenviar email
```

### 5. Reenviar Verificação
```
1. Usuário acessa /reenviar-verificacao
2. Digita seu email
3. Novo token é gerado
4. Email é reenviado
5. Link expira em 24 horas
```

## Validação de Domínios

### Domínios Permitidos
- @gmail.com
- @outlook.com
- @icloud.com
- @hotmail.com
- @yahoo.com
- @yahoo.com.br
- @me.com
- @baraodemaua.edu.br

### Validação em Tempo Real
Durante o registro, a validação ocorre enquanto o usuário digita:
```typescript
- Campo fica vermelho se domínio inválido
- Mensagem de erro exibe domínios permitidos
- Botão é desabilitado se email inválido
```

## Componentes Utilizados

### Páginas
- `VerificarEmail` - Confirmação do token
- `VerificacaoPendente` - Instrução pós-registro
- `ReenviarVerificacao` - Reenviar email

### UI
- `PawPatternBackground` - Fundo com padrão
- Inputs com validação em tempo real
- Mensagens de sucesso/erro

### Context
- `AuthContext` - Mantém usuário e token autenticado

## API Endpoints Utilizados

### Frontend → Backend

1. **Registro**
   ```
   POST /api/auth/register
   Body: { name, email, password }
   ```

2. **Verificar Email**
   ```
   POST /api/auth/verify-email/:token
   ```

3. **Reenviar Verificação**
   ```
   POST /api/auth/resend-verification
   Body: { email }
   ```

4. **Login**
   ```
   POST /api/auth/login
   Body: { email, password }
   ```

## Tratamento de Erros

### Erro: Domínio Inválido (Registro)
```
Campo de email fica vermelho
Mensagem: "Domínios permitidos: @gmail.com, ..."
Botão desabilitado
```

### Erro: Email não verificado (Login)
```
Mensagem: "Por favor, verifique seu email antes de fazer login"
Botão: "Reenviar Email de Verificação"
```

### Erro: Token Expirado (Verificação)
```
Página mostra erro
Opções: "Registrar Novamente" ou "Reenviar Email"
```

## Personalização

### Adicionar Novo Domínio

1. Backend (`server/src/services/email-validation.service.js`):
```javascript
const ALLOWED_DOMAINS = [
  // ... domínios existentes
  "@seu-novo-dominio.com.br",  // ← adicionar
];
```

2. Frontend (`src/lib/email-validation.ts`):
```typescript
export const ALLOWED_EMAIL_DOMAINS = [
  // ... domínios existentes
  "@seu-novo-dominio.com.br",  // ← adicionar
];
```

### Modificar Tempo de Expiração

**Backend** (`server/src/controllers/auth.controller.js`):
```javascript
// De 24 horas para 1 hora:
const verificationExpires = Date.now() + 60 * 60 * 1000; // 1h
```

**No reenvio** - também modificar em `resendVerificationEmailController`

## Testes

### Teste de Domínio Válido
```
1. Ir para /registrar
2. Digitar email@gmail.com
3. Campo fica verde, botão habilitado
4. Clicar Registrar
```

### Teste de Domínio Inválido
```
1. Ir para /registrar
2. Digitar email@seudominio.com
3. Campo fica vermelho, botão desabilitado
4. Mensagem mostra domínios permitidos
```

### Teste Completo de Verificação
```
1. Registrar com email@gmail.com
2. Ser redirecionado para /verificacao-pendente
3. Clicar "Não recebi o email"
4. Ir para /reenviar-verificacao
5. Digitar email e reenviar
```

## Segurança

✅ Tokens de verificação são gerados aleatoriamente
✅ Tokens expiram em 24 horas
✅ Validação no frontend E backend
✅ Email não pode fazer login sem verificar
✅ Senhas são hasheadas com bcrypt

## Considerações

- A validação de domínio evita spammers usando emails corporativos fake
- Tokens de 24 horas equilibram segurança e usabilidade
- Frontend valida para melhor UX, backend valida por segurança
- Usuários podem reenviar email quantas vezes precisarem
