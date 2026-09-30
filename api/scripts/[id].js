const UPSTREAM = 'http://ny-us-01.soulixer.in:25432';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(400).json({ error: 'A Discord user id is required' });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(`${UPSTREAM}/api/user/scripts/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(body);
  } catch (error) {
    res.status(error.name === 'AbortError' ? 504 : 502).json({
      error: 'Scripts service is temporarily unavailable',
    });
  } finally {
    clearTimeout(timeout);
  }
};
