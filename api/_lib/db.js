const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

let schemaReady = null;

// Idempotent schema setup — runs automatically the first time any function touches
// the database in a given serverless instance. No manual migration step needed.
async function ensureSchema() {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        discord_id TEXT NOT NULL,
        username TEXT NOT NULL,
        subject TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        closed_at TIMESTAMPTZ,
        closed_by TEXT
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        author_id TEXT NOT NULL,
        author TEXT NOT NULL,
        avatar TEXT,
        content TEXT NOT NULL,
        is_staff BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_tickets_discord_id ON tickets(discord_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id)`;
  })();

  return schemaReady;
}

module.exports = { sql, ensureSchema };
