// storage em memória para SERVIÇOS
let _servId = 1;
const servicos = []; // { id, ownerId, titulo, descricao, preco_cents, criadoEm }

export async function listServicos({ ownerId, search }) {
  let data = servicos.filter(s => s.ownerId === ownerId);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(s =>
      (s.titulo || "").toLowerCase().includes(q) ||
      (s.descricao || "").toLowerCase().includes(q)
    );
  }
  data.sort((a, b) => b.id - a.id);
  return data;
}

export async function getServicoById({ ownerId, id }) {
  return servicos.find(s => s.ownerId === ownerId && s.id === id) || null;
}

export async function createServico({ ownerId, titulo, descricao, preco_cents }) {
  const novo = {
    id: _servId++,
    ownerId,
    titulo,
    descricao: descricao || null,
    preco_cents,
    criadoEm: new Date().toISOString()
  };
  servicos.push(novo);
  return novo;
}

export async function updateServico({ ownerId, id, titulo, descricao, preco_cents }) {
  const idx = servicos.findIndex(s => s.ownerId === ownerId && s.id === id);
  if (idx === -1) return null;
  const atual = servicos[idx];
  const upd = {
    ...atual,
    titulo: titulo ?? atual.titulo,
    descricao: descricao ?? atual.descricao,
    preco_cents: (preco_cents ?? atual.preco_cents)
  };
  servicos[idx] = upd;
  return upd;
}

export async function deleteServico({ ownerId, id }) {
  const idx = servicos.findIndex(s => s.ownerId === ownerId && s.id === id);
  if (idx === -1) return false;
  servicos.splice(idx, 1);
  return true;
}
