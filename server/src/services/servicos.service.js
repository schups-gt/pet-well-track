// server/src/services/servicos.service.js
import { dbs } from "../database/sqlite.js";
import { makeScopedCrud } from "./base-crud.js";

const repo = makeScopedCrud(dbs.profissional, "servicos", {
  searchCols: ["titulo", "descricao"]
});

export async function listServicos({ ownerId, search }) {
  return repo.list({ ownerId, search });
}

export async function getServicoById({ ownerId, id }) {
  return repo.getById({ ownerId, id });
}

export async function createServico({ ownerId, titulo, descricao, preco_cents, duration_min = 30 }) {
  return repo.create({
    ownerId,
    data: {
      titulo,
      descricao: descricao || null,
      preco_cents: Number(preco_cents) || 0,
      duration_min: Number(duration_min) || 30
    }
  });
}

export async function updateServico({ ownerId, id, titulo, descricao, preco_cents, duration_min }) {
  return repo.update({
    ownerId,
    id,
    data: {
      titulo,
      descricao,
      preco_cents: Number.isFinite(Number(preco_cents)) ? Number(preco_cents) : undefined,
      duration_min: Number.isFinite(Number(duration_min)) ? Number(duration_min) : undefined
    }
  });
}

export async function deleteServico({ ownerId, id }) {
  return repo.remove({ ownerId, id });
}
