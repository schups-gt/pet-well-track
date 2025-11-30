/**
 * Serviço de validação de domínios de email
 */

const ALLOWED_DOMAINS = [
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
 * @param {string} email - Email a validar
 * @returns {boolean} - True se o domínio é permitido
 */
export function isValidEmailDomain(email) {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailLower = email.toLowerCase();
  return ALLOWED_DOMAINS.some(domain => emailLower.endsWith(domain));
}

/**
 * Extrai o domínio do email
 * @param {string} email - Email
 * @returns {string} - Domínio do email (ex: @gmail.com)
 */
export function extractEmailDomain(email) {
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
 * Retorna lista de domínios permitidos
 * @returns {string[]} - Array com domínios permitidos
 */
export function getAllowedDomains() {
  return [...ALLOWED_DOMAINS];
}
