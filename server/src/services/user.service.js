// storage em memória para USUÁRIOS
let _userId = 1;
const users = []; // { id, name, email, password_hash }

export async function findUserByEmail(email) {
  return users.find(u => u.email === email) || null;
}

export async function findUserById(id) {
  return users.find(u => u.id === id) || null;
}

export async function createUser({ name, email, password_hash }) {
  const user = { id: _userId++, name, email, password_hash };
  users.push(user);
  return user;
}

export async function updateUserToken(userId, token, expires) {
  // se estiver usando banco de dados, atualize a tabela de usuários
  // exemplo genérico:
  const user = await findUserById(userId);
  user.resetToken = token;
  user.resetTokenExpires = expires;
  // salve no DB
  return user;
}
