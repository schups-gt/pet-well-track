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
  
  // Verificação de email
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN verification_token TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN verification_expires INTEGER;`); } catch {}

  // Campos de perfil (telefone, endereço, etc.)
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN telefone TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN endereco TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN cidade TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN estado TEXT;`); } catch {}
  try { dbs.cliente.exec(`ALTER TABLE users ADD COLUMN cep TEXT;`); } catch {}

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
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id     INTEGER NOT NULL,
    cliente_id   INTEGER,     -- será garantido abaixo
    nome         TEXT NOT NULL,
    especie      TEXT,
    raca         TEXT,
    sexo         TEXT CHECK (sexo IN ('M','F','ND')) DEFAULT 'ND',
    nascimento   TEXT,
    peso_kg      REAL,
    castrado     INTEGER CHECK (castrado IN (0,1)) DEFAULT 0,
    microchip    TEXT UNIQUE,
    observacoes  TEXT,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT
  );
`);

// Renomear tutor_id -> cliente_id, se existir
try { dbs.animal.exec(`ALTER TABLE pets RENAME COLUMN tutor_id TO cliente_id;`); } catch {}

// Colunas novas (idempotentes)
for (const col of [
  "raca TEXT",
  "sexo TEXT CHECK (sexo IN ('M','F','ND')) DEFAULT 'ND'",
  "nascimento TEXT",
  "peso_kg REAL",
  "castrado INTEGER CHECK (castrado IN (0,1)) DEFAULT 0",
  "microchip TEXT UNIQUE",
  "observacoes TEXT",
  "created_at TEXT DEFAULT (datetime('now'))",
  "updated_at TEXT"
]) {
  try { dbs.animal.exec(`ALTER TABLE pets ADD COLUMN ${col};`); } catch {}
}

// Índices
dbs.animal.exec(`
  CREATE INDEX IF NOT EXISTS idx_pets_owner_cliente ON pets(owner_id, cliente_id);
  CREATE INDEX IF NOT EXISTS idx_pets_cliente        ON pets(cliente_id);
`);

  //
  // ===== profissional.db =====
  //
dbs.profissional.exec(`
  CREATE TABLE IF NOT EXISTS profissionais (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id      INTEGER NOT NULL,
    nome          TEXT NOT NULL,
    especialidade TEXT,
    telefone      TEXT,
    email         TEXT UNIQUE,
    ativo         INTEGER NOT NULL DEFAULT 1 CHECK(ativo IN (0,1))
  );
`);
try { dbs.profissional.exec(`CREATE INDEX idx_prof_owner ON profissionais(owner_id);`); } catch {}
try { dbs.profissional.exec(`CREATE INDEX idx_prof_ativo ON profissionais(owner_id, ativo);`); } catch {}

// Tabela antiga? migra se existir
try {
  const haveOld = dbs.profissional
    .prepare(`SELECT 1 FROM sqlite_master WHERE type='table' AND name='PROFISSIONAL'`)
    .get();
  if (haveOld) {
    dbs.profissional.exec(`
      CREATE TABLE IF NOT EXISTS profissionais_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        especialidade TEXT,
        telefone TEXT,
        email TEXT UNIQUE,
        ativo INTEGER NOT NULL DEFAULT 1 CHECK(ativo IN (0,1))
      );
      INSERT INTO profissionais_new (id, owner_id, nome, especialidade, telefone, email, ativo)
      SELECT id_pro, 1, nome, especialidade, telefone, email,
             CASE WHEN ativo IN ('S','s','1',1) THEN 1 ELSE 0 END
      FROM PROFISSIONAL;
      DROP TABLE PROFISSIONAL;
      ALTER TABLE profissionais_new RENAME TO profissionais;
    `);
  }
} catch {}

// horarios_trabalho (já ok)
dbs.profissional.exec(`
  CREATE TABLE IF NOT EXISTS horarios_trabalho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    dow TEXT NOT NULL CHECK (dow IN ('sun','mon','tue','wed','thu','fri','sat')),
    janela TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_work_owner_dow ON horarios_trabalho(owner_id, dow);
