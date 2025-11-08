export function makeScopedCrud(dbHandle, table, { searchCols = [] } = {}) {
  function list({ ownerId, search }) {
    if (search && searchCols.length) {
      const like = `%${search.toLowerCase()}%`;
      const ors = searchCols.map(c => `lower(${c}) LIKE ?`).join(" OR ");
      const params = [ownerId, ...Array(searchCols.length).fill(like)];
      return dbHandle.prepare(`
        SELECT * FROM ${table}
        WHERE owner_id = ? AND (${ors})
        ORDER BY id DESC
      `).all(...params);
    }
    return dbHandle.prepare(`
      SELECT * FROM ${table}
      WHERE owner_id = ?
      ORDER BY id DESC
    `).all(ownerId);
  }

  function getById({ ownerId, id }) {
    return dbHandle.prepare(`
      SELECT * FROM ${table}
      WHERE owner_id = ? AND id = ?
    `).get(ownerId, id) || null;
  }

  function create({ ownerId, data }) {
    const cols = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = cols.map(() => "?").join(",");
    const stmt = dbHandle.prepare(`
      INSERT INTO ${table} (owner_id, ${cols.join(",")})
      VALUES (?, ${placeholders})
    `);
    const info = stmt.run(ownerId, ...vals);
    return getById({ ownerId, id: Number(info.lastInsertRowid) });
  }

  function update({ ownerId, id, data }) {
    const atual = getById({ ownerId, id });
    if (!atual) return null;

    const patches = [];
    const vals = [];
    for (const [k, v] of Object.entries(data)) {
      patches.push(`${k} = ?`);
      vals.push(v ?? atual[k]);
    }
    dbHandle.prepare(`
      UPDATE ${table}
         SET ${patches.join(", ")}
       WHERE owner_id = ? AND id = ?
    `).run(...vals, ownerId, id);

    return getById({ ownerId, id });
  }

  function remove({ ownerId, id }) {
    const info = dbHandle.prepare(`
      DELETE FROM ${table} WHERE owner_id = ? AND id = ?
    `).run(ownerId, id);
    return info.changes > 0;
  }

  return { list, getById, create, update, remove };
}