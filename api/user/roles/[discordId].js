const { getDiscordUser, getGuildRoles } = require('../../_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // The caller must present a valid Discord access token, and it must belong to
  // the same account whose roles are being requested — no looking up other users.
  const user = await getDiscordUser(req);
  if (!user || user.id !== req.query.discordId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const roles = await getGuildRoles(user.id);
  res.status(200).json({ roles });
};
