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
  console.log(`Conectado ao banco ${name}.db`);
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
  //
  // ===== cliente.db =====
  //
  dbs.cliente.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      reset_token TEXT,
      reset_expires INTEGER
      -- role e owner_id adicionados via ALTER para manter compatibilidade
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      criado_em TEXT DEFAULT (datetime('now'))
      -- campos de endereço e user_id adicionados via ALTER/migração
    );
  `);

  // users.role e users.owner_id (idempotente)
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN owner_id INTEGER DEFAULT 1;`); } catch {}

  // clientes: colunas estendidas (tentativa por ALTER; se falhar, migração abaixo resolve)
  try { dbs.cliente.exec(`ALTER TABLE clientes ADD COLUMN endereco TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE clientes ADD COLUMN bairro TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE clientes ADD COLUMN cidade TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE clientes ADD COLUMN cep TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE clientes ADD COLUMN referencia TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE clientes ADD COLUMN observacoes TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE clientes ADD COLUMN user_id INTEGER UNIQUE;`); } catch {}

  // Migração robusta: se user_id não existir, reconstrói a tabela clientes e migra dados
  ensureClientesHasUserId();

  // Índices úteis
  dbs.cliente.exec(`
    CREATE INDEX IF NOT EXISTS idx_clientes_owner ON clientes(owner_id);
  `);

  //
  // ===== animal.db =====
  //
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

  //
  // ===== profissional.db =====
  //
  dbs.profissional.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      preco_cents INTEGER NOT NULL
      -- duration_min adicionada via ALTER
    );
  `);

  try {
    dbs.profissional.exec(`ALTER TABLE servicos ADD COLUMN duration_min INTEGER DEFAULT 30;`);
  } catch (e) {
    if (!String(e?.message || "").includes("duplicate column name")) throw e;
  }
  dbs.profissional.exec(`
    CREATE INDEX IF NOT EXISTS idx_servicos_owner ON servicos(owner_id);
  `);

  // Horários semanais de trabalho
  dbs.profissional.exec(`
    CREATE TABLE IF NOT EXISTS horarios_trabalho (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      dow TEXT NOT NULL CHECK (dow IN ('sun','mon','tue','wed','thu','fri','sat')),
      janela TEXT NOT NULL  -- ex.: '08:00-12:00'
    );
    CREATE INDEX IF NOT EXISTS idx_work_owner_dow ON horarios_trabalho(owner_id, dow);
  `);

  //
  // ===== agendamento.db =====
  //
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

  // Bloqueios administrativos
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

  // Índices na agenda
  dbs.agendamento.exec(`
    CREATE INDEX IF NOT EXISTS idx_agend_owner_data ON agendamentos(owner_id, data_hora);
    CREATE INDEX IF NOT EXISTS idx_agend_owner_status ON agendamentos(owner_id, status);
  `);
}

/**
 * Reconstrói a tabela clientes com todas as colunas esperadas se a coluna user_id não existir.
 * Mantém os dados existentes (id, owner_id, nome, email, telefone, criado_em).
 */
function ensureClientesHasUserId() {
  const cols = dbs.cliente.prepare(`PRAGMA table_info(clientes);`).all();
  const hasUserId = cols.some(c => c.name === "user_id");
  if (hasUserId) {
    console.log("clientes.user_id já existe");
    return;
  }

  console.warn("clientes.user_id ausente — reconstruindo tabela clientes...");

  dbs.cliente.exec("BEGIN TRANSACTION;");
  try {
    dbs.cliente.exec(`
      CREATE TABLE IF NOT EXISTS clientes__new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        email TEXT,
        telefone TEXT,
        criado_em TEXT DEFAULT (datetime('now')),
        endereco TEXT,
        bairro TEXT,
        cidade TEXT,
        cep TEXT,
        referencia TEXT,
        observacoes TEXT,
        user_id INTEGER UNIQUE
      );
    `);

    // Copia campos antigos; os novos ficam NULL por padrão
    dbs.cliente.exec(`
      INSERT INTO clientes__new (id, owner_id, nome, email, telefone, criado_em)
      SELECT id, owner_id, nome, email, telefone, COALESCE(criado_em, datetime('now'))
      FROM clientes;
    `);

    dbs.cliente.exec(`DROP TABLE clientes;`);
    dbs.cliente.exec(`ALTER TABLE clientes__new RENAME TO clientes;`);
    dbs.cliente.exec(`CREATE INDEX IF NOT EXISTS idx_clientes_owner ON clientes(owner_id);`);

    dbs.cliente.exec("COMMIT;");
    console.log("clientes reconstruída com user_id");
  } catch (e) {
    dbs.cliente.exec("ROLLBACK;");
    console.error("Falha migrando clientes:", e?.message || e);
    throw e;
  }
}

// Garante que todas as tabelas/índices sejam criados
ensureTables();

// Exporta "db" por compatibilidade (usa cliente.db como default)
export const db = dbs.cliente;