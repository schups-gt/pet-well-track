# ✅ Checklist de Implementação - Verificação de Email

## Backend Setup

### Configuração Inicial
- [ ] Verificar se Nodemailer está instalado em `server/package.json`
  - Se não: `npm install nodemailer`

### Variáveis de Ambiente
- [ ] Abrir `server/.env`
- [ ] Adicionar/Verificar:
  ```env
  EMAIL_SERVICE=gmail
  EMAIL_USER=seu-email@gmail.com
  EMAIL_PASSWORD=sua-app-password
  BASE_URL=http://localhost:8080
  JWT_SECRET=sua_chave_secreta_aqui
  JWT_EXPIRES_IN=2h
  ```

### Configurar Gmail (se usar)
- [ ] Ir para https://myaccount.google.com
- [ ] Ativar autenticação de 2 fatores
- [ ] Ir para https://myaccount.google.com/apppasswords
- [ ] Selecionar "Mail" e "Windows Computer"
- [ ] Copiar senha de aplicativo
- [ ] Colar como `EMAIL_PASSWORD` no `.env`

### Banco de Dados
- [ ] Executar servidor backend uma vez para criar colunas
  ```bash
  npm run dev
  ```
- [ ] Verificar se colunas foram criadas em `users` table:
  - `email_verified`
  - `verification_token`
  - `verification_expires`

### Arquivos Backend Criados
- [ ] `server/src/services/email.service.js`
- [ ] `server/src/services/email-validation.service.js`
- [ ] `server/.env.example`
- [ ] `server/VERIFICACAO_EMAIL.md`
- [ ] `server/test-email-validation.js`

### Arquivos Backend Modificados
- [ ] `server/src/database/sqlite.js` - Colunas adicionadas
- [ ] `server/src/services/user.service.js` - Funções de verificação
- [ ] `server/src/controllers/auth.controller.js` - Controllers atualizados
- [ ] `server/src/routes/auth.routes.js` - Rotas adicionadas

---

## Frontend Setup

### Arquivos Frontend Criados
- [ ] `src/pages/VerificarEmail.tsx`
- [ ] `src/pages/VerificacaoPendente.tsx`
- [ ] `src/pages/ReenviarVerificacao.tsx`
- [ ] `src/lib/email-validation.ts`
- [ ] `VERIFICACAO_EMAIL_FRONTEND.md`

### Arquivos Frontend Modificados
- [ ] `src/pages/Registrar.tsx` - Validação de domínio adicionada
- [ ] `src/pages/Entrar.tsx` - Tratamento de email não verificado
- [ ] `src/App.tsx` - 3 novas rotas adicionadas

### Verificar Importações
- [ ] Em `Registrar.tsx`: `import { validateEmail } from "../lib/email-validation"`
- [ ] Em `Entrar.tsx`: Tratamento de erro `EMAIL_NOT_VERIFIED`
- [ ] Em `App.tsx`: Todas as 3 importações de novas páginas

---

## Testes Funcionais

### Teste 1: Validação de Domínio (Frontend)
- [ ] Ir para http://localhost:8080/registrar
- [ ] Digitar: `teste@empresa.com.br`
- [ ] Resultado esperado:
  - Campo fica vermelho
  - Botão "Registrar" fica desabilitado
  - Mensagem: "Domínios permitidos: @gmail.com, ..."
- [ ] Digitar: `teste@gmail.com`
- [ ] Resultado esperado:
  - Campo fica normal
  - Botão "Registrar" fica habilitado

### Teste 2: Registro Completo
- [ ] Nome: João Silva
- [ ] Email: joao@gmail.com
- [ ] Senha: 123456
- [ ] Clicar "Registrar"
- [ ] Resultado esperado:
  - Mensagem de sucesso
  - Redireciona para `/verificacao-pendente`
  - Página mostra o email

