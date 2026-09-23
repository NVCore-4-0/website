const ADMIN_ROLE_IDS = ['1551997765889040567', '1411252422055297135'];
const MANAGEMENT_ROLE_IDS = ['1551997271409954836'];
const SUPPORT_ROLE_IDS = ['1411289079282139226'];
const STAFF_ROLE_IDS = [...ADMIN_ROLE_IDS, ...MANAGEMENT_ROLE_IDS, ...SUPPORT_ROLE_IDS];

// Verifies the caller's Discord access token by asking Discord who it belongs to.
// Never trust a discordId/username the client sends — always resolve identity from the token.
async function getDiscordUser(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const res = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;

  const user = await res.json();
  return {
    id: user.id,
    username: user.global_name || user.username,
    avatar: user.avatar
  };
}

// Looks up a user's role IDs in your guild using the bot token — never exposed to the client.
async function getGuildRoles(discordId) {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!guildId || !botToken) return [];

  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordId}`, {
    headers: { Authorization: `Bot ${botToken}` }
  });
  if (!res.ok) return [];

  const member = await res.json();
  return Array.isArray(member.roles) ? member.roles : [];
}

async function getStaffLevel(discordId) {
  const roles = await getGuildRoles(discordId);
  return {
    isAdministrator: roles.some((r) => ADMIN_ROLE_IDS.includes(r)),
    isManagement: roles.some((r) => MANAGEMENT_ROLE_IDS.includes(r)),
    isSupportTeam: roles.some((r) => SUPPORT_ROLE_IDS.includes(r)),
    isStaff: roles.some((r) => STAFF_ROLE_IDS.includes(r))
  };
}

module.exports = { getDiscordUser, getGuildRoles, getStaffLevel };
