const UPSTREAM = 'http://ny-us-01.soulixer.in:25432'

export default async function handler(req, res) {
  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : ''
  const query = new URLSearchParams(req.query)
  query.delete('path')
  const suffix = query.toString() ? `?${query.toString()}` : ''

  try {
    const upstream = await fetch(`${UPSTREAM}/api/tickets/${path}${suffix}`, {
      method: req.method,
      headers: {
        ...(req.headers.authorization ? { authorization: req.headers.authorization } : {}),
        ...(req.headers['content-type'] ? { 'content-type': req.headers['content-type'] } : {}),
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    })

    const text = await upstream.text()
    res.status(upstream.status)
    res.setHeader('content-type', upstream.headers.get('content-type') || 'application/json')
    res.send(text)
  } catch {
    res.status(502).json({ error: 'Support service unavailable' })
  }
}
