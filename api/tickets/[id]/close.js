const { sql, ensureSchema } = require('../../_lib/db');
const { getDiscordUser, getStaffLevel } = require('../../_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const ticketId = Number(req.query.id);
  if (!Number.isInteger(ticketId)) {
    res.status(400).json({ error: 'Invalid ticket id' });
    return;
  }

  await sql`
    UPDATE tickets
    SET status = 'closed', closed_at = now(), closed_by = ${user.username}
    WHERE id = ${ticketId}
  `;

  res.status(200).json({ ok: true });
};
