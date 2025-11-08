// server/src/services/clientes.service.js
import { dbs } from "../database/sqlite.js";
import { makeScopedCrud } from "./base-crud.js";

// NADA de CREATE TABLE aqui — isso está no sqlite.js

const repo = makeScopedCrud(dbs.cliente, "clientes", {
  searchCols: ["nome", "email", "telefone"],
});

export async function listClientes({ ownerId, search }) {
  return repo.list({ ownerId, search });
}

export async function getClienteById({ ownerId, id }) {
  return repo.getById({ ownerId, id });
}

export async function createCliente({ ownerId, nome, email, telefone }) {
  // normaliza valores nulos
  return repo.create({
    ownerId,
    data: {
      nome,
      email: email || null,
      telefone: telefone || null,
      criado_em: new Date().toISOString().slice(0, 19).replace("T", " "),
    },
  });
}

export async function updateCliente({ ownerId, id, nome, email, telefone }) {
  return repo.update({
    ownerId,
    id,
    data: { nome, email, telefone },
  });
}

export async function deleteCliente({ ownerId, id }) {
  return repo.remove({ ownerId, id });
}
