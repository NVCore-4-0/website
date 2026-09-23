const { sql, ensureSchema } = require('../../_lib/db');
const { getDiscordUser, getStaffLevel } = require('../../_lib/auth');

module.exports = async function handler(req, res) {
  await ensureSchema();

  const user = await getDiscordUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const ticketId = Number(req.query.id);
  if (!Number.isInteger(ticketId)) {
    res.status(400).json({ error: 'Invalid ticket id' });
    return;
  }

  const [ticket] = await sql`SELECT id, discord_id FROM tickets WHERE id = ${ticketId}`;
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  const staff = await getStaffLevel(user.id);
  const isOwner = ticket.discord_id === user.id;
  if (!isOwner && !staff.isStaff) {
    res.status(403).json({ error: 'Not authorized to view this ticket' });
    return;
  }

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT author, avatar, content, is_staff AS "isStaff", created_at AS "timestamp"
      FROM ticket_messages
      WHERE ticket_id = ${ticketId}
      ORDER BY created_at ASC
    `;
    res.status(200).json(rows);
    return;
  }

  if (req.method === 'POST') {
    const { content } = req.body || {};
    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'content is required' });
      return;
    }

    await sql`
      INSERT INTO ticket_messages (ticket_id, author_id, author, avatar, content, is_staff)
      VALUES (${ticketId}, ${user.id}, ${user.username}, ${user.avatar}, ${content.slice(0, 4000)}, ${staff.isStaff})
    `;
    await sql`UPDATE tickets SET updated_at = now() WHERE id = ${ticketId}`;

    res.status(201).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
