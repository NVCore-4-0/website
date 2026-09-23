const { sql, ensureSchema } = require('./_lib/db');
const { getDiscordUser, getStaffLevel } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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

  const tickets = await sql`
    SELECT
      t.id,
      t.username,
      t.subject,
      t.closed_by AS "closedBy",
      t.closed_at AS "closedAt",
      (SELECT COUNT(*) FROM ticket_messages m WHERE m.ticket_id = t.id) AS "messageCount",
      (
        SELECT json_agg(json_build_object('author', m.author, 'timestamp', m.created_at, 'content', m.content) ORDER BY m.created_at ASC)
        FROM ticket_messages m
        WHERE m.ticket_id = t.id
      ) AS "messages"
    FROM tickets t
    WHERE t.status = 'closed'
    ORDER BY t.closed_at DESC
    LIMIT 200
  `;

  res.status(200).json(tickets);
};
