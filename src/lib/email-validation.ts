/**
 * Serviço de validação de email para o frontend
 * Mantém sincronizado com o backend
 */

export const ALLOWED_EMAIL_DOMAINS = [
  "@gmail.com",
  "@outlook.com",
  "@icloud.com",
  "@hotmail.com",
  "@yahoo.com",
  "@yahoo.com.br",
  "@me.com",
  "@baraodemaua.edu.br",
];

/**
 * Valida se o email possui um domínio permitido
 * @param email - Email a validar
 * @returns true se válido, false caso contrário
 */
export function isValidEmailDomain(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailLower = email.toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some(domain => emailLower.endsWith(domain));
}

/**
 * Extrai o domínio do email
 * @param email - Email
 * @returns Domínio do email (ex: @gmail.com) ou null
 */
export function getEmailDomain(email: string): string | null {
  if (!email || typeof email !== "string") {
    return null;
  }

  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) {
    return null;
  }

  return email.substring(atIndex).toLowerCase();
}

/**
 * Retorna a lista de domínios permitidos
 */
export function getAllowedDomains(): string[] {
  return [...ALLOWED_EMAIL_DOMAINS];
}

/**
 * Formata mensagem de erro com domínios permitidos
 */
export function getEmailErrorMessage(): string {
  const domains = getAllowedDomains();
  return `Domínios permitidos: ${domains.join(", ")}`;
}

/**
 * Valida email completo (formato e domínio)
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: "Email é obrigatório" };
  }

  // Validação básica de formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Email inválido" };
  }

  // Validação de domínio
  if (!isValidEmailDomain(email)) {
    return { valid: false, error: getEmailErrorMessage() };
  }

  return { valid: true };
}
