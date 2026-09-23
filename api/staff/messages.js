const { sql, ensureSchema } = require('../_lib/db');
const { getDiscordUser, getStaffLevel } = require('../_lib/auth');

// Single shared internal staff chat room — every staff member (Administrator,
// Management, Support Team) reads and writes the same conversation.
module.exports = async function handler(req, res) {
  await ensureSchema();

  const user = await getDiscordUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const staff = await getStaffLevel(user.id);
  if (!staff.isStaff) {
    res.status(403).json({ error: 'Staff access required' });
    return;
  }

  if (req.method === 'GET') {
    const since = Number(req.query.since) || 0;
    const rows = since
      ? await sql`
          SELECT id, author, avatar, content, author_id AS "authorId", created_at AS "timestamp"
          FROM staff_messages
          WHERE created_at > to_timestamp(${since} / 1000.0)
          ORDER BY created_at ASC
          LIMIT 200
        `
      : await sql`
          SELECT id, author, avatar, content, author_id AS "authorId", created_at AS "timestamp"
          FROM staff_messages
          ORDER BY created_at DESC
          LIMIT 100
        `;
    res.status(200).json(since ? rows : rows.reverse());
    return;
  }

  if (req.method === 'POST') {
    const { content } = req.body || {};
    if (!content || typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ error: 'content is required' });
      return;
    }

    await sql`
      INSERT INTO staff_messages (author_id, author, avatar, content)
      VALUES (${user.id}, ${user.username}, ${user.avatar}, ${content.trim().slice(0, 2000)})
    `;

    res.status(201).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
