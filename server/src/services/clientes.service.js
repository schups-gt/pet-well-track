// server/src/services/clientes.service.js

// storage em memória para CLIENTES
let _clienteId = 1;
const clientes = []; // { id, ownerId, nome, email, telefone, criadoEm }

export async function listClientes({ ownerId, search }) {
  let data = clientes.filter(c => c.ownerId === ownerId);
  if (search) {
    const s = search.toLowerCase();
    data = data.filter(c =>
      (c.nome || "").toLowerCase().includes(s) ||
      (c.email || "").toLowerCase().includes(s) ||
      (c.telefone || "").toLowerCase().includes(s)
    );
  }
  data.sort((a, b) => b.id - a.id);
  return data;
}

export async function getClienteById({ ownerId, id }) {
  return clientes.find(c => c.ownerId === ownerId && c.id === id) || null;
}

export async function createCliente({ ownerId, nome, email, telefone }) {
  const novo = {
    id: _clienteId++,
    ownerId,
    nome,
    email: email || null,
    telefone: telefone || null,
    criadoEm: new Date().toISOString()
  };
  clientes.push(novo);
  return novo;
}

export async function updateCliente({ ownerId, id, nome, email, telefone }) {
  const idx = clientes.findIndex(c => c.ownerId === ownerId && c.id === id);
  if (idx === -1) return null;
  const atual = clientes[idx];
  const upd = {
    ...atual,
    nome: nome ?? atual.nome,
    email: email ?? atual.email,
    telefone: telefone ?? atual.telefone
  };
  clientes[idx] = upd;
  return upd;
}

export async function deleteCliente({ ownerId, id }) {
  const idx = clientes.findIndex(c => c.ownerId === ownerId && c.id === id);
  if (idx === -1) return false;
  clientes.splice(idx, 1);
  return true;
}
