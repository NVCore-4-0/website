module.exports = function handler(req, res) {
  res.status(200).json({
    ok: true,
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasBotToken: Boolean(process.env.DISCORD_BOT_TOKEN),
      hasGuildId: Boolean(process.env.DISCORD_GUILD_ID)
    }
  });
};