### Teste 3: Verificação de Email
- [ ] Na página `/verificacao-pendente`
- [ ] Clicar "Não recebi o email"
- [ ] Ou abrir console do backend
- [ ] Copiar o token do link exibido
- [ ] Acessar: `http://localhost:3000/api/auth/verify-email/TOKEN_AQUI`
- [ ] Resultado esperado:
  - Resposta JSON com sucesso
  - Email marcado como verificado no banco

### Teste 4: Login com Email Verificado
- [ ] Ir para http://localhost:8080/entrar
- [ ] Email: joao@gmail.com
- [ ] Senha: 123456
- [ ] Clicar "Entrar"
- [ ] Resultado esperado:
  - Sucesso
  - Redireciona para home
  - Token armazenado

### Teste 5: Login com Email não Verificado
- [ ] Registrar novo usuário
- [ ] Não verificar o email
- [ ] Tentar fazer login
- [ ] Resultado esperado:
  - Erro: "Por favor, verifique seu email antes de fazer login"
  - Botão: "Reenviar Email de Verificação"

### Teste 6: Reenviar Verificação
- [ ] Clicar em "Reenviar Email de Verificação"
- [ ] Ou ir para `/reenviar-verificacao`
- [ ] Digitar email
- [ ] Clicar "Reenviar Email"
- [ ] Resultado esperado:
  - Mensagem de sucesso
  - Email reenviado
  - Novo token gerado

---

## Verificações de Segurança

- [ ] Tokens expiram em 24 horas (configurável)
- [ ] Tokens são aleatórios (32 bytes)
- [ ] Email não pode fazer login sem verificar
- [ ] Validação ocorre em frontend E backend
- [ ] Senhas são hasheadas com bcrypt
- [ ] Base URL está correta no `.env`

---

## Possíveis Problemas e Soluções

### ❌ Email não é enviado
- [ ] Verificar `EMAIL_USER` e `EMAIL_PASSWORD` no `.env`
- [ ] Para Gmail: usar "Senha de Aplicativo", não a senha da conta
- [ ] Verificar logs do console do backend
- [ ] Testar conectividade: `npm run dev` deve iniciar sem erros

### ❌ Campo de email não valida
- [ ] Verificar se `email-validation.ts` existe em `src/lib/`
- [ ] Verificar imports em `Registrar.tsx`
- [ ] Limpar cache do navegador (Ctrl+Shift+Del)
- [ ] Recarregar página (F5)

### ❌ Rotas 404
- [ ] Verificar se rotas foram adicionadas em `App.tsx`
- [ ] Verificar se páginas foram importadas
- [ ] Verificar caminho das rotas (sensível a maiúsculas)

### ❌ CORS Error
- [ ] Verificar `origin` em `server/src/app.js`
- [ ] Deve ser `http://localhost:8080`
- [ ] Reiniciar servidor backend

### ❌ Token inválido/expirado
- [ ] Tokens duram 24 horas
- [ ] Usar `/reenviar-verificacao` para novo token
- [ ] Verificar se token foi copiado corretamente

---

## Depois da Implementação

### Melhorias Futuras
- [ ] Adicionar rate limiting
- [ ] Melhorar template do email
- [ ] Adicionar 2FA
- [ ] Adicionar captcha
- [ ] Sistema de blacklist

### Documentação
- [ ] Ler `GUIA_COMPLETO.md`
- [ ] Ler `VERIFICACAO_EMAIL.md` (backend)
- [ ] Ler `VERIFICACAO_EMAIL_FRONTEND.md` (frontend)
- [ ] Ler `RESUMO_VISUAL.md`

### Commit no Git
- [ ] Adicionar arquivos: `git add .`
- [ ] Commit: `git commit -m "feat: Implementar verificação de email com validação de domínios"`
- [ ] Push: `git push origin main`

---

## 🎯 Status Final

Ao completar todos os itens desta lista, você terá:

✅ Verificação de email funcionando
✅ Validação de domínios (8 domínios permitidos)
✅ Frontend com validação em tempo real
✅ Backend com segurança em camadas
✅ Fluxo de reenvio de emails
✅ Documentação completa

---

**Data: 30 de Novembro de 2025**

Implementação concluída por: GitHub Copilot
