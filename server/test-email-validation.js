/**
 * Teste da validação de domínios de email
 * Execute com: node test-email-validation.js
 */

import {
  isValidEmailDomain,
  extractEmailDomain,
  getAllowedDomains,
} from "./src/services/email-validation.service.js";

console.log("=== Testando Validação de Domínios de Email ===\n");

// Teste 1: Domínios permitidos
console.log("✓ Teste 1: Domínios Permitidos");
const validEmails = [
  "usuario@gmail.com",
  "usuario@outlook.com",
  "usuario@icloud.com",
  "usuario@hotmail.com",
  "usuario@yahoo.com",
  "usuario@yahoo.com.br",
  "usuario@me.com",
  "usuario@baraodemaua.edu.br",
];

validEmails.forEach(email => {
  const isValid = isValidEmailDomain(email);
  console.log(`  ${isValid ? "✓" : "✗"} ${email}: ${isValid}`);
});

// Teste 2: Domínios não permitidos
console.log("\n✓ Teste 2: Domínios Não Permitidos");
const invalidEmails = [
  "usuario@empresa.com.br",
  "usuario@seudominio.com",
  "usuario@example.com",
  "usuario@test.org",
  "usuario@domain.io",
];

invalidEmails.forEach(email => {
  const isValid = isValidEmailDomain(email);
  console.log(`  ${!isValid ? "✓" : "✗"} ${email}: ${isValid}`);
});

// Teste 3: Extrair domínio
console.log("\n✓ Teste 3: Extração de Domínio");
const testEmails = [
  "joao@gmail.com",
  "maria@yahoo.com.br",
  "pedro@baraodemaua.edu.br",
];

testEmails.forEach(email => {
  const domain = extractEmailDomain(email);
  console.log(`  ${email} → ${domain}`);
});

// Teste 4: Listar domínios permitidos
console.log("\n✓ Teste 4: Domínios Permitidos");
const allowedDomains = getAllowedDomains();
allowedDomains.forEach(domain => {
  console.log(`  - ${domain}`);
});

// Teste 5: Case insensitive
console.log("\n✓ Teste 5: Case Insensitive");
const caseTests = [
  "USUARIO@GMAIL.COM",
  "Usuario@Gmail.Com",
  "usuario@GMAIL.COM",
];

caseTests.forEach(email => {
  const isValid = isValidEmailDomain(email);
  console.log(`  ${isValid ? "✓" : "✗"} ${email}: ${isValid}`);
});

// Teste 6: Emails inválidos
console.log("\n✓ Teste 6: Emails Inválidos");
const edgeCases = [
  "",
  null,
  undefined,
  "invalido",
  "@gmail.com",
  "usuario@",
  "usuario@@gmail.com",
];

edgeCases.forEach(email => {
  const isValid = isValidEmailDomain(email);
  console.log(`  ${!isValid ? "✓" : "✗"} ${email}: ${isValid}`);
});

console.log("\n=== Testes Concluídos ===");