`);

// servicos (garante duration_min e índice)
dbs.profissional.exec(`
  CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    preco_cents INTEGER NOT NULL,
    duration_min INTEGER NOT NULL DEFAULT 30
  );
  CREATE INDEX IF NOT EXISTS idx_servicos_owner ON servicos(owner_id);
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
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id     INTEGER NOT NULL,
      cliente_id   INTEGER NOT NULL,
      pet_id       INTEGER,
      servico_id   INTEGER NOT NULL,
      data_inicio  TEXT NOT NULL,
      data_fim     TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'marcado'
                   CHECK (status IN ('marcado','confirmado','realizado','cancelado','nao_compareceu')),
      observacoes  TEXT,
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_ag_owner_inicio  ON agendamentos(owner_id, data_inicio);
    CREATE INDEX IF NOT EXISTS idx_ag_owner_fim     ON agendamentos(owner_id, data_fim);
    CREATE INDEX IF NOT EXISTS idx_ag_owner_status  ON agendamentos(owner_id, status);
    CREATE INDEX IF NOT EXISTS idx_ag_cliente       ON agendamentos(cliente_id);
  `);

  dbs.agendamento.exec(`
    CREATE TABLE IF NOT EXISTS bloqueios (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id   INTEGER NOT NULL,
      start_iso  TEXT NOT NULL,
      end_iso    TEXT NOT NULL,
      reason     TEXT,
      kind       TEXT NOT NULL DEFAULT 'admin'
                 CHECK (kind IN ('admin','ferias','manutencao','evento')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_bloq_owner_start ON bloqueios(owner_id, start_iso);
    CREATE INDEX IF NOT EXISTS idx_bloq_owner_end   ON bloqueios(owner_id, end_iso);
  `);

  // Migrações idempotentes
  try { dbs.agendamento.exec(`ALTER TABLE agendamentos RENAME COLUMN data_hora TO data_inicio;`); } catch {}
  try { dbs.agendamento.exec(`ALTER TABLE agendamentos ADD COLUMN data_fim TEXT;`); } catch {}
  try { dbs.agendamento.exec(`ALTER TABLE agendamentos ADD COLUMN pet_id INTEGER;`); } catch {}
  try { dbs.agendamento.exec(`ALTER TABLE agendamentos ADD COLUMN created_at TEXT DEFAULT (datetime('now'));`); } catch {}
  try { dbs.agendamento.exec(`ALTER TABLE agendamentos ADD COLUMN updated_at TEXT;`); } catch {}

  // Preenche data_fim ausente (+30 min provisório)
  dbs.agendamento.exec(`
    UPDATE agendamentos
    SET data_fim = datetime(data_inicio, '+30 minutes')
    WHERE data_fim IS NULL AND data_inicio IS NOT NULL;
  `);

  // Triggers anti-overlap (recria para garantir versão mais nova)
  dbs.agendamento.exec(`DROP TRIGGER IF EXISTS trg_ag_no_overlap_ins;`);
  dbs.agendamento.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_ag_no_overlap_ins
    BEFORE INSERT ON agendamentos
    FOR EACH ROW
    BEGIN
      -- intervalo válido
      SELECT CASE
        WHEN datetime(NEW.data_fim) <= datetime(NEW.data_inicio)
        THEN RAISE(ABORT, 'Intervalo inválido: data_fim <= data_inicio')
      END;

      -- conflito com agendamentos existentes do mesmo owner
      SELECT CASE
        WHEN EXISTS (
          SELECT 1 FROM agendamentos a
          WHERE a.owner_id = NEW.owner_id
            AND a.status IN ('marcado','confirmado')
            AND NEW.status IN ('marcado','confirmado')
            AND datetime(NEW.data_inicio) < datetime(a.data_fim)
            AND datetime(NEW.data_fim)    > datetime(a.data_inicio)
        )
        THEN RAISE(ABORT, 'Conflito de agenda para este owner')
      END;
    END;
  `);

  dbs.agendamento.exec(`DROP TRIGGER IF EXISTS trg_ag_no_overlap_upd;`);
  dbs.agendamento.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_ag_no_overlap_upd
    BEFORE UPDATE ON agendamentos
    FOR EACH ROW
    BEGIN
      -- intervalo válido
      SELECT CASE
        WHEN datetime(NEW.data_fim) <= datetime(NEW.data_inicio)
        THEN RAISE(ABORT, 'Intervalo inválido: data_fim <= data_inicio')
      END;

      -- conflito com outros agendamentos do mesmo owner
      SELECT CASE
        WHEN EXISTS (
          SELECT 1 FROM agendamentos a
          WHERE a.id <> OLD.id
            AND a.owner_id = NEW.owner_id
            AND a.status IN ('marcado','confirmado')
            AND NEW.status IN ('marcado','confirmado')
            AND datetime(NEW.data_inicio) < datetime(a.data_fim)
            AND datetime(NEW.data_fim)    > datetime(a.data_inicio)
        )
        THEN RAISE(ABORT, 'Conflito de agenda para este owner')
      END;

      -- timestamp de atualização
      SELECT NEW.updated_at = datetime('now');
    END;
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
    // Tabela nova com as colunas estendidas
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