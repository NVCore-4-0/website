const { sql, ensureSchema } = require('../_lib/db');
const { getDiscordUser } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  await ensureSchema();

  const user = await getDiscordUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  if (req.method === 'GET') {
    const tickets = await sql`
      SELECT
        t.id,
        t.subject,
        t.status,
        (
          SELECT json_build_object('author', m.author, 'content', m.content)
          FROM ticket_messages m
          WHERE m.ticket_id = t.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS "lastMessage"
      FROM tickets t
      WHERE t.discord_id = ${user.id}
      ORDER BY t.updated_at DESC
    `;
    res.status(200).json(tickets);
    return;
  }

  if (req.method === 'POST') {
    const { subject, message } = req.body || {};
    if (!subject || !message || typeof subject !== 'string' || typeof message !== 'string') {
      res.status(400).json({ error: 'subject and message are required' });
      return;
    }

    const [ticket] = await sql`
      INSERT INTO tickets (discord_id, username, subject)
      VALUES (${user.id}, ${user.username}, ${subject.slice(0, 200)})
      RETURNING id
    `;

    await sql`
      INSERT INTO ticket_messages (ticket_id, author_id, author, avatar, content, is_staff)
      VALUES (${ticket.id}, ${user.id}, ${user.username}, ${user.avatar}, ${message.slice(0, 4000)}, false)
    `;

    res.status(201).json({ id: ticket.id });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
