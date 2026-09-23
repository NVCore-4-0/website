const { sql, ensureSchema } = require('../../_lib/db');
const { getDiscordUser, getStaffLevel } = require('../../_lib/auth');

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
      (
        SELECT json_build_object('author', m.author, 'content', m.content)
        FROM ticket_messages m
        WHERE m.ticket_id = t.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS "lastMessage"
    FROM tickets t
    WHERE t.status = 'open'
    ORDER BY t.updated_at DESC
  `;

  res.status(200).json(tickets);
};
