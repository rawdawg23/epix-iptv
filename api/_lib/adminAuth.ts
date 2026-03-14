export function isAdmin(req: { headers?: Record<string, string | string[] | undefined> }): boolean {
  const secret = req.headers?.['x-admin-secret'];
  const value = Array.isArray(secret) ? secret[0] : secret;
  return !!(process.env.ADMIN_SECRET && value === process.env.ADMIN_SECRET);
}

export function requireAdmin(
  req: { headers?: Record<string, string | string[] | undefined> },
  res: { status: (code: number) => { json: (body: object) => void } }
): boolean {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
