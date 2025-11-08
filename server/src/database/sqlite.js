// server/src/database/sqlite.js
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const baseDir = path.join(process.cwd(), "src", "database");
fs.mkdirSync(baseDir, { recursive: true });

function connect(name) {
  const dbPath = path.join(baseDir, `${name}.db`);
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  console.log(`✅ Conectado ao banco ${name}.db`);
  return db;
}

// Conexões por domínio
export const dbs = {
  cliente:      connect("cliente"),
  animal:       connect("animal"),
  profissional: connect("profissional"),
  agendamento:  connect("agendamento"),
};

function ensureTables() {
  // cliente.db
  dbs.cliente.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      reset_token TEXT,
      reset_expires INTEGER
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      criado_em TEXT DEFAULT (datetime('now'))
    );
  `);

  // animal.db
  dbs.animal.exec(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      tutor_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      especie TEXT,
      idade INTEGER
    );
  `);

  // profissional.db
  dbs.profissional.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      preco_cents INTEGER NOT NULL
    );
  `);

  // agendamento.db
  dbs.agendamento.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      servico_id INTEGER NOT NULL,
      data_hora TEXT NOT NULL,
      status TEXT DEFAULT 'marcado',
      observacoes TEXT
    );
  `);

  // PROFISSIONAL.DB: coluna de duração nos serviços
try {
  dbs.profissional.exec(`ALTER TABLE servicos ADD COLUMN duration_min INTEGER DEFAULT 30;`);
  dbs.profissional.exec(`CREATE INDEX IF NOT EXISTS idx_servicos_owner ON servicos(owner_id);`);
} catch (e) {
  if (!String(e?.message||"").includes("duplicate column name")) throw e;
}

// PROFISSIONAL.DB: horários de trabalho semanais
dbs.profissional.exec(`
  CREATE TABLE IF NOT EXISTS horarios_trabalho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    dow TEXT NOT NULL,       -- 'mon','tue','wed','thu','fri','sat','sun'
    janela TEXT NOT NULL     -- ex.: '08:00-12:00'
  );
  CREATE INDEX IF NOT EXISTS idx_work_owner_dow ON horarios_trabalho(owner_id, dow);
`);

// AGENDAMENTO.DB: bloqueios que só aparecem na agenda admin
dbs.agendamento.exec(`
  CREATE TABLE IF NOT EXISTS bloqueios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    start_iso TEXT NOT NULL,
    end_iso   TEXT NOT NULL,
    reason    TEXT,
    kind      TEXT DEFAULT 'admin'
  );
  CREATE INDEX IF NOT EXISTS idx_bloq_owner_start ON bloqueios(owner_id, start_iso);
  CREATE INDEX IF NOT EXISTS idx_bloq_owner_end   ON bloqueios(owner_id, end_iso);
`);

// Índices úteis na agenda
dbs.agendamento.exec(`
  CREATE INDEX IF NOT EXISTS idx_agend_owner_data ON agendamentos(owner_id, data_hora);
  CREATE INDEX IF NOT EXISTS idx_agend_owner_status ON agendamentos(owner_id, status);
`);

}

// Garante que todas as tabelas sejam criadas
ensureTables();

// 👇 Exporta também "db" para compatibilidade com services que esperam um único db
// Por padrão vamos usar o banco de clientes/usuários como principal:
export const db = dbs.cliente;
