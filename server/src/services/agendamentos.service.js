// storage em memória para AGENDAMENTOS
let _agdId = 1;
const agendamentos = []; 
// { id, ownerId, cliente_id, servico_id, data_hora, status, observacoes, criadoEm }]

export async function listAgendamentos({ ownerId, from, to }) {
    let data = agendamentos.filter(a => a.ownerId === ownerId);
    if (from) data = data.filter(a => new Date9a.data_hora) >= new Date(from);
    if (to) data = data.filter(a => new Date(a.data_hora) <= new Date(to));
    data.sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
    return data;
}  

export async function getAgendamentoById({ ownerId, id }) {
    return agendamentos.find(a => a.ownerId === ownerId && a.id === id) || null;
}

export async function createAgendamento({ ownerId, cliente_id, servico_id, data_hora, observacoes }) {
  const novo = {
    id: _agdId++,
    ownerId,
    cliente_id,
    servico_id,
    data_hora,               // ISO string
    status: "marcado",       // marcado | concluido | cancelado
    observacoes: observacoes || null,
    criadoEm: new Date().toISOString()
  };
  agendamentos.push(novo);
  return novo;
}

export async function updateAgendamento({ ownerId, id, data_hora, status, observacoes }) {
  const idx = agendamentos.findIndex(a => a.ownerId === ownerId && a.id === id);
  if (idx === -1) return null;
  const atual = agendamentos[idx];
  const upd = {
    ...atual,
    data_hora: data_hora ?? atual.data_hora,
    status: status ?? atual.status,
    observacoes: observacoes ?? atual.observacoes
  };
  agendamentos[idx] = upd;
  return upd;
}

export async function deleteAgendamento({ ownerId, id }) {
  const idx = agendamentos.findIndex(a => a.ownerId === ownerId && a.id === id);
  if (idx === -1) return false;
  agendamentos.splice(idx, 1);
  return true;
}

// Regra simples: impede dois agendamentos no MESMO horário para o MESMO cliente
export async function hasConflito({ ownerId, cliente_id, data_hora }) {
  return agendamentos.some(a =>
    a.ownerId === ownerId &&
    a.cliente_id === cliente_id &&
    a.data_hora === data_hora
  );
}