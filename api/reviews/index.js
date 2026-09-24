const { sql, ensureSchema } = require('../_lib/db');
const { getDiscordUser } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  await ensureSchema();

  if (req.method === 'GET') {
    const reviews = await sql`
      SELECT id, username, avatar, content, created_at AS "createdAt"
      FROM reviews
      ORDER BY created_at DESC
      LIMIT 50
    `;
    res.status(200).json(reviews);
    return;
  }

  if (req.method === 'POST') {
    const user = await getDiscordUser(req);
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { content } = req.body || {};
    if (!content || typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ error: 'content is required' });
      return;
    }

    const [review] = await sql`
      INSERT INTO reviews (discord_id, username, avatar, content)
      VALUES (${user.id}, ${user.username}, ${user.avatar}, ${content.trim().slice(0, 500)})
      RETURNING id, username, avatar, content, created_at AS "createdAt"
    `;

    res.status(201).json(review);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
